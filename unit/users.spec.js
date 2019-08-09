const { getUsers, getUserUid, postUser, putUser, deleteUser } = require('../controllers/users');
const mongoose = require('mongoose')
    //const Users = require('../models/modelUsers');
const { MongoMemoryServer } = require('mongodb-memory-server');

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
let port;
beforeEach(async() => {
    if (mongoServer) {
        await mongoose.disconnect();
        await mongoServer.stop();
    }
    mongoServer = new MongoMemoryServer();
    port = await mongoServer.getPort();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, (err) => {
        if (err) console.error(err);
    });
});

let requestOfPostUsers = {
    headers: {
        authorization: '',
    },
    body: {
        _id: '5d4916541d4f9a3b2dcac66d',
        email: 'marjorie@labo.la',
        password: '123456'
    },
};

const responseObjectOfUser = {
    roles: { admin: false },
    _id: '5d4916541d4f9a3b2dcac66d', //5d4916541d4f9a3b2dcac66d,
    email: 'marjorie@labo.la',
};
const emptyRequest = {
    headers: {
        authorization: '',
    },
    body: {
        email: '',
        password: '1234567'
    },
};
const emptyRequest2 = {
    headers: {
        authorization: '',
    },
    body: {
        email: '',
        password: ''
    },
};
const responseObjectOfNewAdmin = {
    roles: { admin: true },
    _id: '5d4916541d4f9a3b2dcac66d', //5d4916541d4f9a3b2dcac66d,
    email: 'marjorie@labo.la',
};

const requestOfPostUsersDuplicated = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'marjorie@labo.la',
        password: 'contraseña'
    },
}
describe('POST/ users:uid', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería crear un nuevo usuario', async() => {
        await postUser(requestOfPostUsers, resp, next);
        expect(resp.send.mock.results[0].value).toEqual(responseObjectOfUser);
        //expect(userSend).toBe(responseObjectOfUser);
    });
    it('El administrador debería poder crear a otro administrador', async() => {
        requestOfPostUsers.body.roles = { admin: true }
        const newAdmin = await postUser(requestOfPostUsers, resp, next);
        resp.send.mockReturnValue(newAdmin)
        expect(resp.send()).toEqual(responseObjectOfNewAdmin);
    })
    it('Debería retornar un error 400 si no existe email o password', async() => {
        await postUser(emptyRequest, resp, next);
        await postUser(emptyRequest2, resp, next);
        expect(next.mock.calls[0][0]).toBe(400);
        expect(next.mock.calls[1][0]).toBe(400);
    })
    it('Debería retornar un error 403 si ya existe un usuario con ese email', async() => {
        await postUser(requestOfPostUsersDuplicated, resp, next);
        await postUser(requestOfPostUsersDuplicated, resp, next);
        expect(next.mock.calls[2][0]).toBe(403);

    })
});
/* const mockPostUSer = mock.fn(res= postUser(requestOfPostUsers, resp, next))
 */

const requestOfGetUsers = {
    'headers': {
        authorization: ''
    },
    'query': {
        limit: 10,
        page: 1,
    },
    'protocol': 'http',
    'get': jest.fn(res => `localhost:${port}`),
    'path': '/users',
};
const requestOfPostUsers2 = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'mayte@labo.la',
        password: 'samaniego'
    },
};
//cuenta llamadaaas
let responseOfGetUsers = [];
describe('GET/ users', () => {
    const res = {
        send: jest.fn(json => json),
        set: jest.fn(json => json)
    };

    const next = jest.fn(json => json);


    it('Debería retornar el numero de usuarios creados', async() => {
        const userSend2 = await postUser(requestOfPostUsers2, res, next);
        const userSend = await postUser(requestOfPostUsers, res, next);
        responseOfGetUsers.push(userSend2, userSend);
        const users = await getUsers(requestOfGetUsers, res, next);
        expect(users).toHaveLength(responseOfGetUsers.length);
        expect(res.send.mock.calls[2].length).toBe(1)
    });
});



