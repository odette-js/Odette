var lastIndex = require('./utils/array/index/last');
var baseFromTo = require('./utils/array/base/from-to');
module.exports = function baseForEach(list, iterator, step_) {
    var greaterThanZero, last, step;
    if (list && iterator) {
        step = step_ || 1;
        last = lastIndex(list);
        return baseFromTo(list, iterator, (greaterThanZero = step > 0) ? 0 : last, greaterThanZero ? last : 0, step);
    }
};