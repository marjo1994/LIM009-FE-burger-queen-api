const {
  requireAuth,
} = require('../middleware/auth');
const order = require('../models/modelOrders')

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
  app.get('/orders', requireAuth, (req, resp, next) => {
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenficación' })
    }
    order.find({}, (err, orders) => {
      if (err) {
        return resp.status(404).send({ message: 'No hay ordenes para mostrar' })
      }
      resp.status(200).send(orders);
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
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenficación' })
    }
    order.find({ _id: req.params.orderid }, (err, orderById) => {
      if (err) {
        return resp.status(404).send({ message: 'La orden con `orderId` indicado no existe' })
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

  app.post('/orders', requireAuth, (req, resp, next) => {
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenficación' })
    }
    const newOrder = new order();
    newOrder.userId = req.headers.user._id;
    newOrder.client = req.body.client;
    newOrder.products.push({ qty: req.body.qty, product: req.body.product });
    newOrder.status = req.body.status;
    if (req.body.status === 'delivered') {
      newOrder.dateProcessed = new Date();
    }
    newOrder.save((err, orderStored) => {
      if (err) {
        console.log(err);
        resp.status(400).send({ message: 'no se indica `userId` o se intenta crear una orden sin productos' })
      }
      console.log(orderStored);
      resp.status(200).send({ message: 'se registro la orden exitosamente' })
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
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenticación' })
    }
    if (!req.body || !req.body.status) {
      return resp.status(400).send({ message: 'No se indican ninguna propiedad a modificar o la propiedad `status` no es valida' })
    }
    order.find({ _id: req.params.orderid }, (err, orderById) => {
      if (err) {
        return resp.status(404).send({ message: 'La orderId con `orderId` indicado no existe' })
      }
      if (req.body.client) {
        orderById.client = req.body.client;
      }
     // if(req.body.qty||req.bod)
/*       if (req.body.product || req.body.qty || (req.body.product && req.body.qty)) {
        orderById.products.push({ product: req.body.product } || { qty: req.body.qty } || { qty: req.body.qty, product: req.body.product });
      }
 */
      if (req.body.status === 'delivered') {
        orderById.status = 'delivered';
        orderById.dateProcessed = new Date();
      }
      console.log(orderById)
      resp.status(200).send(orderById);
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
    if (!req.headers.authorization) {
      return resp.status(401).send({ message: 'No existe cabecera de autenficación' })
    }
    /*  if (req.headers.user._id.toString() === req.params.uid && isAdmin(req)) {
       return resp.send({ message: 'Admin no puede autoeliminarse' })
     } */
    /*  if (req.headers.user._id.toString() === req.params.orderid || isAdmin(req)) { */
    //order.products.id(req.params.orderid).remove();===> para eliminar solo la sección productos
    order.remove({ _id: req.params.orderid }, (err) => {
      if (err) {
        resp.status(404).send({ message: 'La orden seleccionada no existe' })
      }
      resp.status(200).send({ message: 'Se borro satisfactoriamente!' });
    });
    order.find({}, (err, res) => {
      console.log(res)
    })
    /*  } else {
       resp.status(403).send({ message: 'No es ni admin o el mismo usuario' })
     } */

  });
  nextMain();
};
