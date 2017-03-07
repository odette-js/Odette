var isGreaterThan = require('./utils/is/greater-than');
var sort = require('./utils/array/sort');
var get = require('./utils/object/get');
// arg1 is usually a string or number
module.exports = function (list, arg1, handler_, reversed) {
    var handler = handler_ || get;
    return sort(list, function (a, b) {
        return isGreaterThan(handler(a, arg1), handler(b, arg1));
    }, reversed);
};