module.exports = sortedIndexOf;
var TWO_TO_THE_31 = 2147483647,
    indexOfNaN = require('./utils/array/index/of/nan'),
    lastIndex = require('./utils/array/index/last');

function sortedIndexOf(list, item, minIndex_, maxIndex_) {
    var guess, min = minIndex_ || 0,
        max = maxIndex_ || lastIndex(list),
        bitwise = (max <= TWO_TO_THE_31) ? true : false;
    if (item !== item) {
        return indexOfNaN(list, min, max);
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