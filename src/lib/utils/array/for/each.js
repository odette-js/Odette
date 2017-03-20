var baseForEach = require('./utils/array/base/for-each');
module.exports = function forEach(list, iterator) {
    return baseForEach(list, iterator, 1);
};