var baseForEachEnd = require('./utils/array/base/for-each-end');
var lastIndex = require('./utils/array/index/last');
var isNil = require('./utils/is/nil');
var valueCheck = require('./utils/array/base/for-each-value-check');
module.exports = function baseForEachEndRight(list, callback, start, end) {
    return baseForEachEnd(list, callback, isNil(start) ? lastIndex(list) : start, isNil(end) ? 0 : end, -1);
};