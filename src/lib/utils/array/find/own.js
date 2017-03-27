var accessObjectAfter = require('./utils/array/find/access-object-after'),
    baseEach = require('./utils/array/base/each'),
    iterateOwn = require('./utils/iterate/own'),
    forEachEnd = require('./utils/array/base/for-each-end'),
    secondToIterable = require('./utils/function/convert-second-to-iterable');
module.exports = secondToIterable(baseEach(iterateOwn, forEachEnd, accessObjectAfter));