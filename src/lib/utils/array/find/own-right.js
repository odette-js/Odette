var secondToIterable = require('./utils/function/convert-second-to-iterable');
module.exports = secondToIterable(require('./utils/array/base/each')(require('./utils/iterate/own'), require('./utils/array/find/right')));