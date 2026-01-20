const User = require("../models/User.model");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const MAX_AGE = 7;
module.exports.sessionConfig = expressSession({
  name: "express-cookie",
  secret: process.env.COOKIE_SECRET || "super-secret", // esto lo guardamos en el dot.env COOKIE_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true' ? true : false, // mandamos la cookie en protocolos HTTP/HTTPS si es true solo HTTPS
    httpOnly: true, // no es accesible por el Javascript del client-browser
    maxAge: 24 * 3600 * 1000 * MAX_AGE, // una semana de vida
  },
  store: new MongoStore({
    mongoUrl: mongoose.connection._connectionString, //monngoose.connection.db
    ttl: 24 * 3600 * MAX_AGE,
  }),
});
// Middleware para obtener el usuario en sesión a partir de la cookie que está en el navegador
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.session.userId
  if (!userId) {
    return next()
  }
  User.findById(userId)
    .then(user => {
      req.currentUser = user
      res.locals.currentUser = user
      next()
    })
    .catch(error => next(error))
}