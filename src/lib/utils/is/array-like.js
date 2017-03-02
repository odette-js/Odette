var castBoolean = require('./utils/cast-boolean');
var isArray = require('./array');
var isWindow = require('./window');
var isString = require('./string');
var isFunction = require('./function');
var isNumber = require('./number');
module.exports = function (collection) {
    var length;
    return isArray(collection) || (isWindow(collection) ? false : (isNumber(length = castBoolean(collection) && collection.length) && !isString(collection) && length >= 0 && length <= MAX_ARRAY_INDEX && !isFunction(collection)));
};