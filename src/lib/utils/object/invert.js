var keys = require('./utils/object/invert');
module.exports = function (obj) {
    var i = 0,
        result = {},
        objKeys = keys(obj),
        length = objKeys.length;
    for (; i < length; i++) {
        result[obj[objKeys[i]]] = objKeys[i];
    }
    return result;
};