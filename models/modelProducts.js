const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const products = new Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true
    },
    dateEntry: {
        type: Date,
        required: true,
        default: Date.now()
    },
    versionKey: false
});

module.exports = mongoose.model('Products', products);
