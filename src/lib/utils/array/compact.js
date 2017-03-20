var filter = require('./utils/array/filter');
var isValue = require('./utils/is/value');
module.exports = function compact(list) {
    return filter(list, isValue);
};