var isStrictlyEqual = require('./utils/is/strictly-equal');
var clamp = require('./utils/number/clamp');
module.exports = function (number, min, max) {
    return isStrictlyEqual(number, clamp(number, min, max));
};