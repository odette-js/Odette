var objectSet = require('./utils/object/set');
module.exports = function iterateKeys(collection, bound) {
    return function keysRunner(item, index, objs) {
        objectSet(collection, item, bound(item, index, objs));
    };
};