var lastIndex = require('./utils/array/index/last');
var baseFromTo = require('./utils/array/base/from-to');
module.exports = function (list, iterator, step) {
    var greaterThanZero, last;
    return (!list || !iterator) ? [] : (last = lastIndex(list)) >= 0 ? baseFromTo(list, iterator, (greaterThanZero = step > 0) ? 0 : last, greaterThanZero ? last : 0, step) : [];
};