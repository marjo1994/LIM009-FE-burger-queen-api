/* const path = require('path');
const fetch = require('node-fetch');
jest.mock('express');

const config = require('../config');
const port = process.env.PORT || 8888;
const baseUrl = process.env.REMOTE_URL || `http://127.0.0.1:${port}`;
const { requestOfPostUsers, responseOfPostUsers, authorizationAdministrador } = require('../_mocks_/dataUsers')

 */
const port = 8888;
const baseUrl = `http://127.0.0.1:${port}`;

const { requestOfPostUsers, responseOfPostUsers, authorizationAdministrador } = require('../_mocks_/dataUsers')
let request = require('supertest');
const express = require('express');
const app = express();

request = request('http://localhost:8888');

const gettingToken = async(email, password) => {
    return await request.post(`/auth`)
        .send({
            email: email,
            password: password,
        })
        .set('Accept', 'application/json')
        .then(resp => {
            return resp;
        });
}

describe('POST /auth', () => {
    it('debería retornar un token para el ', () => (
        /*           request.post(`/auth`)
                  .send({
                      email: 'admin@localhost',
                      password: 'changeme',
                  })
                  .set('Accept', 'application/json') */
        gettingToken('admin@localhost', 'changeme').then(resp => {
            expect(resp.status).toBe(200);
            expect(resp.body).toHaveProperty('token');
            return resp.body.token;
        })

    ));

    it('debería retornar un token para un usuario  ', () => (
        gettingToken('admin@localhost', 'changeme')
        .then(resp => {
            return request.post(`/post`)
                .send({
                    email: 'labo@labo.la',
                    password: 'laboratoria',
                })
                .set('Authorization', `bearer ${resp.body.token}`)
        }).then((result) => {
            console.log(result.body)
            expect(result.status).toBe(200);
        }).catch(e => console.log(e))
    ));
})
describe('POST /users', () => {

        it('debería crear un nuevo usuario', () => (
            gettingToken('admin@localhost', 'changeme')
            .then(resp => {
                return request.post(`/users`)
                    .send({
                        email: 'labo@labo.la',
                        password: 'laboratoria',
                    })
                    .set('Authorization', `bearer ${resp.body.token}`)
            }).then((result) => {
                console.log(result.body)
                expect(result.status).toBe(200);
            }).catch(e => console.log(e))
        ));
    })
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