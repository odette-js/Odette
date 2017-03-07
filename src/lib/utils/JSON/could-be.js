var isStrictlyEqual = require('./utils/is/strictly-equal');
var first = require('./utils/array/first');
var last = require('./utils/array/last');
module.exports = function (string) {
    var firstVal = first(string);
    var lastVal = last(string);
    return (isStrictlyEqual(firstVal, '{') && isStrictlyEqual(lastVal, '}')) || (isStrictlyEqual(firstVal, '[') && isStrictlyEqual(lastVal, ']'));
};