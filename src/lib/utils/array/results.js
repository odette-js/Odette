var map = require('./utils/array/map');
var result = require('./utils/function/result');
module.exports = function (array, method, arg) {
    return map(array, function (item) {
        return result(item, method, arg);
    });
};