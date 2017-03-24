var baseEach = require('./utils/array/base/each'),
    iterateIn = require('./utils/iterate/in'),
    findKeyRight = require('./utils/array/find/key/right'),
    accessObjectKeyAfter = require('./utils/array/find/access-object-key-after'),
    secondToIterable = require('./utils/function/convert-second-to-iterable');
module.exports = secondToIterable(baseEach(iterateIn, findKeyRight, accessObjectKeyAfter));