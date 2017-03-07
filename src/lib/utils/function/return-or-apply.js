var isFunction = require('./utils/is/function');
module.exports = function (obj_or_fn, context, args) {
    return isFunction(obj_or_fn) ? obj_or_fn.apply(context, args) : obj_or_fn;
};