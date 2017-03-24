var isArrayLike = require('./utils/is/array-like');
var returnsFirstArgument = require('./utils/returns/first');
module.exports = function baseForEach(iterates, forEach, result_) {
    var result = result_ || returnsFirstArgument;
    return function baseForEachIterator(obj_, iteratee_, three, four, five) {
        var wasArrayLike, obj = obj_,
            iteratee = iteratee_;
        if (!obj) {
            return;
        }
        if (!(wasArrayLike = isArrayLike(obj))) {
            iteratee = iterates(obj, iteratee);
            obj = iteratee.keys;
        }
        if (obj.length) {
            return result(forEach(obj, iteratee, three, four, five), obj_, obj, wasArrayLike);
        }
    };
};