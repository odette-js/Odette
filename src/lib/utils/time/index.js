var forEach = require('./utils/array/for/each');
var toArray = require('./utils/to/array');
var customUnits = require('./utils/string/units/custom');
var cacheable = require('./utils/function/cacheable');
var TIME_CONSTANTS = require('./utils/time/constants');
var reduce = require('./utils/array/reduce');
var toNumber = require('./utils/to/number');
var timeUnits = [];
var timeUnitToNumber = reduce(TIME_CONSTANTS, function (memo, number, unit) {
    timeUnits.push(unit);
    memo[unit] = function (input) {
        return input * number;
    };
}, {});
module.exports = cacheable(function (number_) {
    var time = 0;
    forEach(toArray(number_ + ''), function (num_) {
        var num = num_,
            unit = customUnits(num, timeUnits),
            number = toNumber(num.split(unit || '').join('')),
            handler = timeUnitToNumber[unit];
        // there's a handler for this unit, adn it's not NaN
        if (number === number) {
            if (handler) {
                number = handler(number);
            }
            time += number;
        }
    });
    return time;
});