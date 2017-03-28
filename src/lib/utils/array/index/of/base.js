var isNan = require('./utils/is/nan');
module.exports = baseIndexOf;

function baseIndexOf(comparator, alternative) {
    return function (array, value, fromIndex, toIndex, fromRight) {
        var index, limit, incrementor;
        if (!array) {
            return -1;
        }
        if (isNan(value)) {
            return alternative(array, fromIndex, toIndex, fromRight);
        }
        index = (fromIndex || 0) - 1;
        limit = toIndex || array.length;
        incrementor = fromRight ? -1 : 1;
        while ((index += incrementor) < limit) {
            if (comparator(array[index], value)) {
                return index;
            }
        }
        return -1;
    };
}