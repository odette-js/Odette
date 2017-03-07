var isArrayLike = require('./utils/is/array-like');
module.exports = function (iterates, forEachEnd) {
    return function (obj_, iteratee_) {
        var obj = obj_,
            iteratee = iteratee_;
        if (!obj) {
            return;
        }
        if (!isArrayLike(obj)) {
            iteratee = iterates(obj, iteratee);
            obj = iteratee.keys;
        }
        return forEachEnd(obj, iteratee);
    };
};