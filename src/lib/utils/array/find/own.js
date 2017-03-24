var accessObjectAfter = require('./utils/array/find/access-object-after'),
    baseEach = require('./utils/array/base/each'),
    iterateOwn = require('./utils/iterate/own'),
    find = require('./utils/array/find'),
    secondToIterable = require('./utils/function/convert-second-to-iterable');
module.exports = secondToIterable(baseEach(iterateOwn, find, accessObjectAfter));