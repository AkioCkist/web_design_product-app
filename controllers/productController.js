const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const { CATEGORIES } = require('../models/product');

const uploadRoot = path.join(__dirname, '..', 'public');
const sortOptions = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  name: { name: 1 }
};

const removeImage = (imageUrl) => {
  if (!imageUrl || path.basename(imageUrl).startsWith('nesta-')) return;
  fs.unlink(path.join(uploadRoot, imageUrl), () => {});
};

const notFound = () => Object.assign(new Error('Product not found.'), { status: 404 });
const clean = (value) => typeof value === 'string' ? value.trim() : value;

const productFields = (body) => ({
  name: clean(body.name),
  sku: clean(body.sku)?.toUpperCase(),
  price: Number(body.price),
  quantity: Number(body.quantity),
  category: clean(body.category),
  summary: clean(body.summary),
  description: clean(body.description),
  material: clean(body.material),
  color: clean(body.color),
  dimensions: clean(body.dimensions),
  featured: body.featured === 'on'
});

exports.home = async (req, res) => {
  const [featured, categoryStats] = await Promise.all([
    Product.find({ featured: true }).sort({ createdAt: -1 }).limit(4),
    Product.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }])
  ]);

  const categoryCounts = Object.fromEntries(categoryStats.map((item) => [item._id, item.count]));
  res.render('home', { title: 'Minimal objects for considered living', featured, categoryCounts, categories: CATEGORIES });
};

exports.getAllProducts = async (req, res) => {
  const q = clean(req.query.q || '');
  const category = CATEGORIES.includes(req.query.category) ? req.query.category : '';
  const sort = sortOptions[req.query.sort] ? req.query.sort : 'newest';
  const query = {};

  if (q) {
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: safe, $options: 'i' } },
      { summary: { $regex: safe, $options: 'i' } },
      { sku: { $regex: safe, $options: 'i' } }
    ];
  }
  if (category) query.category = category;

  const products = await Product.find(query).sort(sortOptions[sort]);
  res.render('products', { title: 'All products', products, q, category, sort, categories: CATEGORIES });
};

exports.showProductDetail = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw notFound();
  const related = await Product.find({ _id: { $ne: product._id }, category: product.category }).limit(3);
  res.render('show', { title: product.name, product, related });
};

exports.adminProducts = async (req, res) => {
  const products = await Product.find().sort({ updatedAt: -1 });
  const notice = req.query.created ? 'Product created successfully.'
    : req.query.updated ? 'Changes saved successfully.'
      : req.query.deleted ? 'Product deleted successfully.' : '';
  res.render('admin/index', { title: 'Manage products', products, notice });
};

exports.showAddProductForm = (req, res) => {
  res.render('admin/form-page', { title: 'Add product', product: null, categories: CATEGORIES, formAction: '/admin/products', submitLabel: 'Create product' });
};

exports.addProduct = async (req, res) => {
  if (!req.file) throw new Error('Please choose a product image.');
  try {
    await Product.create({ ...productFields(req.body), image: `/uploads/${req.file.filename}` });
  } catch (error) {
    removeImage(`/uploads/${req.file.filename}`);
    throw error;
  }
  res.redirect('/admin/products?created=1');
};

exports.showEditProductForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw notFound();
  res.render('admin/form-page', { title: 'Edit product', product, categories: CATEGORIES, formAction: `/admin/products/${product._id}?_method=PUT`, submitLabel: 'Save changes' });
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    if (req.file) removeImage(`/uploads/${req.file.filename}`);
    throw notFound();
  }

  const oldImage = product.image;
  product.set(productFields(req.body));
  if (req.file) product.image = `/uploads/${req.file.filename}`;

  try {
    await product.save();
  } catch (error) {
    if (req.file) removeImage(`/uploads/${req.file.filename}`);
    throw error;
  }

  if (req.file) removeImage(oldImage);
  res.redirect('/admin/products?updated=1');
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) removeImage(product.image);
  res.redirect('/admin/products?deleted=1');
};

exports.searchRedirect = (req, res) => {
  const params = new URLSearchParams();
  if (req.query.q) params.set('q', req.query.q);
  res.redirect(`/products${params.toString() ? `?${params}` : ''}`);
};
