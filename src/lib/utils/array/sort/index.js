var isNan = require('./utils/is/nan');
var bindTo = require('./utils/function/bind-to');
var defaultSort = require('./utils/is/greater-than');
module.exports = function (obj, fn_, reversed) {
    var fn = bindTo(fn_ || defaultSort, obj);
    // normalize sort function handling for safari
    return obj.sort(function (a, b) {
        var result = fn(a, b);
        if (isNan(result)) {
            result = Infinity;
        }
        if (result === true) {
            result = 1;
        }
        if (result === false) {
            result = -1;
        }
        return reversed ? result * -1 : result;
    });
};