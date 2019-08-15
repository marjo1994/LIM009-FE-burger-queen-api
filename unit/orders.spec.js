const { getOrders, getOrdersById, postOrders, putOrders, deleteOrders } = require('../controllers/orders')
const { postProduct } = require('../controllers/products')
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
    headers: '',
    body: {
        name: 'productToOrder',
        price: '10',
        type: 'breakfast',
    }
};
const requestOfPostOrders = {
    headers: {
        authorization: '',
        user: {
            _id: '5d4916541d4f9a3b2dcac66d',
            email: 'admin@localhost',
            password: 'changeme',
            roles: { admin: true }
        }
    },
    body: {
        userId: '5d4916541d4f9a3b2dcac66d',
        client: 'Maria',
        products: [{ qty: 5 }]
    }
}
const requestEmptyPostOrders = {
    headers: {
        authorization: '',

    },
    body: {
        userId: '5d4916541d4f9a3b2dcac66d',
        products: []
    }
}


describe('POST/ orders', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería crear una nueva orden', async() => {
        const createdProduct = await postProduct(requestOfPostProduct, resp, next);
        requestOfPostOrders.body.products[0].product = createdProduct._id;
        await postOrders(requestOfPostOrders, resp, next);
        expect(resp.send.mock.results[1].value).toHaveProperty('_id');
        expect(resp.send.mock.results[1].value).toHaveProperty('status', 'pending');
        expect(resp.send.mock.results[1].value).toHaveProperty('userId', '5d4916541d4f9a3b2dcac66d');
    });
    it('Debería retornar 400 si no se ingresan datos', async() => {
        await postOrders(requestEmptyPostOrders, resp, next);
        expect(next.mock.calls[0][0]).toBe(400);
    });
});

describe('GET/orders', () => {

    const requestOfGetOrders = {
        headers: {
            authorization: '',    
        },
        query: {
            limit: 10,
            page: 1
        },
        protocol: 'http',
        get: jest.fn(res => `localhost:${port}`),
        path: '/orders',
    }
    
    const resp = {
        send: jest.fn(json => json),
        set: jest.fn(json => json)
    };
    const next = jest.fn(json => json);


    it('Debería obtener un array con las ordenes', async() => {
        const resp1 = {
            send: jest.fn(json => json),
        };
        const createdProduct = await postProduct(requestOfPostProduct, resp1, next);
        requestOfPostOrders.body.products[0].product = createdProduct._id;
        const resp2 = {
            send: jest.fn(json => json),
        };
        await postOrders(requestOfPostOrders, resp2, next);        
        const order = await getOrders(requestOfGetOrders, resp, next);
        console.log(order)
        expect(resp.send.mock.calls.length).toBe(1)
    })
})

describe('GET/orders/:orderid', () => {
   /* const requestOfGetProductByUid = {
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
    getProductById(requestOfGetProductByUid, resp, next)*/
})





const requestOfPostOrders2 = {
    headers: {
        authorization: '',
        user: {
            _id: '5d4916541d4f9a3b2dcac66d',
            email: 'admin@localhost',
            password: 'changeme',
            roles: { admin: true }
        }
    },
    body: {
        userId: '5d4916541d4f9a3b2dcac66d',
        client: 'Mayte',
        products: [{ qty: 1 }]
    }
}
const requestOfPutOrders = {
    headers: {
        authorization: '',
        user: {
            _id: '5d4916541d4f9a3b2dcac66d',
            email: 'admin@localhost',
            roles: { admin: true }
        }
    },
    body: {
        status: 'preparing'
    },
    params: {
        uid: '5d4916541d4f9a3b2dcac66d',
    }
};

describe('PUT/ orders:uid', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debería crear una nueva orden', async() => {
        const createdProduct = await postProduct(requestOfPostOrders2, resp, next);
        requestOfPostOrders.body.products[0].product = createdProduct._id;
        await putOrders(requestOfPutOrders, resp, next);
        expect(resp.send.mock.results[1].value).toHaveProperty('_id');
    });
    /*    it('Debería retornar 400 si no se ingresan datos', async() => {
           await postOrders(requestEmptyPostOrders, resp, next);
           expect(next.mock.calls[0][0]).toBe(400);
       }); */
});
/* describe('GET/ orders', () => {
    const resp = {
        send: jest.fn(json => json),
        set: jest.fn(json => json)
    };

    const next = jest.fn(json => json);

    it('Debería traer una nueva orden', async() => {
        const createdProduct = await postProduct(requestOfPostProduct, resp, next);

        requestOfPostOrders.body.products[0].product = createdProduct._id;
        requestOfPostOrders2.body.products[0].product = createdProduct._id;
        const createOrder1 = await postOrders(requestOfPostOrders, resp, next);
        const createOrder2 = await postOrders(requestOfPostOrders2, resp, next);

        let responseOfGetOrder = [];
        responseOfGetOrder.push(createOrder1, createOrder2)
        const functTest = await getOrders(requestOfGetOrders, resp, next)
        resp.send.mockReturnValue(functTest)
        expect(resp.send()).toEqual(responseOfGetOrder);
    });
}); */


/* 
describe('POST/orders', () => {
    let mockUid = '';
    beforeAll(async() => {
        const requestOfPostProduct = {
            headers: '',
            body: {
                name: 'productToOrder',
                price: '10',
                type: 'breakfast',
            },
        };
        const resp = {
            send: jest.fn(json => json),
        };
        const next = jest.fn(code => code);

        await postProduct(requestOfPostProduct, resp, next);
        mockUid = resp.send.mock.calls[0][0]._id
    })
    console.log(mockUid)

    it('Debería crear una nueva orden', async() => {
        /*   const obj = {
              client: 'Maria',
              status: 'pending',
              userId: 'abc',
          };

          const requestOfPostOrders = {
              headers: {
                  authorization: '',
              },
              body: {
                  userId: 'abc',
                  client: 'Maria',
                  products: [{ product: mockUid, qty: 5 }]
              }
          }

          const resp = {
              send: jest.fn(json => json)
          };

          const next = jest.fn(code => code);

          await postOrders(requestOfPostOrders, resp, next);
          expect(resp.send.mock.calls[0][0]).toMatchObject(obj);
    })
    ;
}); */