const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productsSubcollection = new Schema({
    qty: Number,
    product: String,
})

const order = new Schema({
    userId: {
        type: String,
    },
    client: {
        type: String,
    },
    products: [productsSubcollection],
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'canceled', 'delivered']
    },
    dateEntry: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateProcessed: Date,
})
module.exports = mongoose.model('Orders', order);