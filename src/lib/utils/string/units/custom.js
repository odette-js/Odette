var toArray = require('./utils/to/array');
var categoricallyCacheable = require('./utils/function/cacheable/categorically');
module.exports = categoricallyCacheable(function (unitList_) {
    var lengthHash = {},
        hash = {},
        lengths = [],
        unitList = toArray(unitList_),
        sortedUnitList = unitList.sort(function (a, b) {
            var aLength = a.length,
                bLength = b.length,
                value = Math.max(-1, Math.min(1, aLength - bLength));
            hash[a] = hash[b] = true;
            if (!lengthHash[aLength]) {
                lengthHash[aLength] = true;
                lengths.push(aLength);
            }
            if (!lengthHash[bLength]) {
                lengthHash[bLength] = true;
                lengths.push(bLength);
            }
            return -1 * (value === 0 ? (a > b ? -1 : 1) : value);
        });
    lengths.sort(function (a, b) {
        return -1 * Math.max(-1, Math.min(1, a - b));
    });
    return function (str_) {
        var ch, unitStr, unit,
            i = 0,
            str = (str_ + '').trim(),
            length = str.length;
        while (lengths[i]) {
            if (lengths[i] < length) {
                unit = str.substr(length - lengths[i], length);
                if (hash[unit]) {
                    return unit;
                }
            }
            i++;
        }
        return false;
    };
});