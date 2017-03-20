module.exports = function indexOfNaN(array, fromIndex, toIndex, fromRight) {
    if (!array) {
        return -1;
    }
    var other, limit = toIndex || array.length,
        index = fromIndex + (fromRight ? 0 : -1),
        incrementor = fromRight ? -1 : 1;
    while ((index += incrementor) < limit) {
        other = array[index];
        if (other !== other) {
            return index;
        }
    }
    return -1;
};