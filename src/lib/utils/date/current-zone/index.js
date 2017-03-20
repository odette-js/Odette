var date = require('./utils/date');
var isUndefined = require('./utils/is/undefined');
var current = -(date().getTimezoneOffset() / 60);
module.exports = function (zone) {
    current = isUndefined(zone) ? current : zone;
    return current;
};