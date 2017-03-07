var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (item) {
    return isStrictlyEqual(item, true);
};