module.exports.uidOrEmail = (param) => {
    let obj = new Object();
    if (param.indexOf('@') < 0) {
        obj._id = param;
    } else {
        obj.email = param;
    }
    return obj
}