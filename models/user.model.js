const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const EMAIL_PATTERN =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const URL_PATTERN = /^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/
const ROUNDS = 10
const REQUIRED_FIELD = 'Campo requerido'
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, REQUIRED_FIELD],
      unique: true,
      match: [EMAIL_PATTERN, 'Email incorrecto'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, REQUIRED_FIELD],
      minLength: [8, "La contraseña debe tener 8 o más caracteres"],
    },
    username: {
      type: String,
      required: [true, REQUIRED_FIELD],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, REQUIRED_FIELD]
    },
    image: {
      type: String,
      required: [true, REQUIRED_FIELD],
      match: [URL_PATTERN, 'La imagen debe ser una URL válida']
    }
  },
  {
    timestamps: true
  }
)

// Creo un campo virtual para relacionar usuario con modelos y tener su array
//Equivalente a Product.find({ owner: user.id })
userSchema.virtual('products', {
  foreignField: 'owner',
  localField: '_id',
  justOne: false,
  ref: 'Product'
})


// Evento que se produce antes de guardar un usuario en la BBDD
// IMPORTANTE: Tiene que ir antes del mongoose.model() sino, no lo utiliza
userSchema.pre("save", function (next) {
  const user = this;
  
  // Antes de guardar, compruebo si tengo que hashear la contraseña, si su campo ha sido modificado o es nuevo
  if (user.isModified("password")) {
    bcrypt.hash(user.password, ROUNDS).then((hash) => {
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});
userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', userSchema);
module.exports = User