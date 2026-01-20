const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');

// Añadir un producto al carrito
exports.addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.currentUser._id; // Asume que el usuario está autenticado

    

    // Buscar o crear el carrito del usuario
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Buscar si el producto ya está en el carrito
    const existingProductIndex = cart.products.findIndex(p =>
      p.product.equals(productId)
    );

    if (existingProductIndex >= 0) {
      // Incrementar la cantidad si ya existe
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Añadir un nuevo producto al carrito
      cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();
    res.redirect('/cart'); // Redirige a la vista del carrito
  } catch (error) {
    next(error);
  }
};

// Ver el carrito
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.currentUser._id;
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    res.render('cart/cart', { cart });
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.currentUser._id;

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.products = cart.products.filter(p => !p.product.equals(productId));
      await cart.save();
    }

    res.redirect('/cart');
  } catch (error) {
    next(error);
  }
};


exports.checkout = async (req, res, next) => {
  try {
    const userId = req.currentUser._id;
    const cart = await Cart.findOne({ user: userId }).populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.redirect('/cart'); // Si el carrito está vacío, redirige
    }

    // Preparar datos del carrito para Stripe
    const cartProducts = cart.products.map(item => ({
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    // Calcular total (opcional, se puede hacer en front o directamente en el back)
    const total = cartProducts.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    res.render('payment/checkout', { cartProducts, total });
  } catch (error) {
    next(error);
  }
};

