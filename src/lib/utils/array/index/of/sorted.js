var TWO_TO_THE_31 = 2147483647,
    indexOfNaN = require('./utils/array/index/of/nan'),
    lastIndex = require('./utils/array/index/last');
module.exports = function sortedIndexOf(list, item, minIndex_, maxIndex_, fromRight) {
    var guess, min = minIndex_ || 0,
        max = maxIndex_ || lastIndex(list),
        bitwise = (max <= TWO_TO_THE_31) ? true : false;
    if (item !== item) {
        // bitwise does not work for NaN
        return indexOfNaN(list, min, max, fromRight);
    }
    if (bitwise) {
        while (min <= max) {
            guess = (min + max) >> 1;
            if (list[guess] === item) {
                return guess;
            } else {
                if (list[guess] < item) {
                    min = guess + 1;
                } else {
                    max = guess - 1;
                }
            }
        }
    } else {
        while (min <= max) {
            guess = (min + max) / 2 | 0;
            if (list[guess] === item) {
                return guess;
            } else {
                if (list[guess] < item) {
                    min = guess + 1;
                } else {
                    max = guess - 1;
                }
            }
        }
    }
    return -1;
};