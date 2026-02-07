const { Cart, CartItem, Product } = require("../models");

// Helper: obtener o crear carrito del usuario (1:1)
async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ where: { userId } });
  if (!cart) cart = await Cart.create({ userId });
  return cart;
}

// Ver el carrito
exports.getCart = async (req, res, next) => {
  try {
    const userId = req.currentUser.id; // Sequelize -> id (no _id)

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    // Para que la vista no pete si no hay carrito aún:
    const safeCart = cart || { items: [] };

    res.render("cart/cart", { cart: safeCart });
  } catch (error) {
    next(error);
  }
};

// Añadir un producto al carrito
exports.addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userId = req.currentUser.id;

    // Aseguramos que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) return next({ status: 404, message: "Product not found" });

    const cart = await getOrCreateCart(userId);

    // Si ya existe item (cartId + productId) -> incrementa quantity
    const [item, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productId: product.id },
      defaults: { quantity: 1 },
    });

    if (!created) {
      await item.increment("quantity", { by: 1 });
    }

    res.redirect("/cart");
  } catch (error) {
    next(error);
  }
};

// Eliminar un producto del carrito
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userId = req.currentUser.id;

    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) return res.redirect("/cart");

    await CartItem.destroy({
      where: { cartId: cart.id, productId: Number(productId) },
    });

    res.redirect("/cart");
  } catch (error) {
    next(error);
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const userId = req.currentUser.id;

    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!cart || cart.items.length === 0) return res.redirect("/cart");

    const cartProducts = cart.items.map((item) => ({
      name: item.product.name,
      price: Number(item.product.price),
      quantity: item.quantity,
    }));

    const total = cartProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    res.render("payment/checkout", { cartProducts, total });
  } catch (error) {
    next(error);
  }
};