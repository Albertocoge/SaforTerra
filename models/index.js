const sequelize = require("../config/db.config");

const UserModel = require("./User.model");

//Aqui van Product, Cart, etc.
const User = UserModel(sequelize);

module.exports = {
    sequelize
    , User
};
