var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
var clamp = require('./utils/number/clamp');
module.exports = function (n) {
    return clamp(n, 0, MAX_ARRAY_INDEX);
};