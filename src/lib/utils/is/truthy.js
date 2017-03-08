var isStrictlyEqual = require('./utils/is/strictly-equal');
var castBoolean = require('./utils/cast-boolean');
module.exports = function (item) {
    return isStrictlyEqual(castBoolean(item), true);
};