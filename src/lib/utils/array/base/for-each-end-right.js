var baseForEachEnd = require('./for-each-end');
var lastIndex = require('./access/last');
var isUndefined = require('./is/undefined');
module.exports = function (list, callback, start, end) {
    return baseForEachEnd(list, callback, isUndefined(start) ? lastIndex(list) : start, isUndefined(end) ? 0 : end, -1);
};