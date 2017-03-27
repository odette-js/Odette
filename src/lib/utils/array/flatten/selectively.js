var toFunction = require('./utils/to/function');
var flattens = require('./utils/array/flatten/worker');
var isArrayLike = require('./utils/is/array-like');
module.exports = flattenSelectively;

function flattenSelectively(list, filter) {
    return flattens(list, toFunction(filter), flattenSelectively);
}