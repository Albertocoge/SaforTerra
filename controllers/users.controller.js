const { User, Product } = require("../models");

module.exports.create = (req, res) => {
  res.render("users/register");
};

module.exports.doCreate = async (req, res, next) => {
  try {
    const fields = {
      ...req.body,
      image: req.file?.path, // ojo: si no hay file, esto sería undefined
    };

    await User.create(fields);
    res.redirect("/");
  } catch (error) {
    const values = { ...req.body };
    delete values.password;

    // Duplicados / unique
    if (error?.name === "SequelizeUniqueConstraintError") {
      const errors = {};
      for (const item of error.errors) {
        if (item.path === "email") errors.email = "Ya existe un usuario con este email";
        if (item.path === "username") errors.username = "Ya existe un usuario con este nombre";
      }
      return res.render("users/register", { errors, values });
    }

    // Validaciones
    if (error?.name === "SequelizeValidationError") {
      const errors = {};
      for (const item of error.errors) {
        errors[item.path] = item.message;
      }
      return res.render("users/register", { errors, values });
    }

    next(error);
  }
};

module.exports.getCurrentUserProfile = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: { ownerId: req.currentUser.id },
      order: [["created_at", "DESC"]],
    });

    // igual que hacías antes: añadirle products al objeto de usuario para la vista
    const user = req.currentUser.toJSON ? req.currentUser.toJSON() : req.currentUser;
    user.products = products;

    res.render("users/userProfile", { user, profile: true });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [{ model: Product, as: "products" }],
    });

    if (!user) return next({ status: 404, message: "User not found" });

    res.render("users/userProfile", { user });
  } catch (err) {
    next(err);
  }
};