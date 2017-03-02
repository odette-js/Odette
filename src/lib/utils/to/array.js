var isArray = require('./is/array');
var isArrayLike = require('./is/array-like');
var isString = require('./is-string');
var COMMA = ',';
module.exports = function (object, delimiter) {
    return isArrayLike(object) ? (isArray(object) ? object : arrayLikeToArray(object)) : (isString(object) ? object.split(isString(delimiter) ? delimiter : COMMA) : [object]);
};

function arrayLikeToArray(arrayLike) {
    return arrayLike[LENGTH] === 1 ? [arrayLike[0]] : Array.apply(NULL, arrayLike);
}