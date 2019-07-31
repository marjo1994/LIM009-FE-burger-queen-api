const mongoose = require('mongoose');
const fetch = require('node-fetch')
const config = require('../config');
//const User = mongoose.model('Users');
const { requestOfPostUsers, responseOfPostUsers, requestOfGetUsers, responseOfGetUsers } = require('../_mocks_/dataUsers')
const { MongoMemoryServer } = require('mongodb-memory-server');
const port = process.env.PORT || 8888;
const baseUrl = process.env.REMOTE_URL || `http://127.0.0.1:${port}/users`;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 600000;

let mongoServer;
const opts = { useMongoClient: true }; // remove this option if you use mongoose 5 and above

beforeAll(async() => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getConnectionString();
    await mongoose.connect(mongoUri, opts, (err) => {
        if (err) console.error(err);
    });
});

const initPost = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': requestOfPostUsers.headers.authorization,
    },
    body: requestOfPostUsers.body
};
console.log(initPost)

describe('POST /users', () => {
    it('Debería retornar un objeto con las propiedades del usuario recièn creado', () => (
        fetch(baseUrl, initPost)
        .then((res) => {
            console.log(res.status);
            expect(res).toBe(responseOfPostUsers);
        })
        .catch(e =>
            console.error(e))
    ));
});

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