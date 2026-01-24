// models/Cart.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Cart = sequelize.define(
    "Cart",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        unique: true,       // <- 1 carrito por usuario
        field: "user_id",
      },
    },
    {
      tableName: "carts",
      timestamps: true,
      underscored: true,
    }
  );

  return Cart;
};