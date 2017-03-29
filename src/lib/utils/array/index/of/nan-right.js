var isNan = require('./utils/is/nan');
var forEachEndRight = require('./utils/array/base/for-each-end-right');
module.exports = indexOfNaN;

function indexOfNaN(array, fromIndex, toIndex) {
    return forEachEndRight(array, isNan, fromIndex, toIndex);
}