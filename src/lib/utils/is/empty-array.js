var isStrictlyEqual = require('./utils/is/strictly-equal');
var lastIndex = require('./utils/array/index/last');
var isArray = require('./utils/is/array');
module.exports = function isEmptyArray(array) {
    return isArray(array) && isStrictlyEqual(lastIndex(array), -1);
};