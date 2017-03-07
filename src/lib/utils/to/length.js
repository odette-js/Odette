var toInteger = require('./utils/to/integer');
var clamp = require('./utils/number/clamp');
var MAX_ARRAY_LENGTH = 4294967295;
module.exports = function (number) {
    return number ? clamp(toInteger(number, true), 0, MAX_ARRAY_LENGTH) : 0;
};