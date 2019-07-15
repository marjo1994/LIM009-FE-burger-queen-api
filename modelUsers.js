const mongoose = require('mongoose')
const Schema = mongoose.Schema; //se define un modelo de objetos que pueden ser reutilizados
//para otras collections es recomendable hacerlo en otra hoja

/* const register = new Schema({
    token: String,
    name: String,
    lastName: String,
    email: String,
}) */
/* const listOrders = new Schema({
    token: String,
    page: Number,
    orders: [
        userId = String,
        products = [{cantidad : Object, qty : Number, product : Object}],
        status = { 'pending': String, 'canceled': String, 'delivering': String, 'delivered': String },
        dateEntry = Date,
        dateProcessed = Date],
}) */
const users = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: Object,
        required: true,
        default: { admin: false }
    }
});


const order = new Schema({ //el mismo para crear la orden
    userId: String,
    client: String,
    products: [{ cantidad: Object, qty: Number, product: Object }],
    status: { type: String, enum: ['pending', 'canceled', 'delivered'] },
    dateEntry: Date,
    dateProcessed: Date
})

module.exports = mongoose.model('Users', users);
//modeule.exports= mongoose.model('Orders',order);

