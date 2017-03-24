var accessor = require('./utils/array/find/accessor'),
    forEachEnd = require('./utils/array/base/for-each-end'),
    secondToIterable = require('./utils/function/convert-second-to-iterable');
module.exports = secondToIterable(accessor(forEachEnd));