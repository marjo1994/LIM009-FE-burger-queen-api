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
    beforeEach(async() => {
    
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

    it('Debería retornar el producto llamado por su Uid', async () => {
        const objProduct = {
            name: 'product3',
            price: 5,
            type:'breakfast'
        }       
        
        const requestOfGetProductByUid = {
            headers: {
                authorization: ''
            },
            params: {
                productId: mockUid._id.toString()
            }
        }

        const resp = {
            send: jest.fn(json => json),

        };

        await getProductById(requestOfGetProductByUid, resp, next)
        expect(resp.send.mock.results[0].value).toMatchObject(objProduct)

        //expect(resp.send.mock.calls[0][0]).toBe('a');
       
    })

    it('Debería retornar 404 llamado por un Uid errado', async() => {

        const requestOfGetProductByUidWrong = {
            headers: '',
            params: {
                productId: 'failUid'
            }
        };
        const next = jest.fn(json => json);

        await getProductById(requestOfGetProductByUidWrong, resp, next)
        expect(next.mock.calls[0][0]).toBe(404);

    })

});

const requestOfPostProduct3 = {
    headers: '',
    body: {
        name: 'product4',
        price: 6,
        type: 'dinner',
    },
};
const requestOfPostProduct4 = {
    headers: '',
    body: {
        name: 'product5',
        price: 6,
        type: 'dinner',
        image: 'https://urlImage.com'
    },
};
const productUpdate = {
    name: 'productUpdate',
    price: 5,
    type: 'lunch',
    image: 'https://urlImage2.com'
}
const requestOfPutProductByUid = {
    header: '',
    params: {
        productId: ''
    },
    body: {
        name: 'productUpdate',
        type: 'lunch',
        price: 5,
        image: 'https://urlImage2.com'
    }
}
const requestOfPutBadUid = {
    header: '',
    params: {
        productId: 'badProductId123'
    },
    body: { name: 'papas' },
}
const requestOfPutPropertyBad = {
    header: '',
    params: {
        productId: ''
    },
    body: { badProperty: [] }
}
describe('PUT/products:productId', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debe retornar el producto editado que ha sido llamado por su Uid', async() => {
        const productPost = await postProduct(requestOfPostProduct3, resp, next);
        requestOfPutProductByUid.params.productId = productPost._id.toString();

        const producto = await putProductById(requestOfPutProductByUid, resp, next);
        resp.send.mockReturnValue(producto);
        expect(resp.send()).toHaveProperty('_id');
        expect(resp.send()).toHaveProperty('name', productUpdate.name);
        expect(resp.send()).toHaveProperty('type', productUpdate.type);
    })
    it('Debe retornar 400 sino existe ningún campo a editar', async() => {
        requestOfPutProductByUid.body = '';
        await putProductById(requestOfPutProductByUid, resp, next)
        expect(next.mock.calls[0][0]).toBe(400);
    });

    it('Debe retornar 404 si se ingres un id inválido', async() => {
        await putProductById(requestOfPutBadUid, resp, next)
        expect(next.mock.calls[1][0]).toBe(404);
    })
    it('Debe retornar 400 si se ingresa una propiedad inválida', async() => {
        const productPost2 = await postProduct(requestOfPostProduct4, resp, next);
        requestOfPutPropertyBad.params.productId = productPost2._id.toString();
        await putProductById(requestOfPutPropertyBad, resp, next)
        expect(next.mock.calls[2][0]).toBe(400);
    })
});


const requestOfPostProduct5 = {
    headers: '',
    body: {
        name: 'productDelete',
        price: 2,
        type: 'lunch',
    },
};
const requestOfDeleteProductByUid = {
    header: '',
    params: {
        productId: ''
    },
    body: {}
}
const requestOfDeleteBadUid = {
    header: '',
    params: {
        productId: 'badProductId123'
    },
    body: {}
}
describe('DELETE/products:productId', () => {
    const resp = {
        send: jest.fn(json => json),
    };

    const next = jest.fn(json => json);

    it('Debe eliminar el producto editado que ha sido llamado por su Uid', async() => {
        const productPost = await postProduct(requestOfPostProduct5, resp, next);
        requestOfDeleteProductByUid.params.productId = productPost._id.toString();
        const producto = await deleteProductById(requestOfDeleteProductByUid, resp, next);
        resp.send.mockReturnValue(producto);
        expect(resp.send()).toEqual({ message: 'Se borro satisfactoriamente!' });
    })
    it('Debe retornar 404 si se ingresa un id inválido', async() => {
        await deleteProductById(requestOfDeleteBadUid, resp, next)
        expect(next.mock.calls[0][0]).toBe(404);
    })
});