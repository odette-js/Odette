var toArray = require('./to/array');
var possibleArrayIndex = require('./possible-index');
module.exports = function (array, start, end) {
    return toArray(array).slice(possibleArrayIndex(start), possibleArrayIndex(end));
};