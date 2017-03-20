var isUndefined = require('./utils/is/undefined');
var castBoolean = require('./utils/boolean/cast');
module.exports = function toggle(current, which) {
    if (isUndefined(which)) {
        return !current;
    } else {
        return castBoolean(which);
    }
};