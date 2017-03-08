var isStrictlyEqual = require('./utils/is/strictly-equal');
isBoolean.false = isBoolean.true = true;
module.exports = isBoolean;

function isBoolean(argument) {
    return isStrictlyEqual(argument, true) || isStrictlyEqual(argument, false);
}