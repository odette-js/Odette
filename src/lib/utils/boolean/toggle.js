var isUndefined = require('./utils/is/undefined');
var castBoolean = require('./utils/cast-boolean');
module.exports = function (current, which) {
    if (isUndefined(which)) {
        return !current;
    } else {
        return castBoolean(which);
    }
};