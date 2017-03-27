var baseEach = require('./utils/array/base/each'),
    iterateOwn = require('./utils/iterate/own'),
    forEachEndRight = require('./utils/array/base/for-each-end-right'),
    accessObjectKeyAfter = require('./utils/array/find/access-object-after'),
    secondToIterable = require('./utils/function/convert-second-to-iterable');
module.exports = secondToIterable(baseEach(iterateOwn, forEachEndRight, accessObjectKeyAfter));