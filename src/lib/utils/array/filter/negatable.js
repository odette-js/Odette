var isArrayLike = require('./utils/is/array-like');
var isObject = require('./utils/is/object');
var toIterable = require('./utils/to/iterable');
module.exports = function negatableFilter(array, object, string) {
    return function negatableFilterReducer(reduction, negation) {
        return function negatableFilterIterator(thing, iteratee) {
            return (isArrayLike(thing) ? array : (isObject(thing) ? object : string))(thing, toIterable(iteratee), negation, reduction);
        };
    };
};