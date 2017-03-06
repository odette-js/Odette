var lastIndex = require('./utils/array/index/last');
var baseFromToEnd = require('./utils/array/base/from-to-end');
var isUndefined = require('./utils/is/undefined');
module.exports = function (list, iterator, start, stop, step) {
    var greaterThanZero, last;
    return baseFromToEnd(list, iterator, isUndefined(start) ? 0 : start, isUndefined(stop) ? lastIndex(list) : stop, step || 1);
};