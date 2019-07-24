const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productsSubcollection = new Schema({
    qty: Number,
    product: Object,
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
        enum: ['pending', 'canceled', 'delivered'],
        default: 'pending'
    },
    dateEntry: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateProcessed: Date,
})
module.exports = mongoose.model('Orders', order);