var isArrayLike = require('./is/array-like');
module.exports = function (iterates, forEach) {
    return function (obj_, iteratee_) {
        var obj = obj_,
            iteratee = iteratee_;
        if (!obj) {
            return obj;
        }
        if (!isArrayLike(obj)) {
            iteratee = iterates(obj, iteratee);
            obj = iteratee.keys;
        }
        return forEach(obj, iteratee);
    };
};