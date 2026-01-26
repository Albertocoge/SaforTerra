const { Product, User } = require("../models");
const CATEGORIES = require("../data/categories");
const { Op } = require("sequelize");

module.exports.list = async (req, res, next) => {
  try {
    const { category } = req.query;

    const where = {};
    if (category) {
      // categories es JSON -> quick filter: buscar el texto dentro del JSON
      // (Para algo más fino luego se hace con JSON_CONTAINS o un diseño relacional)
      where.categories = { [Op.like]: `%${category}%` };
    }

    const products = await Product.findAll({
      where,
      order: [["created_at", "DESC"]],
    });

    res.render("products/list", { products, categories: CATEGORIES });
  } catch (err) {
    next(err);
  }
};

module.exports.getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id, {
      include: [{ model: User, as: "owner" }],
    });

    if (!product) return next({ status: 404, message: "Product not found" });

    res.render("products/detail", { product });
  } catch (err) {
    next(err);
  }
};

module.exports.create = (req, res) => {
  res.render("products/form", { categories: CATEGORIES });
};

module.exports.doCreate = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // En SQL: ownerId (no owner)
    payload.ownerId = req.currentUser.id;

    if (req.files) {
      payload.images = req.files.map((file) => file.path); // tu model guarda JSON array
    }

    const productCreated = await Product.create(payload);
    res.redirect(`/products/${productCreated.id}`);
  } catch (err) {
    // Sequelize validation errors (si quieres pintarlas en el form luego)
    next(err);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.redirect("/products");
  } catch (err) {
    next(err);
  }
};