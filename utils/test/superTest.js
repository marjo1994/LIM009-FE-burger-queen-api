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
module.exports.postWithToken = async(body, token, path) => {
    return await request.post(path)
        .send(body)
        .set('Authorization', `bearer ${token}`)
}
module.exports.getWithToken = async(token, path) => {
    return await request.get(path)
        .set('Authorization', `bearer ${token}`)
}
module.exports.deleteWithToken = async(token, path) => {
    return await request.delete(path)
        .set('Authorization', `bearer ${token}`)
}
module.exports.putWithToken = async(body, token, path) => {
    return await request.put(path)
        .send(body)
        .set('Authorization', `bearer ${token}`)
}
module.exports.responseOfpost = async(email, password, object, path) => {
    return await gettingToken(email, password)
        .then(resp => {
            return postWithToken(object, resp.body.token, path)
        }).then((result) => {
            return result;
        })
}