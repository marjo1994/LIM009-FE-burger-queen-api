const jwt = require('jsonwebtoken');
const users = require('../modelData');


module.exports = secret => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {      
      return next(403, {message: err});
    }
    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    users.findOne({ _id: decodedToken.uid }, (err, user) => {
      if (err) { return next(500, { err }) }
      req.headers.user = user;      
      //resp.status(200);
      next();
    })
  });
};


module.exports.isAuthenticated = req => (
  // TODO: decidir por la informacion del request si la usuaria está atutenticada
  users.findOne({ email: req.body.email }, (err, user) => {
    (user) ? true : false
  })
);


module.exports.isAdmin = req => {
  // TODO: decidir por la informacion del request si la usuaria es admin
  //console.log(req.headers.user.roles.admin)
  return req.headers.user && req.headers.user.roles.admin
}


module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
