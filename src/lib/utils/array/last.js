var lastIndex = require('./utils/array/index/last');
var nth = require('./utils/array/nth');
module.exports = function (array) {
    return nth(array, lastIndex(array));
};