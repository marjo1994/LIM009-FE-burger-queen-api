const mongoose = require('mongoose');
const fetch = require('node-fetch')
const config = require('../config');

//const User = mongoose.model('Users');
const { requestOfPostUsers, responseOfPostUsers, requestOfGetUsers, responseOfGetUsers } = require('../_mocks_/dataUsers')

const initPost = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'authorization': requestOfPostUsers.headers.authorization,
    },
    body: requestOfPostUsers.body
};
console.log(initPost)

describe('POST /users', () => {
    it('Debería retornar un objeto con las propiedades del usuario recièn creado', () => (
        fetch(`http://localhost:8080/users`, initPost)
        .then((res) => {
            console.log(res);
            expect(res).toBe(responseOfPostUsers);
        })
        .catch(e =>
            console.error(e))
    ));
});
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