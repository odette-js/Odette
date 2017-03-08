var isArray = require('./utils/is/array');
var isArrayLike = require('./utils/is/array-like');
var isString = require('./utils/is/string');
var COMMA = ',';
module.exports = function (object, delimiter) {
    return isArrayLike(object) ? (isArray(object) ? object : arrayLikeToArray(object)) : (isString(object) ? object.split(isString(delimiter) ? delimiter : COMMA) : [object]);
};

function arrayLikeToArray(arrayLike) {
    return arrayLike.length === 1 ? [arrayLike[0]] : Array.apply(null, arrayLike);
}