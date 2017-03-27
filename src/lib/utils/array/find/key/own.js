var baseEach = require('./utils/array/base/each'),
    iterateIn = require('./utils/iterate/own'),
    forEachEnd = require('./utils/array/base/for-each-end'),
    accessObjectKeyAfter = require('./utils/array/find/access-object-after'),
    secondToIterable = require('./utils/function/convert-second-to-iterable');
module.exports = secondToIterable(baseEach(iterateIn, forEachEnd, accessObjectKeyAfter));