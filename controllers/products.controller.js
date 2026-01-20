// Hemos cambiado CATEGORIES POR categories, si no , no aparecía como definida en la línea 9

const Product = require('../models/Product.model')
const CATEGORIES = require('../data/categories')
const mongoose = require('mongoose')

module.exports.list = (req, res, next) => {

  const { category } = req.query
  const query = {}
  if (category) {
    query.categories = { $in: category }
  }
  Product.find(query)
  .then(products => {
    res.render('products/list', { products, categories: CATEGORIES})
  })
  .catch(err => next(err))
}
module.exports.getDetail = (req, res, next) => {
  const { id } = req.params
  Product.findById(id)
    .populate('owner')
    .then(product => {
      if (!product) {
        return next({ status: 404, message: 'Product not found' })
      }
      res.render('products/detail', { product })
    })
    .catch(error => next(error))
}
module.exports.create = (req, res, next) => {
  res.render('products/form', { categories: CATEGORIES })
}
module.exports.doCreate = (req, res, next) => {
  req.body.owner = req.currentUser.id
  if (req.files) {
    req.body.images = req.files.map(file => file.path)
  }
  Product.create(req.body)
    .then((productCreated) => {
      res.redirect(`/products/${productCreated.id}`)
    })
    .catch(err => {
      if (err instanceof mongoose.Error.ValidationError) {
       next(err )
      } else {
        next(err)
      }
    })
}
module.exports.delete = (req, res, next) => {
  Product.findByIdAndDelete(req.params.id)
    .then(() => res.redirect('/products'))
    .catch(err => next(err))
}