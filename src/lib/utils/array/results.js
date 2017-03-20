var map = require('./utils/array/map');
var result = require('./utils/function/result');
module.exports = function results(array, method, arg) {
    return map(array, function resultCaller(item) {
        return result(item, method, arg);
    });
};