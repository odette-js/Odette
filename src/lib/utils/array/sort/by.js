var isFunction = require('./utils/is/function');
var isGreaterThan = require('./utils/is/greater-than');
var sort = require('./utils/array/sort');
var get = require('./utils/object/get');
// arg1 is usually a string or number
module.exports = function sortBy(list, arg1_, handler_, reversed) {
    var arg1 = arg1_,
        handler = handler_ || get;
    if (isFunction(arg1)) {
        handler = arg1;
        arg1 = null;
    }
    return sort(list, function sortByDistillary(a, b) {
        return isGreaterThan(handler(a, arg1), handler(b, arg1));
    }, reversed);
};