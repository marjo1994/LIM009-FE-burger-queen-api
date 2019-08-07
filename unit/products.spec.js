const {getProducts, getProductById, postProduct, putProductById, deleteProductById} = require('../controllers/products')
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



const requestOfPostProduct = {
    headers: {
        authorization: '',
    },
    body: {
        name: 'product1',
        price: 1,
        type: 'hamburguesa'
    },

}

const responseObjectOfProduct = {
    name: 'product1',
    price: 1,
    type: 'hamburguesa'
};

const emptyRequesttoCreateProduct = {
    headers: {
        authorization: '',
    },
    body: {
        name: 'product2',
        price: ''
    },
};
const emptyRequest2toCreateProduct = {
    headers: {
        authorization: '',
    },
    body: {
        name: '',
        price: ''
    },
};

const resp = {
    send: jest.fn(json => json),
    set: jest.fn(json => json)
};

const next = jest.fn(json => json);

describe('POST/ products', () => {
    it('Debería crear un nuevo producto', async() => {
        const productSend = await postProduct(requestOfPostProduct, resp, next);
        expect(productSend).toMatchObject(responseObjectOfProduct)
    })
    it('Debería retornar un error 400 si no se indican `name` o `price`', async() => {
        const productSend = await postProduct(emptyRequesttoCreateProduct, resp, next);
        const productSend2 = await postProduct(emptyRequest2toCreateProduct, resp, next);
        expect(productSend).toBe(400);
        expect(productSend2).toBe(400);
    })
});

const requestOfGetProducts = {
    'headers' : {
        authorization: ''
    },
    'query' : {
        limit: 10,
        page: 1
    },
    'protocol': 'http',
    'get': jest.fn(res => `localhost:${port}`),
    'path': '/products',
}

const requestOfPostProduct2 = {
    headers: {
        authorization: '',
    },
    body: {
        name: 'product2' ,
        price: 2 ,
        type: 'papas fritas'
    },
};
const responseOfGetProducts = [];
describe('GET/products', () => {
    it('Debería obtener un array con los productos', async() => {
        const productSend = await postProduct(requestOfPostProduct, resp, next);
        const productSend2 = await postProduct(requestOfPostProduct2, resp, next);
        responseOfGetProducts.push(productSend, productSend2);
        const products = await getProducts(requestOfGetProducts, resp, next);
        expect(products).toHaveLength(responseOfGetProducts.length)
    })
})


/*const requestOfGetUsersById = {
    'headers': {
        authorization: ''
    },
    params: {
        uid: '5d4916541d4f9a3b2dcac66d'
    }
};
const requestOfGetUsersByEmail = {
    'headers': {
        authorization: ''
    },
    params: {
        uid: 'marjorie@labo.la'
    }
};


describe('GET/ users:uid', () => {
    it('Debería retornar el usuario llamado por ID', async() => {
        await postUser(requestOfPostUsers, resp, next);
        const user = await getUserUid(requestOfGetUsersById, resp, next);
        expect(JSON.parse(JSON.stringify(user))).toMatchObject(responseObjectOfUser);
    });
    it('Debería retornar el usuario llamado por Email', async() => {
        await postUser(requestOfPostUsers, resp, next);
        const user2 = await getUserUid(requestOfGetUsersByEmail, resp, next);
        expect(JSON.parse(JSON.stringify(user2))).toMatchObject(responseObjectOfUser);
    });
});*/