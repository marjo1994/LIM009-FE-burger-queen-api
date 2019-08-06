const bcrypt = require('bcrypt');
const users = require('../models/modelUsers');
const pagination = require('../utils/pagination');
const { uidOrEmail } = require('../utils/utils');
const { isAdmin } = require('../middleware/auth');

module.exports.getUsers = async(req, resp, next) => {
    let limitPage = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    users.find().count().then((number) => {
        resp.set('link', pagination(protocolo, page, limitPage, number))
    });
    const result = await users.find().skip((page - 1) * limitPage).limit(limitPage).exec()
    return resp.send(result);
}

module.exports.getUserUid = async(req, resp, next) => {
    const obj = uidOrEmail(req.params.uid);
    const userFounded = await users.findOne(obj);
    if (!userFounded) {
        return next(404);
    }
    return resp.send({
        roles: userFounded.roles,
        _id: userFounded._id,
        email: userFounded.email
    })
};

module.exports.postUser = async(req, resp, next) => {
    try {
        if (!req.body.email || !req.body.password) {
            return next(400)
        }

        let newUser = new users();
        newUser.email = req.body.email;
        newUser.password = bcrypt.hashSync(req.body.password, 10);
        if (req.body._id) {
            newUser._id = req.body._id;
        }
        if (req.body.roles && req.body.roles.admin) {
            newUser.roles = { admin: true }
        }
        const userStored = await newUser.save();
        return resp.send({
            roles: userStored.roles,
            _id: userStored._id,
            email: userStored.email
        });
    } catch (e) {
        return next(403)
    }
};

module.exports.putUser = async(req, resp, next) => {
    if (!isAdmin(req) && req.body.roles) {
        return next(403);
    };

    if (!req.body.email && !req.body.password && !isAdmin(req)) {
        return resp.status(400).send({ message: 'no se provee ni email ni passsword' })
    }
    let obj = uidOrEmail(req.params.uid);

    const userFounded = await users.findOne(obj);
    if (!userFounded) {
        return next(404)
    }
    if (req.body.email) {
        userFounded.email = req.body.email;
    }
    if (req.body.password) {
        userFounded.password = bcrypt.hashSync(req.body.password, 10);
    }
    const userSaved = await userFounded.save();
    if (userSaved) {
        return resp.send({ message: 'Cambios registrados satisfactoriamente' });
    }
    /* , (err, queryUser) => {
        if (err) {
            resp.send(err)
        }
        if (!queryUser) {
            return resp.status(404).send({ message: 'El usuario solicitado no existe' })
        }
        if (req.body.email) {
            queryUser.email = req.body.email;
        }
        if (req.body.password) {
            queryUser.password = bcrypt.hashSync(req.body.password, 10);
        }
        /*    if (req.body.roles && isAdmin(req)) {
               queryUser.body.roles.admin = req.body.admin
           } 
           queryUser.save();
           return resp.send({ message: 'Cambios registrados satisfactoriamente' })
       } */
};


module.exports.deleteUser = async(req, resp, next) => {
    if (req.headers.user._id.toString() === req.params.uid && isAdmin(req)) {
        return resp.send({ message: 'Admin no puede autoeliminarse' })
    }
    const obj = uidOrEmail(req.params.uid);

    const userdeleted = await users.findOne(obj)
    if (!userdeleted) {
        return next(404)
    }
    const userRemoved = await users.remove(obj);
    return resp.send({ message: 'Se borro satisfactoriamente!' });
    /* , (err, queryUser) => {
        if (!queryUser) {
            return next(404)
        } else {
            users.remove(obj, (err) => {
                resp.send({ message: 'Se borro satisfactoriamente!' });
            })
        }
    } */
};