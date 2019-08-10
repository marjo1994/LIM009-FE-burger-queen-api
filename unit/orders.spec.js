const { getOrders, getOrdersById, postOrders, putOrders, deleteOrders } = require('../controllers/orders')
const {postProduct} = require('../controllers/products')
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
       

    it('Debería crear una nueva orden', async() => {
        const obj = {
            client: 'Maria',
            status: 'pending',
            userId: 'abc',
          };

        const requestOfPostOrders = {
            headers: {
                authorization: '',  
            }, body: {
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
    });
});
