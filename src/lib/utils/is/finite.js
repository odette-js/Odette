var isNumber = require('./utils/is/number');
var isInfinite = require('./utils/is/infinite');
module.exports = function (value) {
    return isNumber(value) && !isInfinite(value);
};