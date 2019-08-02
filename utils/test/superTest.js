let request = require('supertest');
const express = require('express');
const app = express();

request = request('http://localhost:8888');

module.exports.gettingToken = async(email, password) => {
    return await request.post(`/auth`)
        .send({
            email: email,
            password: password,
        })
        .set('Accept', 'application/json')
        .then(resp => {
            return resp;
        });
}
module.exports.postWithToken = async(body, token, method) => {
    return await request.post(method)
        .send(body)
        .set('Authorization', `bearer ${token}`)
}
module.exports.getWithToken = async(token, method) => {
    return await request.get(method)
        .set('Authorization', `bearer ${token}`)
}