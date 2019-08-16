const user = require('../models/modelUsers');
const { comparePassword } = require('../utils/utils.js');

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
                return resp.send(err);
            };
            if (!userStored) {
                return next(404);
            };
            comparePassword(req.body.password, userStored).then((token) => {

                if (!token) {
                    return next(401)
                }

                resp.status(200).send({ token: token });
            })
        })
    });
    return nextMain();
};