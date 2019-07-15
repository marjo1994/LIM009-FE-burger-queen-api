const mongoose = require('mongoose')
const Schema = mongoose.Schema; //se define un modelo de objetos que pueden ser reutilizados
//para otras collections es recomendable hacerlo en otra hoja

const users = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: Object,
        required: true,
        default: { admin: false }
    },
    versionKey: false
});



//cantidad: Object, qty: Number, product: Object 


//PARA convertir usar => const Blog = mongoose.model('Blog', blogSchema);
module.exports =  mongoose.model('Users', users)

