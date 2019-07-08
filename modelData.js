const mongoose = require('mongoose')
const Schema = mongoose.Schema; //se define un modelo de objetos que pueden ser reutilizados
//para otras collections es recomendable hacerlo en otra hoja

const product = new Schema ({
    name: String,
    price: Number,
    image: URL,
    type: String,
    dateEntry: Date
})

const user = new Schema ({
    id: String,
    email: Object,
    roles: {
    admin: Boolean
    }    
})

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
    username: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: Object,
        required: true
    }
});
const products = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        unique: true,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
    },
    type: {
        type: Object,
        required: true
    },
    dateEntry: {
        type: Date,
        required: true,
        default: Date.now
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

//PARA convertir usar => const Blog = mongoose.model('Blog', blogSchema);
<<<<<<< HEAD
module.exports= mongoose.model('Recorde', order)
module.exports= mongoose.model('products', product)
module.exports= mongoose.model('users', user)
=======
module.exports = mongoose.model('Users', users);
//modeule.exports= mongoose.model('Orders',order);

>>>>>>> 3a9b6cdf6601ea4b9911ad8b6a1ecd332894f3a8
