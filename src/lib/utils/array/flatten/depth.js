var defaultTo1 = require('./utils/default-to/1');
var flattens = require('./utils/array/flatten/worker');
var isArrayLike = require('./utils/is/array-like');
module.exports = flattenDepth;

function flattenDepth(list, depth_) {
    var depth = defaultTo1(depth_);
    return flattens(list, isArrayLike, function (item) {
        var result;
        if (--depth) {
            result = flattenDepth(item, depth);
        }
        ++depth;
        return result;
    });
};