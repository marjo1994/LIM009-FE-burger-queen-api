const jwt = require('jsonwebtoken');
const config = require('../config');
const user = require('../modelData');
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

  app.post('/auth', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    // TO DO: autenticar a la usuarix
    //  res.json({ token })
    user.findOne({ email: req.body.email }, (err, userStored) => {      
      if (err) {
        return res.status(500).send({ message: err })
      };
      if (!userStored) {
        return res.status(404).send({
          message: 'no existe el usuario'
        })
      };
      console.log(userStored)
      bcrypt.compare(req.body.password, '10', (err, res) => {
        if(err){
          console.log(err)
        }
        if (res) {
          const token = jwt.sign({ uid: userStored._id }, secret);
          res.status(200).send({ token: token })
        } else {
          next(401)
        }
      });

    })
  });
  return nextMain();
};
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NjI2MTc1MzJ9.5dzueIxO7QceZUwwn3CqrL2qfLMxhmRuq-_EGu3Y8LA