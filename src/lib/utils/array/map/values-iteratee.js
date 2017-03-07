var addArray = require('./utils/array/push');
var objectSet = require('./utils/object/set');
module.exports = function (collection, bound, empty) {
    return empty ? function (item, index, objs) {
        arrayAdd(collection, bound(item, index, objs));
    } : function (item, key, objs) {
        objectSet(collection, bound(item, key, objs), key);
    };
};