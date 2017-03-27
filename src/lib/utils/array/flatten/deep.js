var flattens = require('./utils/array/flatten/worker');
var isArrayLike = require('./utils/is/array-like');
module.exports = flattenDeep;

function flattenDeep(list) {
    return flattens(list, isArrayLike, flattenDeep);
};