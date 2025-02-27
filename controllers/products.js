const products = require('../models/modelProducts');
const pagination = require('../utils/pagination')

module.exports.getProducts = async(req, resp, next) => {
    let limitPage = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    products.find().count().then((number) => {
        resp.set('link', pagination(protocolo, page, limitPage, number))
    });
    const result = await products.find().skip((page - 1) * limitPage).limit(limitPage).exec()
    return resp.send(result);
}

module.exports.getProductById = async(req, resp, next) => {    
    try {
        const productById = await products.findOne({ _id: req.params.productId })
        if (!productById) {
            return next(404)
        } 
        return resp.send(productById);
        

      } catch(e) {
            return next(404)
        } 
      
}

module.exports.postProduct = async(req, resp, next) => {
    try {
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
        const saved = await newProduct.save()
        return resp.send(saved);
    } catch (e) {
        return next(404)
    }
}


module.exports.putProductById = async(req, resp, next) => {
    try {
        if (req.body === {} || !req.body) {
            return next(400);
        }

        const productById = await products.findOne({ _id: req.params.productId });

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
        const productStored = await productById.save();
        return resp.send(productStored);
    } catch (e) {
        if (e.kind === 'ObjectId') return next(404)
        return next(400);
    }
};

module.exports.deleteProductById = async(req, resp, next) => {
    try {
        const productDelete = await products.findByIdAndRemove(req.params.productId);
        return resp.send({
            message: 'Se borro satisfactoriamente!',
        });
    } catch (e) {
        return next(404)        
    }
}