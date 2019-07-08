//const jwt = require('jsonwebtoken');
const config = require('../config');
const user = require('../modelData');

const { secret } = config;

const signUp = (req, res, token) => {
  const newUser = new user();
  newUser.email = req.body.email;
  newUser.password = req.body.password;
  newUser.displayName = req.body.username;
  newUser.save((err, userStored) => {
    if (err) {
      res.status(500).send('hubo un error:' + err);
    }
    res.status(200).send({
      message: 'se ha registrado exitosamente',
      token: token
    });
  })
};
const signIn = (req, res, token) => {
  users.find({ email: req.email, password: req.password }, (err, userStored) => {
    if (err) {
      return res.status(500).send({ message: err })
    };
    if (!userStored) {
      return res.status(404).send({
        message: 'no existe el usuario'
      })
    };

    res.status(200).send({ token: token })
  })
}
/** @module auth */
module.exports = (app, nextMain) => {

  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {String} token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {401} si cabecera de autenticación no está presente
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */

  app.post('/auth', (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    // user.find()
    // TO DO: autenticar a la usuarix
        const token = jwt.sign({ uid: user._id }, secret)
        res.json({ token })
        console.log(token)
  });


  return nextMain();
};
