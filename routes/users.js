const bcrypt = require('bcrypt');
const users = require('../models/modelUsers')

const {
  requireAuth,
  requireAdmin,
  isAdmin
} = require('../middleware/auth');


const initAdminUser = (app, next) => {
  const { adminEmail, adminPassword } = app.get('config');
  if (!adminEmail || !adminPassword) {
    return next(400);
  }
  users.findOne({ email: adminEmail }, (err, res) => {
    if (res) {
      next()
    } else {
      const adminUser = {
        email: adminEmail,
        password: bcrypt.hashSync(adminPassword, 10),
        roles: { admin: true },
      };
      // TO DO: crear usuarix admin
      let userAdmin = new users()
      userAdmin.email = adminUser.email;
      userAdmin.password = adminUser.password;
      userAdmin.roles = adminUser.roles;
      userAdmin.save((err, userStored) => {
        if (err) {
          console.log(err);
        }
        console.log(userStored)
      })
    }
  })
};

/*
 * Diagrama de flujo de una aplicación y petición en node - express :
 *
 * request  -> middleware1 -> middleware2 -> route
 *                                             |
 * response <- middleware4 <- middleware3   <---
 *
 * la gracia es que la petición va pasando por cada una de las funciones
 * intermedias o "middlewares" hasta llegar a la función de la ruta, luego esa
 * función genera la respuesta y esta pasa nuevamente por otras funciones
 * intermedias hasta responder finalmente al usuario.
 *
 * Un ejemplo de middleware podría ser una función que verifique que un usuario
 * está realmente registrado en la aplicación y que tiene permisos para usar la
 * ruta. O también un middleware de traducción, que cambie la respuesta
 * dependiendo del idioma del usuario.
 *
 * Es por lo anterior que siempre veremos los argumentos request, response y
 * next en nuestros middlewares y rutas. Cada una de estas funciones tendrá
 * la oportunidad de acceder a la consulta (request) y hacerse cargo de enviar
 * una respuesta (rompiendo la cadena), o delegar la consulta a la siguiente
 * función en la cadena (invocando next). De esta forma, la petición (request)
 * va pasando a través de las funciones, así como también la respuesta
 * (response).
 */

/** @module users */
module.exports = (app, next) => {
  /**
   * @name GET /users
   * @description Lista usuarios
   * @path {GET} /users
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @response {Array} users
   * @response {String} users[]._id
   * @response {Object} users[].email
   * @response {Object} users[].roles
   * @response {Boolean} users[].roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin
   */
  //marjo 5 5d28e0c8dad31f777cc03c51
  app.get('/users', requireAdmin, (req, resp) => {
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenticación' })
    }
    users.find({}, (err, res) => {
      if (err) {
        return resp.status(400).send({ message: 'error al traer usuarios' })
      } else {
        resp.status(200).send(res)
      }
    });
  });
  /*   app.get('/admin', requireAdmin, (req, resp) => {
      res.send(req.body())
      //id del admin =5d2185c8a290e73e549fc1cd
    }); */
  /**
   * @name GET /users/:uid
   * @description Obtiene información de un usuario
   * @path {GET} /users/:uid
   * @params {String} :uid `id` o `email` del usuario a consultar
   * @auth Requiere `token` de autenticación y que el usuario sea **admin** o el usuario a consultar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o el mismo usuario
   * @code {404} si el usuario solicitado no existe
   */
  app.get('/users/:uid', requireAuth, (req, resp) => {
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenticación' });
    }
    console.log(req.headers.user)
    if (req.headers.user._id.toString() === req.params.uid) {
      users.findOne({ _id: req.params.uid }, (err, res) => {
        if (err) {
          resp.status(404).send({ message: 'El usuario solicitado no existe' })
        } else {
          resp.status(200).send(res)
        }
      });
    } else {
      resp.status(403).send({ message: 'La información no corresponde al usuario activo' })
    }
  });

  /**
   * @name POST /users
   * @description Crea un usuario
   * @path {POST} /users
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @response {Array} users
   * @response {String} users[]._id
   * @response {Object} users[].email
   * @response {Object} users[].roles
   * @response {Boolean} users[].roles.admin
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si ya existe usuario con ese `email`
   */
  app.post('/users', requireAdmin, (req, resp, next) => {
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenticación' });
    }
    if (!req.body.email || !req.body.password) {
      return next(400, { message: 'no se proveen `email` o `password` o ninguno de los dos' })
    }
    let newUser = new users();
    newUser.email = req.body.email;
    newUser.password = bcrypt.hashSync(req.body.password, 10);
    newUser.save((err, userStored) => {
      if (err) {
        return resp.status(403).send({ message: 'ya existe usuaria con ese `email`' });
      } else {
        console.log(userStored)
        resp.status(200).send({ message: 'se ha registrado exitosamente' });
      }
    })
  });

  /**
   * @name PUT /users
   * @description Modifica un usuario
   * @params {String} :uid `id` o `email` del usuario a modificar
   * @path {PUT} /users
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @auth Requiere `token` de autenticación y que el usuario sea **admin** o el usuario a modificar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` y `password`
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o el mismo usuario
   * @code {403} un usuario no admin intenta de modificar sus `roles`
   * @code {404} si el usuario solicitado no existe
   */
  app.put('/users/:uid', requireAuth, (req, resp, next) => {
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenticación' });
    }
    if (!req.body.email && !req.body.password && !isAdmin(req)) {
      return resp.status(400).send({ message: 'no se provee ni email ni passsword' })
    }
    if (req.headers.user._id.toString() === req.params.uid && req.body.roles) {
      return resp.status(403).send({ message: 'No puede modificar sus `roles`' })
    }
    users.findOne({ _id: req.params.uid }, (err, user) => {

      if (!user) {
        return resp.status(404).send({ message: 'El usuario solicitado no existe' })
      }
      if (req.headers.user._id.toString() === req.params.uid || isAdmin(req)) {
        if (req.body.email) {
          user.email = req.body.email;
        }
        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 10);
        }
        if (req.body.roles && isAdmin(req)) {
          user.body.roles.admin = req.body.admin
        }
        console.log(user)
        resp.status(200).send({ message: 'Cambios registrados satisfactoriamente' })
      } else {
        resp.status(403).send({ message: 'No es ni admin o el mismo usuario' })
      }
    })
  });

  /**
   * @name DELETE /users
   * @description Elimina un usuario
   * @params {String} :uid `id` o `email` del usuario a modificar
   * @path {DELETE} /users
   * @auth Requiere `token` de autenticación y que el usuario sea **admin** o el usuario a eliminar
   * @response {Object} user
   * @response {String} user._id
   * @response {Object} user.email
   * @response {Object} user.roles
   * @response {Boolean} user.roles.admin
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin o el mismo usuario
   * @code {404} si el usuario solicitado no existe
   */
  app.delete('/users/:uid', requireAuth, (req, resp, next) => {
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenticación' });
    }
    if (req.headers.user._id.toString() === req.params.uid && isAdmin(req)) {
      return resp.send({ message: 'Admin no puede autoeliminarse' })
    }
    if (req.headers.user._id.toString() === req.params.uid || isAdmin(req)) {
      users.remove({ _id: req.params.uid } || { email: req.body.email }, (err) => {
        if (err) {
          resp.status(404).send({ message: 'El usuario seleccionado no existe' })
        }
        resp.status(200).send({ message: 'Se borro satisfactoriamente!' });
      });
    } else {
      resp.status(403).send({ message: 'No es ni admin o el mismo usuario' })
    }
  });

  initAdminUser(app, next);
};
