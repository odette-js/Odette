module.exports = function fromToEnd(values, callback, _start, _end, _step) {
    var limit, counter, value, step = _step || 1,
        end = _end,
        start = _start,
        goingDown = step < 0,
        index = start;
    if (goingDown ? start < end : start > end) {
        return;
    }
    limit = ((goingDown ? start - end : end - start)) / Math.abs(step || 1);
    for (counter = 0; index >= 0 && counter <= limit; counter++) {
        if (callback(values[index], index, values)) {
            return index;
        }
        index += step;
    }
    return -1;
};