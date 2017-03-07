var isFunction = require('./utils/is/function');
var isObject = require('./utils/is/object');
var JSONStringify = require('./utils/JSON/stringify');
module.exports = function (obj) {
    return (isObject(obj) ? JSONStringify(obj) : isFunction(obj) ? obj.toString() : obj) + '';
};