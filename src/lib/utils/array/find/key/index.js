var secondToIterable = require('./utils/function/convert-second-to-iterable');
var valueCheck = require('./utils/array/base/for-each-value-check');
var iterable = secondToIterable(require('./utils/array/base/for-each-end'));
module.exports = function (a, b) {
    return valueCheck(iterable(a, b));
};