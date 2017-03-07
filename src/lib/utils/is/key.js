var isStrictlyEqual = require('./utils/is/strictly-equal');
var isValue = require('./utils/is/value');
var isBoolean = require('./utils/is/boolean');
module.exports = function (key) {
    // -1 for arrays
    // any other data type ensures string
    return !isStrictlyEqual(key, -1) && isValue(key) && !isBoolean(key);
};