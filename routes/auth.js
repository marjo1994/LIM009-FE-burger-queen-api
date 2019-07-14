const jwt = require('jsonwebtoken');
const config = require('../config');
const user = require('../modelUsers');
const bcrypt = require('bcrypt');

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
   * @code {401} si cabecera de autenticación no está presente ===>
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */

  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    // TO DO: autenticar a la usuarix--------------
    user.findOne({ email: req.body.email }, (err, userStored) => {
      if (err) {
       return next(500, {message: err});
      };
      if (!userStored) {
        return resp.status(404).send({
          message: 'no existe el usuario'
        })
      };
      bcrypt.compare(req.body.password, userStored.password, (err, res) => {

        if (res) {
          const token = jwt.sign({ uid: userStored._id }, secret);
          resp.status(200).send({ token: token })
        }
      });

    })
  });
  return nextMain();
};
