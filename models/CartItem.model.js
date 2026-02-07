// models/CartItem.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      cartId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "cart_id",
      },

      productId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "product_id",
      },

      quantity: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        validate: { min: 1 },
      },
    },
    {
      tableName: "cart_items",
      timestamps: true,
      underscored: true,
      indexes: [
  { unique: true, fields: ["cartId", "productId"] },
  ],
    }
  );

  return CartItem;
};