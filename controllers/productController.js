const fs = require('fs');
const path = require('path');
const Product = require('../models/product');

const removeImage = (imageUrl) => {
  if (!imageUrl) return;
  fs.unlink(path.join(__dirname, '..', 'public', imageUrl), () => {});
};
const notFound = () => Object.assign(new Error('Not found'), { name: 'CastError' });

// Danh sách sản phẩm
exports.getAllProducts = async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.render('index', { title: 'Sản phẩm', products, q: '' });
};

// Form thêm
exports.showAddProductForm = (req, res) => {
  res.render('add', { title: 'Thêm sản phẩm', q: '' });
};

// Thêm sản phẩm
exports.addProduct = async (req, res) => {
  if (!req.file) throw new Error('Vui lòng chọn hình ảnh cho sản phẩm.');
  const { name, price, quantity } = req.body;
  try {
    await Product.create({ name, price, quantity, image: `/uploads/${req.file.filename}` });
  } catch (err) {
    removeImage(`/uploads/${req.file.filename}`);
    throw err;
  }
  res.redirect('/');
};

// Form sửa
exports.showEditProductForm = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw notFound();
  res.render('edit', { title: 'Sửa sản phẩm', product, q: '' });
};

// Cập nhật
exports.updateProduct = async (req, res) => {
  const { name, price, quantity } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) throw notFound();

  product.set({ name, price, quantity });
  const oldImage = product.image;
  if (req.file) product.image = `/uploads/${req.file.filename}`;
  await product.save();
  if (req.file) removeImage(oldImage);
  res.redirect(`/products/${product._id}`);
};

// Xóa
exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) removeImage(product.image);
  res.redirect('/');
};

// Chi tiết
exports.showProductDetail = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw notFound();
  res.render('show', { title: product.name, product, q: '' });
};

// Tìm theo tên
exports.searchProduct = async (req, res) => {
  const q = (req.query.q || '').trim();
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const products = await Product.find({ name: { $regex: safe, $options: 'i' } }).sort({ createdAt: -1 });
  res.render('index', { title: q ? `Tìm "${q}"` : 'Sản phẩm', products, q });
};
