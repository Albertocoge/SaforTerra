/* module.exports.getHome = (req, res, next) => {
    res.render('home');
  }

  */
 
 const Product = require('../models/Product.model');
module.exports.getHome = async (req, res, next) => {
  try {
    // Recuperar todos los productos de la base de datos
    const products = await Product.find();
    // Renderizar la vista 'home' pasando los productos
    res.render('home', { products });
  } catch (error) {
    next(error); // Manejo de errores
  }
};