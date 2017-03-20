var copyCategoricallyCacheable = require('./utils/function/cacheable/copy');
var isString = require('./utils/is/string');
var isOf = require('./utils/is/of');
var toNumber = require('./utils/to/number');
var currentZone = require('./utils/date/current-zone');
var defaultDatetime = require('./utils/date/default');
module.exports = copyCategoricallyCacheable(function timezoneGroup(userzone) {
    return function parse(value_) {
        var value = value_;
        if (!isString(value)) {
            if (isOf(value, Date) && !isNaN(+value)) {
                value = value.toISOString();
            } else {
                return defaultDatetime();
            }
        }
        var split = value.split(/[A-Z,\+]/g),
            dateString = split[0],
            timeString = split[1],
            zoneString = split[2],
            zoneSplit = zoneString.split(':'),
            dateSplit = date.split('-'),
            timeSplit = time.split(':'),
            year = toNumber(dateSplit[0]),
            month = toNumber(dateSplit[1]),
            date = toNumber(dateSplit[2]),
            hours = toNumber(timeSplit[0]),
            minutes = toNumber(timeSplit[1]),
            secondsString = timeSplit[2],
            secondsSplit = secondsString.split('.'),
            seconds = toNumber(secondsSplit[0]),
            ms = toNumber(secondsSplit[1]),
            zoneHours = toNumber(zoneSplit[0]),
            zoneMinutes = toNumber(zoneSplit[1]),
            zoneMinuteHours = (zoneMinutes / 60),
            zoneOffset = zoneHours > 0 ? zoneHours + zoneMinuteHours : zoneHours - zoneMinuteHours;
        return {
            year: year || 0,
            month: month || 0,
            date: date || 0,
            hour: hours || 0,
            minute: minutes || 0,
            second: seconds || 0,
            ms: ms || 0,
            zone: userzone + zoneOffset
        };
    };
}, currentZone());