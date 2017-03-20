var isStrictlyEqual = require('./utils/is/strictly-equal');
var castBoolean = require('./utils/boolean/cast');
module.exports = function (item) {
    return isStrictlyEqual(castBoolean(item), false);
};