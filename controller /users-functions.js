module.exports.paginationAndFind = (model, req, resp, next) => {
    let limitPage = parseInt(req.query.limit) || 10;
    let page = parseInt(req.query.page) || 1;
    let protocolo = `${req.protocol}://${req.get('host')}${req.path}`;
    model.find().count((err, number) => {
        if (err) console.log(err)
        resp.set('link', pagination(protocolo, page, limitPage, number))
    })
    model.find().skip((page - 1) * limitPage).limit(limitPage).exec((err, result) => {
        if (err) {
            return next(400)
        } else {
            resp.send(result)
        }
    });
}