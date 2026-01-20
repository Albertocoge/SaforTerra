const mongoose = require('mongoose')
const User = require('../models/User.model')
const Product = require('../models/Product.model')
module.exports.create = (req, res, next) => {
  res.render('users/register')
}
module.exports.doCreate = (req, res, next) => {
  // Mi modelo requiere los campos que vienen el req.body, pero image lo ha procesado multer
  // Necesito mandar en el create los campos de req.body y el campo image con la url que subi a cloudinary que esta en req.file.path
  const fields = {
    ...req.body,
    image: req.file.path
  }
  // O añadir el key value image a req.body del tiron
  // req.body.image = req.file.path
  User.create(fields)
    .then(() => {
      res.redirect('/')
    })
    .catch(error => {
      // Para autorellenar el formulario cuando haya errores, pasamos todos los valores del req.body, menos la password
      const values = {...req.body}
      delete values.password
      if (error instanceof mongoose.Error.ValidationError) {
        res.render('users/register', {
          errors: error.errors,
          values
        })
      } else if (error.code && error.code === 11000) {
        const errors = {}
        if (error.keyValue.email) {
          errors.email = 'Ya existe un usuario con este email'
        }
        if (error.keyValue.username) {
          errors.username = 'Ya existe un usuario con este nombre'
        }
        res.render('users/register', { errors, values })
      } else {
        next(error)
      }
    })
}
module.exports.getCurrentUserProfile = (req, res, next) => {
  Product.find({ owner: req.currentUser.id })
    .then((products) => {
      req.currentUser.products = products
      res.render('users/userProfile', { user: req.currentUser, profile: true })
    })
    .catch(err => next(err))
}
module.exports.getUserProfile = (req, res, next) => {
  User.findById(req.params.id)
    .populate('products')
    .then(user => {
      res.render('users/userProfile', { user })
    })
    .catch(err => next(err))
}