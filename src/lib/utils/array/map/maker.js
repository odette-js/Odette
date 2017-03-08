var isEmptyArray = require('./utils/is/empty-array');
var isString = require('./utils/is/string');
module.exports = function (iterator, iterable, returnBaseType) {
    return function (objs, iteratee) {
        var collection = returnBaseType(objs),
            iterates = isString(iteratee) ? whenString(iteratee) : iteratee;
        if (objs) {
            iterator(objs, iterable(collection, iterates, isEmptyArray(collection)));
        }
        return collection;
    };

    function whenString(iteratee) {
        return function (item) {
            return item[iteratee];
        };
    }
};