var clamp = require('./utils/number/clamp');
var whilst = require('./utils/function/whilst');
module.exports = function (array, size) {
    var length, nu = [];
    if (!array || !(length = array.length)) {
        return nu;
    }
    var final = whilst(function (count) {
        return length > count;
    }, function (count) {
        var upperLimit = clamp(count + size, 0, length);
        nu.push(array.slice(count, upperLimit));
        return upperLimit;
    }, 0);
    return nu;
};