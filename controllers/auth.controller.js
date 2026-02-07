const { User } = require("../models");

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.doLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).render("auth/login", {
        errorMessage: "Email o contraseña incorrectos",
        values: { email }
      });
    }

    const ok = await user.checkPassword(password);
    if (!ok) {
      return res.status(400).render("auth/login", {
        errorMessage: "Email o contraseña incorrectos",
        values: { email }
      });
    }

    req.session.userId = user.id; // 👈 SQL id
    res.redirect("/");
  } catch (err) {
    next(err);
  }
};

module.exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("saforterra.sid");
    res.redirect("/");
  });
};

