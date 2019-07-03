const jwt = require('jsonwebtoken');
const config = require('../config');

const { secret } = config;

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
    let token = jwt.sign(tokenData, 'Secret Password', {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    })
    console.log(token)
    res.send({ token })
    // TO DO: autenticar a la usuarix
  });

  return nextMain();
};
