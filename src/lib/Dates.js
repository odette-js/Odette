var userzone,
    updateTimezone = function (zone) {
        uzerzone = zone === UNDEFINED ? -(new Date().getTimezoneOffset() / 60) : zone;
    },
    uzerzoneFirstRun = updateTimezone(),
    defaultDatetime = function () {
        return {
            year: 0,
            month: 0,
            date: 0,
            hour: 0,
            minute: 0,
            second: 0,
            ms: 0,
            zone: 0
        };
    },
    parseDatetime = copyCategoricallyCacheable(function (userzone) {
        return function (value_) {
            var value = value_;
            if (!isString(value)) {
                if (value instanceof Date && !isNaN(+value)) {
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
                year = +dateSplit[0],
                month = +dateSplit[1],
                date = +dateSplit[2],
                hours = +timeSplit[0],
                minutes = +timeSplit[1],
                secondsString = timeSplit[2],
                secondsSplit = secondsString.split('.'),
                seconds = +secondsSplit[0],
                ms = +secondsSplit[1],
                zoneHours = +zoneSplit[0],
                zoneMinutes = +zoneSplit[1],
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
    }, userzone),
    datetime = function (value) {
        return parseDatetime(value, userzone);
    },
    isDatetime = function (value) {
        var dt = datetime(value);
        return dt.year && withinRange(dt.month, 1, 12) && withinRange(dt.date, 1, 31) && withinRange(dt.hour, 0, 23) && withinRange(dt.minute, 0, 59) && withinRange(dt.seconds, 0, 59) && withinRange(dt.ms, 0, 999) && withinRange(dt.zone, -24, 24);
    };
_.is.datetime = isDatetime;
_.publicize({
    isDatetime: isDatetime,
    datetime: datetime,
    parseDatetime: parseDatetime,
    updateTimezone: updateTimezone
});