var lastIndex = require('./access/last');
var baseFromToEnd = require('./from-to-end');
var isUndefined = require('./is/undefined');
module.exports = function (list, iterator, start, stop, step) {
    var greaterThanZero, last;
    return baseFromToEnd(list, iterator, isUndefined(start) ? 0 : start, isUndefined(stop) ? lastIndex(list) : stop, step || 1);
};