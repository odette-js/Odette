var isNumber = require('./is/number');
module.exports = function (string_) {
    var converted, string = string_;
    if (isNumber(string)) {
        return string;
    } else {
        string += '';
        converted = +string;
        if (converted === converted) {
            return converted;
        } else {
            return string.split('.').length === 1;
        }
    }
};