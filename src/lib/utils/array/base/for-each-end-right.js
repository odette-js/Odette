var baseForEachEnd = require('./utils/array/base/for-each-end');
var lastIndex = require('./utils/array/index/last');
var isUndefined = require('./utils/is/undefined');
module.exports = function baseForEachEndRight(list, callback, start, end) {
    return baseForEachEnd(list, callback, isUndefined(start) ? lastIndex(list) : start, isUndefined(end) ? 0 : end, -1);
};