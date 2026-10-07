require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Thiếu MONGO_URI trong file .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Đã kết nối MongoDB'))
  .catch((error) => {
    console.error('Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.locals.formatVnd = (value) => new Intl.NumberFormat('vi-VN', {
  style: 'currency', currency: 'VND', maximumFractionDigits: 0
}).format(value);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentYear = new Date().getFullYear();
  next();
});

app.use('/', productRoutes);

app.use((req, res) => res.status(404).render('error', {
  title: 'Không tìm thấy trang',
  message: 'Trang bạn đang tìm không tồn tại hoặc đã được di chuyển.'
}));

app.use((error, req, res, next) => {
  console.error(error);
  const isNotFound = error.status === 404 || error.name === 'CastError';
  const isDuplicateSku = error.code === 11000;
  res.status(isNotFound ? 404 : 400).render('error', {
    title: isNotFound ? 'Không tìm thấy sản phẩm' : 'Không thể hoàn tất',
    message: isDuplicateSku ? 'Mã SKU đã tồn tại. Vui lòng chọn một mã khác.' : error.message
  });
});

app.listen(PORT, () => console.log(`NESTA đang chạy tại http://localhost:${PORT}`));
