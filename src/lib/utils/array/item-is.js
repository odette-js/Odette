var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function itemIs(list, item, index) {
    return isStrictlyEqual(list[index || 0], item);
};