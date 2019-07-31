const mongoose = require('mongoose');
const fetch = require('node-fetch')
const config = require('../config');
const JWT = require('jsonwebtoken');
//const { secret } = require('../config');


//const User = mongoose.model('Users');
const { requestOfPostUsers, responseOfPostUsers, requestOfGetUsers, responseOfGetUsers, authorizationAdmin } = require('../_mocks_/dataUsers')

const initPost = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': requestOfPostUsers.headers.authorization,
    },
    body: requestOfPostUsers.body
};
//console.log(initPost)
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI1ZDQxMzI0OWM3OTlhYzc2NTJmNDViZjkiLCJpYXQiOjE1NjQ1NTM4MDF9.qD3a3AATCFpp3FlufqhnjLWf7qHpZD18RTwAuWMwoMY
const initPostAuthAdmin = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: { email: 'admin@localhost', password: 'changeme' }
};
describe('POST /auth', () => {
    it('Debería retornar un objeto con las propiedades del usuario recièn creado', () => (
        fetch(baseUrlAuth, initPostAuthAdmin)
        .then((res) => {
            const newRes = JWT.decode(res, config.secret)
            console.log(newRes + '\n' + authorizationAdmin);
            expect(newRes.email).toBe(authorizationAdmin.email);
        })
        .catch(e =>
            console.error(e))
    ));
});
/* describe('POST /users', () => {
    it('Debería retornar un objeto con las propiedades del usuario recièn creado', () => (
        fetch(baseUrl, initPost)
        .then((res) => {
            console.log(res.status);
            expect(res).toBe(responseOfPostUsers);
        })
        .catch(e =>
            console.error(e))
    ));
}); */

/* describe('...', () => {
    it('Debera retornar un array de objeto recien creado con informaciòn de usuarios', async() => {
        const User = mongoose.model('User', new mongoose.Schema());
        const users = await User.find();
        expect(users).toEqual(responseOfPostUsers);
    });
}); */
/* const miInit = {
    method: 'GET',
    headers: requestOfGetUsers.headers,
};
console.log(miInit)
describe('GET /users', () => {
    it('Debera retornar un array de objetos con informaciòn de usuarios', () => (
        fetch('http://localhost:3000/users', miInit)
        .then((resp) => {
            console.log(resp, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
            return expect(resp).toBe(responseOfGetUsers);
            //  return resp.json();
        }).catch(e => console.error(e))
    ));
}); */
/*     .then((miBlob) => {
        const objectURL = URL.createObjectURL(miBlob);
        miImagen.src = objectURL;
    }); */
//http://localhost:8080/orders/5d317b6fcd315c360ca5785a