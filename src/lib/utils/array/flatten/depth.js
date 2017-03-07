var defaultTo1 = require('./utils/default-to/1');
var flattens = require('./utils/array/flatten/worker');
module.exports = function flattenDepth(list, depth_) {
    var depth = defaultTo1(depth_);
    return flattens(list, function (item) {
        var result;
        if (--depth) {
            result = flattenDepth(item, depth);
        }
        ++depth;
        return result;
    });
};