var isObject = require('./utils/is/object');
var isArrayLike = require('./utils/is/array-like');
module.exports = function (obj) {
    return !isObject(obj) || isArrayLike(obj) ? [] : {};
};