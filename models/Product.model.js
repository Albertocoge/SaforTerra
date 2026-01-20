const mongoose = require('mongoose');
const CATEGORIES = require('../data/categories');
const REQUIRED_FIELD = 'Campo requerido';
// Extract category names from CATEGORIES
const categoryNames = CATEGORIES.map((categoryObj) => categoryObj.category);
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, REQUIRED_FIELD],
    },
    description: {
      type: String,
      required: [true, REQUIRED_FIELD],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, REQUIRED_FIELD],
      ref: 'User',
    },
    price: {
      type: Number,
      required: [true, REQUIRED_FIELD],
    },
    images: {
      type: [String],
      required: [true, REQUIRED_FIELD],
    },
    unit: {
      type: String,
      required: [true, REQUIRED_FIELD],
      enum: ['Kilograms', 'Liters', 'Units', 'Others'],
      default: 'Units',
    },
    categories: [
      {
        category: {
          type: String,
          enum: CATEGORIES.map(category => category.value), // Use the array of category names for validation
          required: [true, REQUIRED_FIELD],
        },
        subcategories: {
          type: [String], // Array of strings for subcategories
          default: [], // Default to an empty array
          required :[true ,REQUIRED_FIELD]
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model('Product', productSchema);
module.exports = Product;