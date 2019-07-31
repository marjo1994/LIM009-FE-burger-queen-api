const JWT = require('jsonwebtoken');
const { secret } = require('../config');

const header = {
    "alg": "HS256",
};

const payload = {
    "userid": "john.doe"
};

const token = JWT.sign({ email: 'admin@localhost' }, secret);

const output = { "token": token };
const decode = JWT.decode(token, secret)
console.log(output)
console.log(decode)