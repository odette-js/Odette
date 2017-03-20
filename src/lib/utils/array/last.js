var lastIndex = require('./utils/array/index/last');
var nth = require('./utils/array/nth');
module.exports = function last(array) {
    return nth(array, lastIndex(array));
};