const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productsSubcollection = new Schema({
    qty: Number,
    product: Object,
})

const order = new Schema({
    userId:
    {
        type: String,
        required: true,
    },
    client: {
        type: String,
        required: true,
    },
    products: [productsSubcollection],
    status: {
        type: String,
        //required: true,
        default: 'pending',
        enum: ['pending', 'canceled', 'delivered']
    },
    dateEntry: {
        type: Date,
        required: true,
        default: Date.now()
    },
    dateProcessed: Date,
    versionKey: false 
})
module.exports = mongoose.model('Orders', order);