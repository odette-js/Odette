var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (list, item, index) {
    return isStrictlyEqual(list[index || 0], item);
};