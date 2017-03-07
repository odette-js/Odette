var mapValues = require('./utils/array/map/values');
var returnsFirst = require('./utils/returns/first');
module.exports = function (obj) {
    return mapValues(obj, returnsFirst);
};