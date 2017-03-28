var isNan = require('./utils/is/nan');
var forEachEndRight = require('./utils/array/base/for-each-end-right');
module.exports = function indexOfNaN(array, fromIndex_, toIndex_) {
    return forEachEndRight(array, isNan, fromIndex, toIndex, -1);
};