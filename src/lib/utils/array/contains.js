var isStrictlyEqual = require('./utils/is/strictly-equal');
var indexOf = require('./utils/array/index/of');
module.exports = function (list, item, start, end) {
    return isNotStrictlyEqual(indexOf(list, item, start, end));
};