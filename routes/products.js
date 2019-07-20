const {
  requireAuth,
  requireAdmin,
} = require('../middleware/auth');
const products = require('../models/modelProducts');
/** @module products */
module.exports = (app, nextMain) => {
  /**
   * @name GET /products
   * @description Lista productos
   * @path {GET} /products
   * @query {String} [page=1] Página del listado a consultar
   * @query {String} [limit=10] Cantitad de elementos por página
   * @auth Requiere `token` de autenticación
   * @response {Array} products
   * @response {String} products[].name Nombre
   * @response {String} products[].price Precio
   * @response {URL} products[].image URL a la imagen
   * @response {String} products[].type Tipo/Categoría
   * @response {Date} products[].dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   */
  app.get('/products', requireAuth, (req, resp, next) => {
    products.find({}, (err, res) => {
      if (err) {
        return resp.status(400).send({ message: 'error al obtener productos' })
      } else {
        resp.send(res)
      }
    });
  });

  /**
   * @name GET /products/:productId
   * @description Obtiene los datos de un producto especifico
   * @path {GET} /products/:productId
   * @params {String} :productId `id` del producto
   * @body {String} name Nombre
   * @body {Number} price Precio
   * @body {String} [imagen='']  URL a la imagen
   * @body {String} [type=undefined] Tipo/Categoría
   * @auth Requiere `token` de autenticación
   * @response {Object} product
   * @response {String} product.name Nombre
   * @response {String} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {404} si el producto con `productId` indicado no existe
   */
    app.get('/products/:productId', requireAuth, (req, resp, next) => {
      products.findOne({ _id: req.params.productId }, (err, productById) => {
        if (err || !productById) {
          return resp.status(404).send({ message: 'El producto con `productId` indicado no existe' })
        }
        resp.send(productById);
      })
    });
  

  /**
   * @name POST /products
   * @description Crea un nuevo producto
   * @path {POST} /products
   * @auth Requiere `token` de autenticación y que la usuaria sea **admin**
   * @body {String} name Nombre
   * @body {Number} price Precio
   * @body {String} [imagen]  URL a la imagen
   * @body {String} [type] Tipo/Categoría
   * @response {Object} product
   * @response {String} product.name Nombre
   * @response {String} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {400} si no se indican `name` o `price`
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es admin
   */
  app.post('/products', requireAdmin, (req, resp, next) => {
    if (!req.body.name || !req.body.price) {
      return resp.status(400).send({ message: 'No se indican `name` o `price`' })
    }
    /*Primero, como administrador debo poder crear productos*/
    let newProduct = new products();
    newProduct.name = req.body.name
    newProduct.price = req.body.price
    newProduct.image = req.body.image
    newProduct.type = req.body.type
    newProduct.save((err, productStored) => {
      if(err){
        resp.send(err)
      }
      resp.send(productStored)
    });
  })


  /**
   * @name PUT /products
   * @description Modifica un producto
   * @path {PUT} /products
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @body {String} [name] Nombre
   * @body {Number} [price] Precio
   * @body {String} [imagen]  URL a la imagen
   * @body {String} [type] Tipo/Categoría
   * @response {Object} product
   * @response {String} product.name Nombre
   * @response {String} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {400} si no se indican ninguna propiedad a modificar
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es admin
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.put('/products/:productId', requireAdmin, (req, resp, next) => {
    if (!req.body) {
      return resp.status(400).send({ message: 'No se indica ninguna propiedad a modificar' })
    }
    products.findOne({ _id: req.params.productId }, (err, productById) => {
      if (err) {
        return resp.status(404).send({ message: 'El producto con `productId` indicado no existe' })
      }
      if (req.body.name) {
        productById.name = req.body.name
      }
      if (req.body.price) {
        productById.price = req.body.price
      }
      if (req.body.image) {
        productById.image = req.body.image
      }
      if (req.body.type) {
        productById.type = req.body.type
      }
      productById.save()
      resp.send(productById)
    })
  });

  /**
   * @name DELETE /products
   * @description Elimina un producto
   * @path {DELETE} /products
   * @params {String} :productId `id` del producto
   * @auth Requiere `token` de autenticación y que el usuario sea **admin**
   * @response {Object} product
   * @response {String} product.name Nombre
   * @response {String} product.price Precio
   * @response {URL} product.image URL a la imagen
   * @response {String} product.type Tipo/Categoría
   * @response {Date} product.dateEntry Fecha de creación
   * @code {200} si la autenticación es correcta
   * @code {401} si no hay cabecera de autenticación
   * @code {403} si no es ni admin
   * @code {404} si el producto con `productId` indicado no existe
   */
  app.delete('/products/:productId', requireAdmin, (req, resp, next) => {
    products.findByIdAndDelete({ _id: req.params.productId }, (err, doc) => {
      if (!doc) {
        resp.status(404).send({ message: 'El producto seleccionado no existe' })
      }
     // console.log(resp.status)
      resp.status(200).send({ message: 'Se borro satisfactoriamente!' });
    })
  });

  nextMain();
};
