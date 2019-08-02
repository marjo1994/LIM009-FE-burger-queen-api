//const { gettingToken, postWithToken, getWithToken, deleteWithToken, putWithToken } = require('../utils/test/superTest');
const { responseOfGetUsersByIdorEmail, responseOfDeleteUsersByIdorEmail, responseOfPutUsersByIdorEmail, responseOfGetUsers, requestOfGetUsers } = require('../utils/test/dataUsers');
const { getUsers, getUserUid, postUser, putUser, deleteUser } = require('../controllers/users');
describe('GET /users', () => {
    it('debería retornar un array de objetos con información de usuarios', () => {
        getUsers(requestOfGetUsers, resp).then((result) => {
            expect(result.body).toBe(responseOfGetUsers);
        })
    });

    /*     it('debería retornar un token para un usuario  ', () => (
            gettingToken('test@test.test', '123456').then((result) => {
                expect(result.status).toBe(200);
                expect(result.body).toHaveProperty('token');
            })
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
});
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