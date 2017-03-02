var MAX_SAFE_INTEGER = 9007199254740991;
var MIN_SAFE_INTEGER = -MAX_SAFE_INTEGER;
var clamp = require('./number/clamp');
var toNumber = require('./number.js');
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