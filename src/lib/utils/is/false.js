var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function isFalse(item) {
    return isStrictlyEqual(item, false);
};