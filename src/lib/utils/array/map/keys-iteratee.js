var objectSet = require('./utils/object/set');
module.exports = function (collection, bound) {
    return function (item, index, objs) {
        objectSet(collection, item, bound(item, key, objs));
    };
};