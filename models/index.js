// models/index.js
const sequelize = require("../config/db.config");

const UserModel = require("./User.model");
const ProductModel = require("./Product.model");
const CartModel = require("./Cart.model");
const CartItemModel = require("./CartItem.model");

const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const Cart = CartModel(sequelize);
const CartItem = CartItemModel(sequelize);

// RELACIONES

// User -> Products (1:N)
User.hasMany(Product, { foreignKey: "ownerId", as: "products" });
Product.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

// User -> Cart (1:1)
User.hasOne(Cart, { foreignKey: "userId", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

// Cart <-> Product (N:M) via CartItem
Cart.belongsToMany(Product, {
  through: CartItem,
  foreignKey: "cartId",
  otherKey: "productId",
  as: "products",
});
Product.belongsToMany(Cart, {
  through: CartItem,
  foreignKey: "productId",
  otherKey: "cartId",
  as: "carts",
});

// Por si quieres acceder a items directamente
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  CartItem,
};