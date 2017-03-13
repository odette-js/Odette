var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (value) {
    return isStrictlyEqual(value, 0);
};