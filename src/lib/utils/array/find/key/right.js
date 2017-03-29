var secondToIterable = require('./utils/function/convert-second-to-iterable'),
    forEachEndRight = require('./utils/array/base/for-each-end-right'),
    valueCheck = require('./utils/array/base/for-each-value-check'),
    iterable = secondToIterable(forEachEndRight);
module.exports = function (a, b) {
    return valueCheck(iterable(a, b));
};