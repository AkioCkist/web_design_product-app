const mongoose = require('mongoose');

const CATEGORIES = ['Nội thất', 'Chiếu sáng', 'Trang trí', 'Phòng bếp'];

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  sku: { type: String, required: true, trim: true, uppercase: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, enum: CATEGORIES },
  summary: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  material: { type: String, required: true, trim: true, maxlength: 100 },
  color: { type: String, required: true, trim: true, maxlength: 80 },
  dimensions: { type: String, required: true, trim: true, maxlength: 100 },
  image: { type: String, required: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ name: 'text', summary: 'text', category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
module.exports.CATEGORIES = CATEGORIES;
