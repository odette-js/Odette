var toFunction = require('./utils/to/function');
var flattens = require('./utils/array/flatten/worker');
module.exports = function flattenSelectively(list, next) {
    return flattens(list, toFunction(next));
};