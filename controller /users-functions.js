module.exports.findByModels = (model, page, limitPage) => {
    return model.find().skip((page - 1) * limitPage).limit(limitPage).exec();
}