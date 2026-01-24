// models/Product.model.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      name: { type: DataTypes.STRING(120), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },

      ownerId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: "owner_id",
      },

      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

      images: {
        type: DataTypes.JSON, // array de strings
        allowNull: false,
        defaultValue: [],
      },

      unit: {
        type: DataTypes.ENUM("Kilograms", "Liters", "Units", "Others"),
        allowNull: false,
        defaultValue: "Units",
      },

      categories: {
        type: DataTypes.JSON, // [{category, subcategories:[]}]
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      tableName: "products",
      timestamps: true,
      underscored: true,
    }
  );

  return Product;
};