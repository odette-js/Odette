var filter = require('./utils/array/filter');
var isValue = require('./utils/is/value');
module.exports = function (list) {
    return filter(list, isValue);
};