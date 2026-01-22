const { DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

const ROUNDS = 10;

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Campo requerido" },
          isEmail: { msg: "Email incorrecto" },
        },
        set(value) {
          // trim + lowercase como en Mongoose
          this.setDataValue("email", String(value).trim().toLowerCase());
        },
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Campo requerido" },
          len: { args: [8, 255], msg: "La contraseña debe tener 8 o más caracteres" },
        },
      },

      username: {
        type: DataTypes.STRING(60),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: { msg: "Campo requerido" },
        },
      },

      phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Campo requerido" },
        },
      },

      image: {
        type: DataTypes.STRING(2048),
        allowNull: false,
        validate: {
          notEmpty: { msg: "Campo requerido" },
          isUrl: { msg: "La imagen debe ser una URL válida" },
        },
      },
    },
    {
      tableName: "users",
      timestamps: true,
      underscored: true, // created_at, updated_at, etc. (más limpio en SQL)
      hooks: {
        // Hash al crear
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, ROUNDS);
          }
        },
        // Hash si se actualiza password
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, ROUNDS);
          }
        },
      },
    }
  );

  // Método equivalente a userSchema.methods.checkPassword
  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};