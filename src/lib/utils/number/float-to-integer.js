var isNotNan = require('./utils/is/not/nan');
module.exports = function (value) {
    var remainder = value % 1;
    return isNotNan(value) ? (remainder ? value - remainder : value) : 0;
};