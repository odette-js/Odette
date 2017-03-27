var toArray = require('./utils/to/array');
var flattens = require('./utils/array/flatten/worker');
var isArrayLike = require('./utils/is/array-like');
module.exports = function flatten(list) {
    return flattens(list, isArrayLike, toArray);
};