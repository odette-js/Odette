var toNumber = require('./utils/to/number');
var date = require('./utils/date');
module.exports = function dateNumber() {
    return toNumber(date());
};