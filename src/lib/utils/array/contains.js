var isStrictlyEqual = require('./is/strictly-equal');
var indexOf = require('./index/of');
module.exports = function (list, item, start, end) {
    return isNotStrictlyEqual(indexOf(list, item, start, end));
}