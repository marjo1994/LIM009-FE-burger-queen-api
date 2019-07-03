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
const order = new Schema({ //el mismo para crear la orden
    userId: String,
    client: String,
    products: [{cantidad : Object, qty : Number, product : Object}],
    status: { 'pending': Boolean, 'canceled': Boolean, 'delivering': Boolean, 'delivered': Boolean },
    dateEntry = Date,
    dateProcessed = Date
})

//PARA convertir usar => const Blog = mongoose.model('Blog', blogSchema);
module.exports= mongoose.model('Recorde', order)
