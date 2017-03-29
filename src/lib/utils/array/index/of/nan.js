var isNan = require('./utils/is/nan');
var forEachEnd = require('./utils/array/base/for-each-end');
module.exports = function indexOfNaN(array, fromIndex, toIndex) {
    return forEachEnd(array, isNan, fromIndex, toIndex);
};