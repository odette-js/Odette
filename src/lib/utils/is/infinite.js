var INFINITY = Infinity;
var NEGATIVE_INFINITY = -INFINITY;
var isStrictlyEqual = require('./utils/is/strictly-equal');
var isNotNan = require('./utils/is/not/nan');
var isNumber = require('./utils/is/number');
module.exports = function (value) {
    return isStrictlyEqual(value, INFINITY) || isStrictlyEqual(value, NEGATIVE_INFINITY);
};