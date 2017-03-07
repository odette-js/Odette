var withinRange = require('./utils/number/within-range');
var MAX_INTEGER = require('./utils/number/max-integer');
module.exports = function isValidInteger(number) {
    return withinRange(number, -MAX_INTEGER, MAX_INTEGER);
};