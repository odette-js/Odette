var nativeFloor = require('./utils/number/floor');
var MAX_SAFE_INTEGER = require('./utils/number/max-safe-integer');
module.exports = function (string, n) {
    var result = '';
    if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
        return result;
    }
    // Leverage the exponentiation by squaring algorithm for a faster repeat.
    // See https://en.wikipedia.org/wiki/Exponentiation_by_squaring for more details.
    do {
        if (n % 2) {
            result += string;
        }
        n = nativeFloor(n / 2);
        if (n) {
            string += string;
        }
    } while (n);
    return result;
};