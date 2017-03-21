module.exports = baseForEachEnd;
var baseFromToEnd = require('./utils/array/base/from-to-end');
var lastIndex = require('./utils/array/index/last');
var isNil = require('./utils/is/nil');

function baseForEachEnd(list, iterator, start, stop, step) {
    return baseFromToEnd(list, iterator, isNil(start) ? 0 : start, isNil(stop) ? lastIndex(list) : stop, step || 1);
}