var parseDatetime = require('./utils/date/parse');
var currentZone = require('./utils/date/current-zone');
module.exports = function (value) {
    return parseDatetime(value, currentZone());
};