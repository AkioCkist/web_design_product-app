const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/cart', wrap(cartController.showCart));
router.post('/cart/items/:id', wrap(cartController.addItem));
router.post('/cart/items/:id/update', wrap(cartController.updateItem));
router.delete('/cart/items/:id', wrap(cartController.removeItem));
router.get('/checkout', wrap(cartController.showCheckout));
router.post('/checkout', wrap(cartController.completeCheckout));
router.get('/checkout/success', cartController.showSuccess);

module.exports = router;