const requestOfGetUsersByEmail = {
    'headers': {
        authorization: ''
    },
    params: {
        uid: 'maytesi@labo.la'
    }
};
const requestOfPostUsers3 = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'maytesi@labo.la',
        password: 'inga123'
    },
};
const responseObjectOfUser3 = {
    roles: { admin: false },
    email: 'maytesi@labo.la',
};

const requestOfGetUsersById = {
    'headers': {
        authorization: ''
    },
    params: {

    }
};
describe('GET/ users:uid', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);


    it('Debería retornar el usuario llamado por ID', async() => {
        const user0 = await postUser(requestOfPostUsers3, resp, next);
        requestOfGetUsersById.params.uid = user0._id.toString();
        responseObjectOfUser3._id = user0._id;
        const getUsersTest = await getUserUid(requestOfGetUsersById, resp, next);
        resp.send.mockReturnValue(getUsersTest)
        expect(resp.send()).toEqual(responseObjectOfUser3);
    });

    it('Debería retornar el usuario llamado por Email', async() => {
        const user = await postUser(requestOfPostUsers3, resp, next);
        responseObjectOfUser3._id = user._id;
        const functTest = await getUserUid(requestOfGetUsersByEmail, resp, next);
        resp.send.mockReturnValue(functTest)
        expect(resp.send()).toEqual(responseObjectOfUser3);
    });
    it('Debería retornar un error 404 si se ingresa un parametro uid invalido', async() => {
        const user = await postUser(requestOfPostUsers3, resp, next);
        requestOfGetUsersById.params.uid = '5d4916541d4f9a3b2dcac66d';
        await getUserUid(requestOfGetUsersById, resp, next);
        expect(next.mock.calls[0][0]).toBe(404);
    });
});



const requestOfPostUsersFromPut = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'marjorie2@labo.la',
        password: '123456'
    },
};
const emptyOfPostUsersFromPut = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            email: 'marjorie2@labo.la',
        }
    },
    body: {
        email: ''
    },
    params: {
        uid: 'marjorie2@labo.la'
    }
};
const requestOfPutUsersByEmail = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            email: 'marjorie2@labo.la',
        }
    },
    body: {
        email: 'marjo1@labo.la',
    },
    params: {
        uid: 'marjorie2@labo.la'
    }
};
const requestOfPutModifyRoles = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            email: 'marjorie2@labo.la',
        }
    },
    body: {
        roles: {
            admin: true,
        }
    },
    params: {
        uid: 'marjorie2@labo.la'
    }
};
describe('PUT/ users:uid', () => {
    const response = {
        send: jest.fn(json => json),
    };

    const next2 = jest.fn(json => json);


    it('Debería editar usuario llamado por ID', async() => {
        const userFromTestPut = await postUser(requestOfPostUsersFromPut, response, next2);
        const requestOfPutUsersById = {
            'headers': {
                authorization: '',
                user: {
                    roles: { admin: false },
                    _id: userFromTestPut._id.toString(), //5d4916541d4f9a3b2dcac66d,
                    email: 'marjorie2@labo.la',
                }
            },
            body: {
                email: 'marjo@labo.la',
                password: 'abcdefg'
            },
            params: {
                uid: userFromTestPut._id.toString()
            }
        };
        const userChange = await putUser(requestOfPutUsersById, response, next2);
        response.send.mockReturnValue(userChange)
        expect(response.send()).toEqual({ message: 'Cambios registrados satisfactoriamente' });
    });

    it('Debería retornar el usuario llamado por Email', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        const userChange2 = await putUser(requestOfPutUsersByEmail, response, next2);
        response.send.mockReturnValue(userChange2);
        expect(response.send()).toEqual({ message: 'Cambios registrados satisfactoriamente' });
    });

    it('Debería retornar un error 404 si se ingresa un parametro uid inválido', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        requestOfPutUsersByEmail.params.uid = '5d49896541d4f9a3bl2dcuc66d';
        await putUser(requestOfPutUsersByEmail, response, next2);
        expect(next2.mock.calls[0][0]).toBe(404);
    });
    it('Debería retornar un error 403 si un usuario quiere modificar sus roles y no es administrador', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        await putUser(requestOfPutModifyRoles, response, next2);
        expect(next2.mock.calls[1][0]).toBe(403);
    });
    it('Debería retornar un error 400 si ingresa un email o password vacío', async() => {
        await postUser(requestOfPostUsersFromPut, response, next2);
        await putUser(emptyOfPostUsersFromPut, response, next2);
        expect(next2.mock.calls[2][0]).toBe(400);
    });


});

