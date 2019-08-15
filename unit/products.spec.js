const { getProducts, getProductById, postProduct, putProductById, deleteProductById } = require('../controllers/products')
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
        await postProduct(requestOfPostProduct, resp, next);
        expect(resp.send.mock.results[0].value).toMatchObject(responseObjectOfProduct)
    })

    // expect(mockCallback.mock.results[0].value).toBe(42);

    it('Debería retornar un error 400 si no se indican `name` o `price`', async() => {
        await postProduct(emptyRequesttoCreateProduct, resp, next);
        await postProduct(emptyRequest2toCreateProduct, resp, next);
        expect(next.mock.calls[0][0]).toBe(400);
        expect(next.mock.calls[0][0]).toBe(400);
    })
});

const requestOfGetProducts = {
    headers: {
        authorization: ''
    },
    query: {
        limit: 10,
        page: 1
    },
    protocol: 'http',
    get: jest.fn(res => `localhost:${port}`),
    path: '/products',
}

const requestOfPostProduct2 = {
    headers: {
        authorization: '',
    },
    body: {
        name: 'product2',
        price: 2,
        type: 'papas fritas'
    },
};
describe('GET/products', () => {
    it('Debería obtener un array con los productos', async() => {
        const resp = {
            send: jest.fn(json => json),
            set: jest.fn(json => json)
        };
        await postProduct(requestOfPostProduct2, resp, next);
        await getProducts(requestOfGetProducts, resp, next);
        expect(resp.send.mock.calls.length).toBe(2)
    })
});

describe('GET/ products:productId', () => {
    let mockUid = '';
    beforeAll(async() => {
        const requestOfPostProduct = {
            headers: '',
            body: {
                name: 'product3',
                price: '5',
                type: 'breakfast',
            },
        };
        const resp = {
            send: jest.fn(json => json),
        };
        await postProduct(requestOfPostProduct, resp, next);
        mockUid = resp.send.mock.calls[0][0]
    })

    it('Debería retornar el producto llamado por su Uid', () => {
        //console.log(mockUid);
        const requestOfGetProductByUid = {
            headers: {
                authorization: ''
            },
            params: {
                productId: mockUid._id.toString()
            }
        }

        const resp = {
            send: jest.fn(json => {
                console.log(resp.send.mock.calls[0][0],'hola')
                expect(resp.send.mock.calls).toHaveLength(1);
            }),
        };
        getProductById(requestOfGetProductByUid, resp, next)
    })

    it('Debería retornar 404 llamado por un Uid errado', () => {

        const requestOfGetProductByUidWrong = {
            headers: '',
            params: {
                uid: 'failUid'
            }
        };
        const next = jest.fn(json => {
            expect(next.mock.calls[0][0]).toBe(404);
        });
        /*const resp = {
            send: jest.fn(json => json),
        };*/

        getProductById(requestOfGetProductByUidWrong, resp, next)

    })

});

const requestOfPostProduct3 = {
    headers: '',
    body: {
        name: 'product4',
        price: '6',
        type: 'dinner',
    },
};
const requestOfPutProductByUid = {
    header: '',
    params: {
        productId: ''
    },
    body: {
        name: 'productUpdate2'
    }
}

describe('PUT/products:productId', () => {

    it('Debe retornar el producto editado que ha sido llamado por su Uid', async() => {

        const resp = {
            send: jest.fn(json => json),
        };

        const next = jest.fn(json => json);

        const productPost = await postProduct(requestOfPostProduct3, resp, next);
        requestOfPutProductByUid.params.productId = productPost._id.toString();
        // console.log(requestOfPutProductByUid)
        const producto = await putProductById(requestOfPutProductByUid, resp, next);
        // console.log(producto)
        resp.send.mockReturnValue(producto)
        expect(resp.send()).toHaveProperty('_id');
    })

    /*     it('DeObjectIdbe retornar 400 sino existe ningún campo a editar', () => {
            const requestOfPutProductByUid = {
                header: '',
                params: {
                    uid: mockUid2._id.toString()
                }
            };
            const resp = {
                send: jest.fn(json => json)
            };

            const next = jest.fn(json => {
                expect(next.mock.calls[0][0]).toBe(400);
            })

            putProductById(requestOfPutProductByUid, resp, next)

        }) */
});

/* 
describe('DELETE/products:uid', () => {
it('Debería eliminar un ')

}) */