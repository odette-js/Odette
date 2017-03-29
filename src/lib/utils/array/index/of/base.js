module.exports = baseIndexOf;
var indexOfNaN = require('./utils/array/index/of/nan'),
    isNan = require('./utils/is/nan'),
    isStrictlyEqual = require('./utils/is/strictly-equal');

function baseIndexOf(checkFullArray, exposure_, filter_, alternative_) {
    var filter = filter_ || isNan,
        alternative = alternative_ || indexOfNaN,
        exposure = exposure_ || isStrictlyEqual;
    return function (array, value, fromIndex, toIndex, fromRight) {
        var index, limit, incrementor;
        if (!array) {
            return -1;
        } else if (filter(value)) {
            return alternative(array, fromIndex, toIndex);
        } else {
            return checkFullArray(array, comparator, fromIndex, toIndex);
        }

        function comparator(item) {
            return exposure(value, item);
        }
    };
}