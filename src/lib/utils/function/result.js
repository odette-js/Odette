var isObject = require('./utils/is/object');
var isNil = require('./utils/is/nil');
var isFunction = require('./utils/is/function');
module.exports = function result(obj, str, arg) {
    return isNil(obj) ? obj : (isFunction(obj[str]) ? obj[str](arg) : (isObject(obj) ? obj[str] : obj));
};