var MAX_SAFE_INTEGER = require('./utils/number/max-safe-integer');
var MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;
var clamp = require('./utils/number/clamp');
var toNumber = require('./utils/to/number');
module.exports = function (number, notSafe) {
    var converted;
    return floatToInteger((converted = toNumber(number)) == number ? (notSafe ? converted : safeInteger(converted)) : 0);
};

function floatToInteger(value) {
    var remainder = value % 1;
    return value === value ? (remainder ? value - remainder : value) : 0;
}

function safeInteger(number) {
    return clamp(number, MIN_SAFE_INTEGER, MAX_SAFE_INTEGER);
}