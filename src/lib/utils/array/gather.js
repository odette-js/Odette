var concat = require('./utils/array/concat');
var map = require('./utils/array/map');
module.exports = function (list, handler) {
    return concat(map(list, handler));
};