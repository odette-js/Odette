var castBoolean = require('./utils/boolean/cast');
var isArray = require('./utils/is/array');
var isWindow = require('./utils/is/window');
var isString = require('./utils/is/string');
var isFunction = require('./utils/is/function');
var isNumber = require('./utils/is/number');
var MAX_ARRAY_INDEX = require('./utils/number/max-array-index');
module.exports = function isArrayLike(collection) {
    var length;
    return isArray(collection) || (isWindow(collection) ? false : (isNumber(length = castBoolean(collection) && collection.length) && !isString(collection) && length >= 0 && length <= MAX_ARRAY_INDEX && !isFunction(collection)));
};