const expressSession = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(expressSession.Store);

const sequelize = require("./db.config");
const User = require("../models/User.model");
const MAX_AGE_DAYS = 7;

//Store de sesiones en MySQL
const sessionStore = new SequelizeStore({
  db: sequelize,
});

//Crea la tabla Sessions si no existe
sessionStore.sync();

module.exports.sessionConfig = expressSession({
  name: "saforterra.sid",
  secret: process.env.SESSION_SECRET || "super-secret", // esto lo guardamos en el dot.env COOKIE_SECRET
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.COOKIE_SECURE === 'true' ? true : false, // mandamos la cookie en protocolos HTTP/HTTPS si es true solo HTTPS
    httpOnly: true, // no es accesible por el Javascript del client-browser
    maxAge: 24 * 3600 * 1000 * MAX_AGE_DAYS, // una semana de vida
  },
  store: sessionStore,
});
// Middleware: cargar usuario actual desde la sesión
module.exports.getCurrentUser = async(req, res, next) => {
 try {
    const userId = req.session.userId;
    if (!userId) {
    return next();
    }
    const user = await User.findByPk(userId);
    req.currentUser = user;
    res.locals.currentUser = user;



     return next();
    } catch (error) {
    next(error);
  }
};