const requestDeleteUsersByEmail = {

    'headers': {
        authorization: '',
        user: {
            roles: { admin: false },
            _id: 'xxxxxxxxxxxxxxxxxxxx', //5d4916541d4f9a3b2dcac66d,
            email: 'delete@labo.la',
        }
    },
    params: {
        uid: 'delete@labo.la'
    }
};
const requestAdminToDelete = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: true },
            _id: 'xxxxxxxxxxxxxxxxxxxx', //5d4916541d4f9a3b2dcac66d,
            email: 'delete@labo.la',
        }
    },
    params: {
        uid: 'delete@labo.la'
    }
};
let requestOfPostUsersFromDelete = {
    headers: {
        authorization: '',
    },
    body: {
        email: 'delete@labo.la',
        password: '123456',
    },
};
const requestAdminToDeleteAuto = {
    'headers': {
        authorization: '',
        user: {
            roles: { admin: true },
            _id: '12345678910111213141',
            email: 'admin@gmail',
        }
    },
    params: {
        uid: 'admin@gmail',
    }
};

describe('DELETE/ users:uid', () => {
    const respon = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería elimiar un usuario creado por uid', async() => {
        const userSaved = await postUser(requestOfPostUsersFromDelete, respon, next);
        const requestDeleteUsersById = {
            'headers': {
                authorization: '',
                user: {
                    roles: { admin: false },
                    _id: 'xxxxxxxxxxxxxxxxxx',
                    email: 'admin@labo.la',
                }
            },
            params: {
                uid: userSaved._id.toString(),
            }
        };
        const userDeleted = await deleteUser(requestDeleteUsersById, respon, next);
        respon.send.mockReturnValue(userDeleted);
        expect(respon.send()).toEqual({ message: 'Se borro satisfactoriamente!' });
    });
    it('Debería elimiar un usuario creado por email', async() => {
        await postUser(requestOfPostUsersFromDelete, respon, next);
        const userDeleted2 = await deleteUser(requestAdminToDelete, respon, next);
        respon.send.mockReturnValue(userDeleted2);
        expect(respon.send()).toEqual({ message: 'Se borro satisfactoriamente!' });
    });

    it('Debería retornar un error 404 si se ingresa un id invalid', async() => {
        await postUser(requestOfPostUsersFromDelete, respon, next);
        requestDeleteUsersByEmail.params.uid = '5d3b0d0a99320e3f0ce80b96';
        await deleteUser(requestDeleteUsersByEmail, respon, next);
        expect(next.mock.calls[0][0]).toBe(404);
    });

    it('Usuario no puede eliminarse a si mismo', async() => {
        await deleteUser(requestAdminToDeleteAuto, respon, next);
        expect(respon.send.mock.calls[7][0]).toEqual({ message: 'Usuario o administrador no pueden eliminarse a si mismo.' });
    });
    it('Debería retornar un error 404 si se ingresa un mal dato', async() => {
        await postUser(requestOfPostUsersFromDelete, respon, next);
        requestDeleteUsersByEmail.params.uid = 'xxxxxxxxxxxxxx';
        await deleteUser(requestDeleteUsersByEmail, respon, next);
        console.log(next.mock.calls)
        expect(next.mock.calls[1][0]).toBe(404);
    });

});
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
            expect(result.body).toEqual(responseOfGetUsers);
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