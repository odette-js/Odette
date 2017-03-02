var isFunction = require('./is/function');
module.exports = function (obj, prop) {
    return obj && isFunction(obj.hasOwnProperty) ? obj.hasOwnProperty(prop) : false;
};