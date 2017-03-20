var toArray = require('./utils/to/array');
var possibleArrayIndex = require('./utils/array/index/possible');
module.exports = function slice(array, start, end) {
    return toArray(array).slice(possibleArrayIndex(start), possibleArrayIndex(end));
};