const mongoose = require('mongoose');
const Product = require('../models/product');

const FREE_SHIPPING_THRESHOLD = 2000000;
const STANDARD_SHIPPING = 120000;

const getCart = (req) => {
  if (!req.session.cart) req.session.cart = {};
  return req.session.cart;
};

const toQuantity = (value) => {
  const quantity = Number.parseInt(value, 10);
  return Number.isFinite(quantity) ? quantity : 1;
};

const buildCart = async (req) => {
  const cart = getCart(req);
  const ids = Object.keys(cart).filter((id) => mongoose.isValidObjectId(id));
  const products = ids.length ? await Product.find({ _id: { $in: ids } }) : [];
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));
  const items = [];

  for (const id of Object.keys(cart)) {
    const product = productMap.get(id);
    if (!product || product.quantity < 1) {
      delete cart[id];
      continue;
    }

    const quantity = Math.min(Math.max(toQuantity(cart[id]), 1), product.quantity);
    cart[id] = quantity;
    items.push({ product, quantity, lineTotal: product.price * quantity });
  }

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);
  const shipping = items.length && subtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING : 0;
  return { items, subtotal, shipping, total: subtotal + shipping, freeShippingThreshold: FREE_SHIPPING_THRESHOLD };
};

exports.showCart = async (req, res) => {
  const summary = await buildCart(req);
  const notice = req.query.added ? 'Item added to your cart.'
    : req.query.updated ? 'Cart updated.'
      : req.query.removed ? 'Item removed from your cart.' : '';
  res.render('cart', { title: 'Your cart', ...summary, notice });
};

exports.addItem = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw Object.assign(new Error('Product not found.'), { status: 404 });
  if (product.quantity < 1) throw new Error('This product is currently out of stock.');

  const cart = getCart(req);
  const id = product._id.toString();
  const requested = Math.max(toQuantity(req.body.quantity), 1);
  cart[id] = Math.min((cart[id] || 0) + requested, product.quantity);
  res.redirect('/cart?added=1');
};

exports.updateItem = async (req, res) => {
  const cart = getCart(req);
  const product = await Product.findById(req.params.id);
  if (!product) throw Object.assign(new Error('Product not found.'), { status: 404 });

  const quantity = toQuantity(req.body.quantity);
  if (quantity <= 0) delete cart[req.params.id];
  else cart[req.params.id] = Math.min(quantity, product.quantity);
  res.redirect('/cart?updated=1');
};

exports.removeItem = (req, res) => {
  const cart = getCart(req);
  delete cart[req.params.id];
  res.redirect('/cart?removed=1');
};

exports.showCheckout = async (req, res) => {
  const summary = await buildCart(req);
  if (!summary.items.length) return res.redirect('/cart');
  res.render('checkout', { title: 'Checkout', ...summary, values: {}, error: '' });
};

exports.completeCheckout = async (req, res) => {
  const summary = await buildCart(req);
  if (!summary.items.length) return res.redirect('/cart');

  const values = {
    firstName: String(req.body.firstName || '').trim(),
    lastName: String(req.body.lastName || '').trim(),
    email: String(req.body.email || '').trim(),
    address: String(req.body.address || '').trim(),
    city: String(req.body.city || '').trim(),
    postalCode: String(req.body.postalCode || '').trim(),
    paymentMethod: req.body.paymentMethod
  };
  const validPayment = ['demo-card', 'cash-on-delivery'].includes(values.paymentMethod);

  if (!values.firstName || !values.lastName || !values.email || !values.address || !values.city || !validPayment) {
    return res.status(400).render('checkout', {
      title: 'Checkout', ...summary, values,
      error: 'Please complete all required fields and choose a payment method.'
    });
  }

  const orderNumber = `NS-${Date.now().toString().slice(-8).toUpperCase()}`;
  req.session.lastOrder = {
    orderNumber,
    customerName: `${values.firstName} ${values.lastName}`,
    email: values.email,
    total: summary.total,
    itemCount: summary.items.reduce((total, item) => total + item.quantity, 0),
    paymentLabel: values.paymentMethod === 'demo-card' ? 'Demo card · Approved' : 'Pay on delivery',
    createdAt: new Date().toISOString()
  };
  req.session.cart = {};
  req.session.save(() => res.redirect('/checkout/success'));
};

exports.showSuccess = (req, res) => {
  if (!req.session.lastOrder) return res.redirect('/products');
  res.render('checkout-success', { title: 'Order confirmed', order: req.session.lastOrder });
};

exports.buildCart = buildCart;
