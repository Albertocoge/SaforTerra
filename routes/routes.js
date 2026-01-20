const router = require('express').Router()
// Instancia configurada del multer con cloudinary
const upload = require('../config/multer.config')
// Controllers
const miscController = require('../controllers/misc.controller')
const usersController = require('../controllers/users.controller')
const authController = require('../controllers/auth.controller')
const productsController = require('../controllers/products.controller')
// Middlewares
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth.middleware')
// Misc urls
router.get('/', miscController.getHome)
// User registration
router.get('/register', isNotAuthenticated, usersController.create)
router.post('/register', isNotAuthenticated, upload.single('image'), usersController.doCreate)
// User login
router.get('/login', isNotAuthenticated, authController.login)
router.post('/login', isNotAuthenticated, authController.doLogin)
router.get('/logout', isAuthenticated, authController.logout)
// Users
router.get('/profile', isAuthenticated, usersController.getCurrentUserProfile)
router.get('/users/:id', isAuthenticated, usersController.getUserProfile)
// Products
router.get('/products/new', isAuthenticated, productsController.create) // Importante: tiene que ir antes de la de detail, porque es mas especifica, sino entraria en la de detail antes
router.post('/products/new', isAuthenticated, upload.array('images',2), productsController.doCreate);
router.get('/products', isAuthenticated, productsController.list)
router.get('/products/:id', isAuthenticated, productsController.getDetail)
router.get('/products/:id/delete', isAuthenticated, productsController.delete)
module.exports = router 

