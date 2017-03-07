var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (num) {
    return isStrictlyEqual(num, Math.round(num));
};