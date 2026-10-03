require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

if (!PORT || !MONGO_URI) {
  console.error('Thiếu PORT hoặc MONGO_URI trong file .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Đã kết nối MongoDB'))
  .catch((err) => { console.error('Lỗi kết nối MongoDB:', err.message); process.exit(1); });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', productRoutes);

// 404
app.use((req, res) => res.status(404).render('error', { title: 'Không tìm thấy', message: 'Trang bạn tìm không tồn tại.' }));

// Xử lý lỗi chung
app.use((err, req, res, next) => {
  console.error(err);
  const notFound = err.name === 'CastError';
  res.status(notFound ? 404 : 400).render('error', {
    title: notFound ? 'Không tìm thấy' : 'Có lỗi xảy ra',
    message: notFound ? 'Sản phẩm không tồn tại.' : err.message
  });
});

app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
