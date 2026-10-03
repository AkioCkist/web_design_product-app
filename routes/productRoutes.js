const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Chỉ chấp nhận file hình ảnh.'))
});

// Chuyển lỗi async cho error handler
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

router.get('/', wrap(productController.getAllProducts));
router.get('/add', productController.showAddProductForm);
router.post('/add', upload.single('image'), wrap(productController.addProduct));
router.get('/edit/:id', wrap(productController.showEditProductForm));
router.post('/edit/:id', upload.single('image'), wrap(productController.updateProduct));
router.post('/delete/:id', wrap(productController.deleteProduct));
router.get('/products/:id', wrap(productController.showProductDetail));
router.get('/search', wrap(productController.searchProduct));

module.exports = router;
