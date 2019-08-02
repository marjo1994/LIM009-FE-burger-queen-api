const { gettingToken } = require('../utils/test')

describe('POST /auth', () => {
    it('debería retornar un token para el administrador', () => (
        gettingToken('admin@localhost', 'changeme').then(resp => {
            expect(resp.status).toBe(200);
            expect(resp.body).toHaveProperty('token');
        })
    ));

    it('debería retornar un token para un usuario  ', () => (
        gettingToken('test@test.test', '123456').then((result) => {
            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('token');
        })
    ));
});




/* const { Express } = require('jest-express/lib/express');
const { server } = require('./e2e/globalSetup.js');

let app;

describe('Server', () => {
    beforeEach(() => {
        app = new Express();
    });

    afterEach(() => {
        app.resetMocked();
    });

    test('should setup server', () => {
        const options = {
            port: 3000,
        };
        server(app, options);
        expect(app.set).toBeCalledWith('port', options.port);
    });
}); */

/*     it('should respond with 400 when email is missing', () => (
        fetch('/auth', {
            method: 'POST',
            body: { email: '', password: 'xxxx' },
        })
        .then(resp => expect(resp.status).toBe(400))
    ));

    it('should respond with 400 when password is missing', () => (
        fetch('/auth', {
            method: 'POST',
            body: { email: 'foo@bar.baz' },
        })
        .then(resp => expect(resp.status).toBe(400))
    ));

    it('fail with 404 credentials dont match', () => (
        fetch('/auth', {
            method: 'POST',
            body: { email: `foo-${Date.now()}@bar.baz`, password: 'xxxx' },
        })
        .then(resp => expect(resp.status).toBe(404))
    ));

    it('should create new auth token and allow access using it', () => (
        fetch('/auth', {
            method: 'POST',
            body: { email: config.adminEmail, password: config.adminPassword },
        })
        .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
        })
        .then(({ token }) => fetchWithAuth(token)(`/users/${config.adminEmail}`))
        .then((resp) => {
            expect(resp.status).toBe(200);
            return resp.json();
        })
        .t
        he
        n(json => expect(json.email).toBe(config.adminEmail))
    )); */