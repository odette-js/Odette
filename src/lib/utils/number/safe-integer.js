var clamp = require('./utils/number/clamp');
var MAX_SAFE_INTEGER = require('./utils/number/max-safe-integer');
var MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;
module.exports = function (number_) {
    return clamp(number_, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER);
};