var MAX_INTEGER = require('./utils/number/max-integer');
var isStrictlyEqual = require('./utils/is/strictly-equal');
var toNumber = require('./utils/to/number');
var isInfinite = require('./utils/is/infinite');
module.exports = function (value) {
    var sign;
    if (!value) {
        return isStrictlyEqual(value, 0) ? value : 0;
    }
    value = toNumber(value);
    if (isInfinite(value)) {
        sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
    }
    return isNotNan(value) ? value : 0;
};