var isArrayLike = require('./utils/is/array-like');
var isObject = require('./utils/is/object');
module.exports = function (array, object, string) {
    return function (reduction, negation) {
        return function (thing, iteratee) {
            return (isArrayLike(thing) ? array : (isObject(thing) ? object : string))(thing, iteratee, negation, reduction);
        };
    };
};