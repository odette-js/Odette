var isStrictlyEqual = require('./utils/is/strictly-equal');
var clamp = require('./utils/number/clamp');
module.exports = function (number, min, max) {
    return isNumber(number) && isStrictlyEqual(number, clamp(number, min, max));
};