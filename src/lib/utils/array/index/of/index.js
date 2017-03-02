var isNan = require('./is/nan');
var indexOfNan = require('./index-of/nan');
module.exports = function (array, value, fromIndex, toIndex, fromRight) {
    var index, limit, incrementor;
    if (!array) {
        return -1;
    }
    if (isNan(value)) {
        return indexOfNaN(array, fromIndex, toIndex, fromRight);
    }
    index = (fromIndex || 0) - 1;
    limit = toIndex || array[LENGTH];
    incrementor = fromRight ? -1 : 1;
    while ((index += incrementor) < limit) {
        if (array[index] === value) {
            return index;
        }
    }
    return -1;
};