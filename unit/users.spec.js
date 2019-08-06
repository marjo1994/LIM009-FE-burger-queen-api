const { getUsers, getUserUid, postUser, putUser, deleteUser } = require('../controllers/users');
const mongoose = require('mongoose')
const Users = require('../models/modelUsers');
const { MongoMemoryServer } = require('mongodb-memory-server');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
const opts = { useMongoClient: true };

beforeEach(async() => {

    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }

    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, opts, (err) => {
        if (err) console.error(err);
    });
});
/* afterAll(async() => {
    await mongoose.disconnect();
    await mongoServer.stop();
}); */










/* const resp = {
    send: jest.fn(json => json),
    set: jest.fn(json => json)
};


const next = jest.fn(json => json);

const requestOfPostUsers = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'marjorie@labo.la',
        password: '123456'
    },
};

const responseOfPostUsers = {
    roles: { admin: false },
    _id: '5d3b0d0a99320e3f0ce80b96',
    email: 'marjorie@labo.la',
};

describe('POST/ users', () => {
    it('Debería crear un nuevo usuario', async() => {
        const userSend = await postUser(requestOfPostUsers, resp, next);
        // await Users.count();
        expect(userSend).toHaveProperty('_id');
        expect(userSend).toHaveProperty('roles.admin', responseOfPostUsers.roles.admin);
        expect(userSend).toHaveProperty('email', responseOfPostUsers.email);
    }) */
;
//});

/* const requestOfGetUsers = {
    'headers': {
        authorization: ''
    },
    'query': {
        limit: 10,
        page: 1,
    },
    'protocol': 'http',
    'get': '',
    'path': '/users',
}; */
/* {
    roles: { admin: true },
    _id: '5d3b0d0a99320e3f0ce80b96',
    email: 'admin@localhost',
},  */
/* const responseOfGetUsers = [];

describe('GET/ users', () => {
    it('Debería retornar un array de objetos con información de usuarios', async() => {
        const users = await getUsers(requestOfGetUsers, resp, next);
        expect(users).toHaveLength(responseOfGetUsers.length);
    });
}); */
//usar mongodb-memory-server para intrpducir datos
/* 
const requestOfGetUsersByEmail_user = {
    headers: {
        authorization: '',
    },
    params: {
        uid: 'marjorie@labo.la',
    }s
};

const responseOfGetUsers = {
    roles: { admin: false },
    _id: '5d48a45194557705c41baed2',
    email: 'marjorie@labo.la',
}; */

/* describe('GET/ users:uid', () => {

    it('Debería retornar un array de objetos con información de usuarios', async() => {
        const user = await getUserUid(requestOfGetUsersByEmail_user, resp, next);
        expect(user).toHaveLength();
    });
}); */


/* var mongoose = require("mongoose"); 
mongoose.Collection.prototype.insert = function(docs, options, callback) { 
     callback(null, docs); }; 
     module.exports = mongoose; 
 */
/* 
const authorizationAdmin = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDMxNTA2ZjU2OGJmODEwMzJmYTQzNzAiLCJpYXQiOjE1NjM1MTM4NzF9.mRqN3BFOT-zfPAqQFdmpEqCWEA_U09CM9AVYeoCmGTo';



describe('GET /users', () => {
    it('debería retornar un array de objetos con información de usuarios', () => {
        getUsers(requestOfGetUsers, resp).then((result) => {
            console.error(result);
            expect(result.body).toBe(responseOfGetUsers);
        })
    });
 */
/*     it('debería retornar un token para un usuario  ', () => (
        gettingToken('test@test.test', '123456').then((result) => {
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('token');
        })result
    ));

    it('debería retornar un error 400 cuando no se provee email o password', () => (
        gettingToken('admin@localhost', '').then(resp => {
            expect(resp.status).toBe(400);
        })
    ));

    it('debería retornar un error 401 con un email', () => (
        gettingToken('abc@abc', '123456').then(resp => {
            expect(resp.status).toBe(401);
        })
    ));
    it('debería retornar un error 401 con password invàlido', () => (
        gettingToken('test@test.test', 'changeme').then(resp => {
            expect(resp.status).toBe(401);
        })
    )); */
//});
/* describe('POST /users', () => {
    it('debería retornar un error 400 si no se le envian los parametros correctos o està vacìo', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return postWithToken({
                email: 'labo@labo.la',
            }, resp.body.token, '/users')
        }).then((result) => {
            expect(result.status).toBe(400);
        })
    ))
    it('debería crear un nuevo usuario', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return postWithToken({
                email: 'labo@labo.la',
                password: 'laboratoria',
            }, resp.body.token, '/users')
        }).then((result) => {
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('_id');
        })
    ))
});

describe('GET /users', () => {
    it('debería retornar un array de objetos con informacion de todos los usuarios', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return getWithToken(resp.body.token, '/users')
        }).then(result => {
            console.log(result.body);
            expect(result.status).toBe(200);
            expect(result.body).toHaveLength(3);
        })
    ))
});

describe('GET /users:uid', () => {
    it('debería tener el estado 404 si el usuario solicitado no existe', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return getWithToken(resp.body.token, '/users/abc@abc')
        }).then((result) => {
            //console.log(result.body);
            expect(result.status).toBe(404);
        })
    ))
    it('debería traer informaciòn de usuario por email ', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return getWithToken(resp.body.token, '/users/labo@labo.la')
        }).then((result) => {
            // console.log(result.body);
            expect(result.body).toHaveProperty('_id');
            expect(result.body).toHaveProperty('roles.admin', responseOfGetUsersByIdorEmail.roles.admin);
            expect(result.body).toHaveProperty('email', responseOfGetUsersByIdorEmail.email);
        })
    ))
});

describe('PUT /users:uid', () => {
    it('debería tener el estado 404 si el usuario solicitado no existe', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return putWithToken({ password: 'laboratoria123' }, resp.body.token, '/users/abc@abc')
        }).then((result) => {
            expect(result.status).toBe(404);
        })
    ))
    it('debería editar informaciòn de usuario', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return putWithToken({ password: 'laboratoria123' }, resp.body.token, '/users/labo@labo.la')
        }).then((result) => {
            //console.log(result.body);
            expect(result.body).toEqual(responseOfPutUsersByIdorEmail);
        })
    ))
});

describe('DELETE /users:uid', () => {
    it('debería tener el estado 404 si el usuario solicitado no existe', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return getWithToken(resp.body.token, '/users/abc@abc')
        }).then((result) => {
            console.log(result.body);
            expect(result.status).toBe(404);
        })
    ))
    it('debería eliminar al usuario encontrado segun email', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return deleteWithToken(resp.body.token, '/users/labo@labo.la')
        }).then((result) => {
            expect(result.body).toEqual(responseOfDeleteUsersByIdorEmail);
        })
    ))
}); */