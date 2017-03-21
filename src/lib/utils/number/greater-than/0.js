var isGreaterThan = require('./utils/is/greater-than');
module.exports = function (number) {
    return isGreaterThan(number, 0);
};