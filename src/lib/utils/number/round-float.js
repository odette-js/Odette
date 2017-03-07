var isNumber = require('./utils/is/number');
module.exports = function (val, power_, base) {
    var mult, power = power_;
    if (!isNumber(power_)) {
        power = 1;
    }
    mult = Math.pow(base || 10, power);
    return (parseInt(mult * val, 10) / mult);
};