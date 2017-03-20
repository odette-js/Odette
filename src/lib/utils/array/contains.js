var isStrictlyEqual = require('./utils/is/strictly-equal');
var indexOf = require('./utils/array/index/of');
module.exports = function contains(list, item, start, end) {
    return !isStrictlyEqual(indexOf(list, item, start, end), -1);
};