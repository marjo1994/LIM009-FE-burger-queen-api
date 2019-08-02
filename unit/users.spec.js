const { gettingToken, postWithToken, getWithToken } = require('../utils/test')


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