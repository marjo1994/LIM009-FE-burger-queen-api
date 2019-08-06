const { gettingToken, postWithToken, getWithToken } = require('../utils/test/superTest')

const { responseOfGetUsersByIdorEmail } = require('../utils/test/dataUsers')
describe('POST /users', () => {
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
        }).catch(e => console.log(e))
    ))
});

describe('GET /users', () => {
    it('debería retornar un array de objetos con informacion de todos los usuarios', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return getWithToken(resp.body.token, '/users')
        }).then((result) => {
            console.log(result.body);
            expect(result.status).toBe(200);
            expect(result.body).toHaveLength(3);
        })
    ))
});

describe('GET /users:uid', () => {
    it('debería traer informaciòn de usuario por email ', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return getWithToken(resp.body.token, '/users/labo@labo.la')
        }).then((result) => {
            console.log(result.body);
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('_id');
            expect(result.body).toHaveProperty('roles.admin', responseOfGetUsersByIdorEmail.roles.admin);
            expect(result.body).toHaveProperty('email', responseOfGetUsersByIdorEmail.email);
        })
    ))
});

/* describe('PUT /users:uid', () => {
    it('debería traer informaciòn de usuario por email ', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return getWithToken(resp.body.token, '/users/labo@labo.la')
        }).then((result) => {
            console.log(result.body);
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('_id');
            expect(result.body).toHaveProperty('roles.admin', responseOfGetUsersByIdorEmail.roles.admin);
            expect(result.body).toHaveProperty('email', responseOfGetUsersByIdorEmail.email);
        })
    ))
}); */