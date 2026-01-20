const User = require('../models/User.model')
module.exports.login = (req, res, next) => {
  res.render('auth/login')
}
module.exports.doLogin = (req, res, next) => {
  // Funcion para renderizar el formulario con el error
  const renderWithErrors = () => {
    res.render('auth/login', { error: 'Email o contraseña incorrectos', email: req.body.email })
  }
  // Busco si hay un usuario con ese email
  // User.findOne({$or: [ { email: req.body.email }, { username: req.body.email } ]})
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return renderWithErrors()
      }
      // Aqui asumo que si tengo usuario, compruebo las contraseñas
      return user.checkPassword(req.body.password)
        .then(match => {
          if (!match) {
            return renderWithErrors()
          }
          req.session.userId = user.id; // genero cookie y session
          res.redirect('/')
        })
    })
    .catch(err => {
      next(err)
    })
}
module.exports.logout = (req, res, next) => {
  req.session.destroy()
  res.clearCookie("express-cookie");
  res.redirect('/login')
}