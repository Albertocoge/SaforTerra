require('dotenv').config()

// Connection to DB

require('./config/hbs.config')
const express = require('express')
const logger = require('morgan')
const path = require('path')
const { sessionConfig, getCurrentUser } = require('./config/session.config')
const app = express()


// To have access to `body` property in the request
app.use(express.urlencoded({ extended: true }));
// Normalizes the path to the views folder
app.set("views", path.join(__dirname, "views"));
// Sets the view engine to handlebars
app.set("view engine", "hbs");
// Handles access to the public folder
app.use(express.static(path.join(__dirname, "public")));
app.use(logger('dev'))
app.use(sessionConfig);
app.use(getCurrentUser);
const routes = require('./routes/routes')
const cartRoutes = require('./routes/cart.routes');
app.use('/', routes)
app.use('/', cartRoutes);
// Aquí rutas de pago:
const paymentRoutes = require('./routes/payment.routes');
app.use('/', paymentRoutes);
// Manejo de errores
app.use((req, res, next) => {
  // this middleware runs whenever requested page is not available
  res.status(404).render("not-found");
});
app.use((err, req, res, next) => {
  // whenever you call next(err), this middleware will handle the error
  // always logs the error
  console.error("ERROR", req.method, req.path, err);
  if (err.status === 404) {
    return res.status(404).render('not-found')
  }
  // only render if the error ocurred before sending the response
  if (!res.headersSent) {
    res.status(500).render("error");
  }
});
const PORT = process.env.PORT || 3000;

const { sequelize } = require("./models");

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to MySQL via Sequelize");
    return sequelize.sync(); // crea tablas si no existen
  })
  .then(() => {
    console.log("✅ Tables synced");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
  console.error("❌ DB init error:", err);
  process.exit(1);
});

const hbs = require('hbs'); // O handlebars si usas express-handlebars
// Helper para multiplicar precio por cantidad
hbs.registerHelper('multiply', function (price, quantity) {
  return (price * quantity).toFixed(2);
});
// Helper para calcular el total
hbs.registerHelper('calculateTotal', function (products) {
  return products.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0).toFixed(2);
});