const express = require('express');
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');

const router = express.Router();
const imageExtensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'public', 'uploads')),
  filename: (req, file, cb) => {
    const safeName = path.basename(file.originalname, path.extname(file.originalname))
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'product';
    cb(null, `${Date.now()}-${safeName}${imageExtensions[file.mimetype]}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => imageExtensions[file.mimetype]
    ? cb(null, true)
    : cb(new Error('Only JPG, PNG, and WEBP images are accepted.'))
});

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', wrap(productController.home));
router.get('/products', wrap(productController.getAllProducts));
router.get('/products/:id', wrap(productController.showProductDetail));
router.get('/search', productController.searchRedirect);

router.get('/admin/products', wrap(productController.adminProducts));
router.get('/admin/products/new', productController.showAddProductForm);
router.post('/admin/products', upload.single('image'), wrap(productController.addProduct));
router.get('/admin/products/:id/edit', wrap(productController.showEditProductForm));
router.put('/admin/products/:id', upload.single('image'), wrap(productController.updateProduct));
router.delete('/admin/products/:id', wrap(productController.deleteProduct));

router.get('/add', (req, res) => res.redirect('/admin/products/new'));
router.get('/edit/:id', (req, res) => res.redirect(`/admin/products/${req.params.id}/edit`));

module.exports = router;
