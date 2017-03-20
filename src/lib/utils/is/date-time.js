var withinRange = require('./utils/number/within-range');
var datetime = require('./utils/date/current-zone/parse');
module.exports = function isDateTime(value) {
    var dt = datetime(value);
    return dt.year && withinRange(dt.month, 1, 12) && withinRange(dt.date, 1, 31) && withinRange(dt.hour, 0, 23) && withinRange(dt.minute, 0, 59) && withinRange(dt.seconds, 0, 59) && withinRange(dt.ms, 0, 999) && withinRange(dt.zone, -24, 24);
};