var isStrictlyEqual = require('./strictly-equal');
var lastIndex = require('./utils/array/index/last');
module.exports = function (array) {
    return isStrictlyEqual(lastIndex(array), -1);
};