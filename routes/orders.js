const { requireAuth } = require('../middleware/auth');
const order = require('../models/modelOrders')
const products = require('../models/modelProducts');
const pagination = require('../utils/pagination');

/** @module orders */
module.exports = (app, nextMain) => {
    //app.use(requireAuth)
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
    app.get('/orders', requireAuth, (req, resp, next) => {
        let limitPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
        order.find().count((err, number) => {
            if (err) console.log(err)
                //console.log(pagination(protocolo, page, limitPage, number))
            resp.set('link', pagination(protocolo, page, limitPage, number))
        })

        order.find().skip((page - 1) * limitPage).limit(limitPage).exec((err, orders) => {
            if (err || !orders) {
                return next(400)
            }
            resp.send(orders);
        })
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
    /*   newOrder.status = req.body.status;
                      if (req.body.status === 'delivered') 
                          newOrder.dateProcessed = new Date();
                      } */
    app.post('/orders', requireAuth, (req, resp, next) => {
        if (!req.body.products || !req.body.userId) {
            return next(400);
        }
        const subDocument = req.body.products;
        products.findOne({ _id: subDocument.product }, (err, productFound) => {
            if (err || !productFound) {
                console.log(err || 'no hay producto')
                return next(400)
            }
            let newOrder = new order();
            newOrder.userId = req.body.userId;
            // newOrder.client = req.body.client;
            newOrder.products.push(req.body.products);
            newOrder.save((err, orderStored) => {
                if (err) resp.send(err)
                resp.send({ message: 'se registro la orden exitosamente' })
            })
        })

    })


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
        if (!req.body.state) {
            return next(400);
        }
        if (req.body.state === 'canceled') {
            return next(404)
        }
        order.findOneAndUpdate({ _id: req.params.orderid }, (err, orderById) => {
            if (err || !orderById) {
                return next(404)
            }
            /*  if (req.body.client) {
                 orderById.client = req.body.client;
             } */
            // if(req.body.qty||req.bod)
            /*       if (req.body.product || req.body.qty || (req.body.product && req.body.qty)) {
                    orderById.products.push({ product: req.body.product } || { qty: req.body.qty } || { qty: req.body.qty, product: req.body.product });
                  }
             */

        });
    })

    /**    if (req.body.status === 'delivered') {
                orderById.status = 'delivered';
                orderById.dateProcessed = new Date();
            }
            console.log(orderById)
            orderById.save();
            resp.status(200).send(orderById);
        }) 
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