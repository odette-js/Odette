var isNil = require('./utils/is/nil');
var baseToString = require('./utils/to/base/string');
module.exports = function (value) {
    return isNil(value) ? '' : baseToString(value);
};