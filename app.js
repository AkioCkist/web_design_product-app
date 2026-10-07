require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');
const path = require('path');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is missing from .env');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
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
app.use(session({
  secret: process.env.SESSION_SECRET || 'nesta-local-demo-session',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentYear = new Date().getFullYear();
  res.locals.cartCount = Object.values(req.session.cart || {}).reduce((total, quantity) => total + Number(quantity), 0);
  next();
});

app.use('/', cartRoutes);
app.use('/', productRoutes);

app.use((req, res) => res.status(404).render('error', {
  title: 'Page not found',
  message: 'The page you are looking for does not exist or has moved.'
}));

app.use((error, req, res, next) => {
  console.error(error);
  const isNotFound = error.status === 404 || error.name === 'CastError';
  const isDuplicateSku = error.code === 11000;
  res.status(isNotFound ? 404 : 400).render('error', {
    title: isNotFound ? 'Product not found' : 'Something went wrong',
    message: isDuplicateSku ? 'This SKU already exists. Please choose another one.' : error.message
  });
});

app.listen(PORT, () => console.log(`NESTA is running at http://localhost:${PORT}`));
