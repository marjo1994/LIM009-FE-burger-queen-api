const order = require('../models/modelOrders')
const products = require('../models/modelProducts');
const pagination = require('../utils/pagination');
const mongodb = require('mongodb');

module.exports.getOrders = async(req, resp, next) => {
    let limitPage = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    const number = await order.find().countDocuments();
    resp.set('link', pagination(protocolo, page, limitPage, number))
    const orderFound = await order.find().skip((page - 1) * limitPage).limit(limitPage).exec();
    if (!orderFound) return next(400)
    return resp.send(orderFound)
};

module.exports.getOrdersById = async(req, resp, next) => {
    try {
        const orderFound = await order.findOne({ _id: req.params.orderid });
        if (!orderFound) return next(404);
        return resp.send(orderFound);
    } catch (e) {
        return next(404)
    }
};

module.exports.postOrders = async(req, resp, next) => {
    if (!req.body.products || req.body.products.length === 0) {
        return next(400);
    };

    let newOrder = new order();
    newOrder.dateEntry = Date.now();
    newOrder.userId = req.headers.user._id;
    newOrder.client = req.body.client;

    const arrOfProducts = await products.find({ _id: { $in: req.body.products.map(p => mongodb.ObjectId(p.product)) } })
    if (arrOfProducts.length !== req.body.products.length) {
        req.body.products = req.body.products.filter((x) => {
            return x !== null || undefined;
        })
    };
    const productsReales = req.body.products.map((p, index) => ({
        product: {
            _id: p.product,
            name: arrOfProducts[index].name,
            price: arrOfProducts[index].price
        },
        qty: p.qty
    }));

    newOrder.products = productsReales;
    const orderStored = await newOrder.save();
    return resp.send(orderStored)
};

module.exports.putOrders = async(req, resp, next) => {
    try {
        if (!req.body.userId && !req.body.client && !req.body.products && !req.body.status) {
            return next(400);
        }
        let obj;
        if (req.body.products) {
            const arrOfProducts = await products.find({ _id: { $in: req.body.products.map(p => mongodb.ObjectId(p.product)) } })
            obj = req.body.products.map((p, index) => {
                return {
                    product: {
                        _id: p.product,
                        name: arrOfProducts[index].name,
                        price: arrOfProducts[index].price
                    },
                    qty: p.qty
                }
            });
        }
        const orderFindOne = await order.findOne({ _id: req.params.orderid });
        if (!orderFindOne) return next(404)
        const item = {
            status: req.body.status || orderFindOne.status,
            userId: req.body.userId || orderFindOne.userId,
            client: req.body.client || orderFindOne.client,
            products: obj || orderFindOne.products
        };

        if (req.body.status === 'delivered') {
            item.dateProcessed = Date.now();
          }

          const orderSaved = await order.findOneAndUpdate({ _id: req.params.orderid }, { $set: item }, { runValidators: true, new: true }) //,(err,order)=>{
            if (orderSaved.status === 'canceled' || !orderSaved) {
                return next(404);
            };
            resp.send(orderSaved);
        }catch (e) {
        if (e.kind === 'enum' || !e.kind) {
            return next(400);
        }
        return next(404);
    }

}


module.exports.deleteOrders = async (req, resp, next) => {
   try {
    await order.findByIdAndRemove(req.params.orderid)
    return resp.send({ message: 'Se borro satisfactoriamente!' });
   }
   catch(e) {
    return next(404)
   }
}