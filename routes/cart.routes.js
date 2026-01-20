const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

// Ver el carrito
router.get('/cart', isAuthenticated, cartController.getCart);

// Añadir un producto al carrito
router.post('/cart/add', isAuthenticated, cartController.addToCart);

// Eliminar un producto del carrito
router.post('/cart/remove/:productId', isAuthenticated, cartController.removeFromCart);

// Ruta para checkout
router.get('/checkout', isAuthenticated, cartController.checkout);

module.exports = router;
