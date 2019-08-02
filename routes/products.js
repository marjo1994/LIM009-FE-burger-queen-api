const {
    requireAuth,
    requireAdmin,
} = require('../middleware/auth');
const products = require('../models/modelProducts');
const pagination = require('../utils/pagination')
const { findByModels } = require('../utils/users-functions')

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

    app.get('/products', requireAuth, async(req, resp, next) => {
        let limitPage = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
        const number = await products.find().count();
        resp.set('link', pagination(protocolo, page, limitPage, number))
        findByModels(products, page, limitPage).then((result) => resp.send(result)).catch((e) => next(400));
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
                return next(404)
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
                return next(400)
            }

            /*Primero, como administrador debo poder crear productos*/
            let newProduct = new products({
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                type: req.body.type
            });
            newProduct.save((err, productStored) => {
                if (err) {
                    next(err)
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
            return next(400)
        }
        products.findOne({ _id: req.params.productId }, (err, productById) => {
            if (err) {
                return next(404)
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
            productById.save((err, productStored) => {
                if (err) {
                    return next(400)
                }
                resp.send(productStored)
            });
        })
    })

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
        products.findByIdAndRemove(req.params.productId, (err, product) => {
            if (err) {
                return next(404)
            }
            // console.log(resp.status)
            resp.send({
                message: 'Se borro satisfactoriamente!',
            });
        })

    })
    nextMain();
};