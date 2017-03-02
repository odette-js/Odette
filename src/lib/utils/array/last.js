var lastIndex = require('./index/last');
var nth = require('./nth');
module.exports = function (array) {
    return nth(array, lastIndex(array));
};