var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (argument) {
    return isStrictlyEqual(argument, true) || isStrictlyEqual(argument, false);
};