var baseForEach = require('./utils/array/base/for-each');
module.exports = function forEachRight(list, iterator) {
    return baseForEach(list, iterator, -1);
};