const { requireAuth } = require('../middleware/auth');
const order = require('../models/modelOrders')
const products = require('../models/modelProducts');
const pagination = require('../utils/pagination');
const mongodb = require('mongodb');
const { findByModels } = require('../controller /users-functions')


/** @module orders */
module.exports = (app, nextMain) => {
    /**
     * @name GET /orders
     * @description Lista órdenes
     * @path {GET} /orders
     * @query {String} [page=1] Página del listado a consultar
     * @query {String} [limit=10] Cantitad de elementos por página
     * @auth Requiere `token` de autenticación
     * @response {Array} orders
     * @response {String} orders[].userId Id usuaria que creó la orden
     * @response {String} orders[].client Clienta para quien se creó la orden
     * @response {Array} orders[].products Productos
     * @response {Object} orders[].products[] Producto
     * @response {Number} orders[].products[].qty Cantidad
     * @response {Object} orders[].products[].product Producto
     * @response {String} orders[].status Estado: `pending`, `canceled`, `delivering` o `delivered`
     * @response {Date} orders[].dateEntry Fecha de creación
     * @response {Date} orders[].dateProcessed Fecha de cambio de `status` a `delivered`
     * @code {200} si la autenticación es correcta
     * @code {401} si no hay cabecera de autenticación
     */
    app.get('/orders', requireAuth, async(req, resp, next) => {
        let limitPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
        const number = await order.find().count();
        resp.set('link', pagination(protocolo, page, limitPage, number))
        findByModels(order, page, limitPage).then((result) => resp.send(result)).catch((e) => next(400))
    });

    /**
     * @name GET /orders/:orderId
     * @description Obtiene los datos de una orden especifico
     * @path {GET} /orders/:orderId
     * @params {String} :orderId `id` de la orden a consultar
     * @auth Requiere `token` de autenticación
     * @response {Object} order
     * @response {String} order.userId Id usuaria que creó la orden
     * @response {String} order.client Clienta para quien se creó la orden
     * @response {Array} order.products Productos
     * @response {Object} order.products[] Producto
     * @response {Number} order.products[].qty Cantidad
     * @response {Object} order.products[].product Producto
     * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
     * @response {Date} order.dateEntry Fecha de creación
     * @response {Date} order.dateProcessed Fecha de cambio de `status` a `delivered`
     * @code {200} si la autenticación es correcta
     * @code {401} si no hay cabecera de autenticación
     * @code {404} si la orden con `orderId` indicado no existe
     */
    app.get('/orders/:orderid', requireAuth, (req, resp, next) => {
        order.findOne({ _id: req.params.orderid }, (err, orderById) => {
            if (err || !orderById) {
                return next(404)
            }
            resp.status(200).send(orderById);
        })
    });

    /**
     * @name POST /orders
     * @description Crea una nueva orden
     * @path {POST} /orders
     * @auth Requiere `token` de autenticación
     * @body {String} userId Id usuaria que creó la orden
     * @body {String} client Clienta para quien se creó la orden
     * @body {Array} products Productos
     * @body {Object} products[] Producto
     * @body {String} products[].productId Id de un producto
     * @body {Number} products[].qty Cantidad de ese producto en la orden
     * @response {Object} order
     * @response {String} order.userId Id usuaria que creó la orden
     * @response {String} order.client Clienta para quien se creó la orden
     * @response {Array} order.products Productos
     * @response {Object} order.products[] Producto
     * @response {Number} order.products[].qty Cantidad
     * @response {Object} order.products[].product Producto
     * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
     * @response {Date} order.dateEntry Fecha de creación
     * @response {Date} order.dateProcessed Fecha de cambio de `status` a `delivered`
     * @code {200} si la autenticación es correcta
     * @code {400} no se indica `userId` o se intenta crear una orden sin productos
     * @code {401} si no hay cabecera de autenticación
     */

    app.post('/orders', requireAuth, async(req, resp, next) => {
        if (!req.body.products || !req.body.userId) {
            return next(400);
        };
        let newOrder = new order();
        newOrder.userId = req.body.userId;
        const arrOfProducts = await products.find({ _id: { $in: req.body.products.map(p => mongodb.ObjectId(p.product)) } })
        if (arrOfProducts.length !== req.body.products.length) {
            req.body.products = req.body.products.filter((x) => {
                return x !== null || undefined
            })
        }
        const productsReales = req.body.products.map((p, index) => ({
            product: {
                id: mongodb.ObjectId(p.product),
                name: arrOfProducts[index].name,
                price: arrOfProducts[index].price
            },
            qty: p.qty
        }));
        newOrder.products = productsReales;
        newOrder.save((err, orderStored) => {
            if (err) console.error(err)
            resp.send(orderStored)
        })
    });
    /**
     * @name PUT /orders
     * @description Modifica una orden
     * @path {PUT} /products
     * @params {String} :orderId `id` de la orden
     * @auth Requiere `token` de autenticación
     * @body {String} [userId] Id usuaria que creó la orden
     * @body {String} [client] Clienta para quien se creó la orden
     * @body {Array} [products] Productos
     * @body {Object} products[] Producto
     * @body {String} products[].productId Id de un producto
     * @body {Number} products[].qty Cantidad de ese producto en la orden
     * @body {String} [status] Estado: `pending`, `canceled`, `delivering` o `delivered`
     * @response {Object} order
     * @response {String} order.userId Id usuaria que creó la orden
     * @response {Array} order.products Productos
     * @response {Object} order.products[] Producto
     * @response {Number} order.products[].qty Cantidad
     * @response {Object} order.products[].product Producto
     * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
     * @response {Date} order.dateEntry Fecha de creación
     * @response {Date} order.dateProcessed Fecha de cambio de `status` a `delivered`
     * @code {200} si la autenticación es correcta
     * @code {400} si no se indican ninguna propiedad a modificar o la propiedad `status` no es valida
     * @code {401} si no hay cabecera de autenticación
     * @code {404} si la orderId con `orderId` indicado no existe
     */
    app.put('/orders/:orderid', requireAuth, (req, resp, next) => {
        if (!req.body.status) {
            return next(400);
        }
        order.findOneAndUpdate({ _id: req.params.orderid }, { $set: { status: req.body.status } }, { runValidators: true, new: true }, (error, orderStored) => {
            if (error || !orderStored) {
                //console.error(error.kind !== 'enum')
                //console.error(error.errors.status.kind)
                console.error('aaaaaaaaaaa')
                if (error.kind !== 'enum') {
                    return next(404)
                }
                return next(400)
            }
            console.error('bbbbbbbbbb')
            resp.send(orderStored)
        })
    });

    /**   
     * @name DELETE /orders
     * @description Elimina una orden
     * @path {DELETE} /orders
     * @params {String} :orderId `id` del producto
     * @auth Requiere `token` de autenticación
     * @response {Object} order
     * @response {String} order.userId Id usuaria que creó la orden
     * @response {String} order.client Clienta para quien se creó la orden
     * @response {Array} order.products Productos
     * @response {Object} order.products[] Producto
     * @response {Number} order.products[].qty Cantidad
     * @response {Object} order.products[].product Producto
     * @response {String} order.status Estado: `pending`, `canceled`, `delivering` o `delivered`
     * @response {Date} order.dateEntry Fecha de creación
     * @response {Date} order.dateProcessed Fecha de cambio de `status` a `delivered`
     * @code {200} si la autenticación es correcta
     * @code {401} si no hay cabecera de autenticación
     * @code {404} si el producto con `orderId` indicado no existe
     */
    app.delete('/orders/:orderid', requireAuth, (req, resp, next) => {

        order.findByIdAndRemove(req.params.orderid, (err, product) => {
            if (err) {
                return next(404)
            }
            return resp.send({ message: 'Se borro satisfactoriamente!' });
        });
    });
    nextMain();
};