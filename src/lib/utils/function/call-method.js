module.exports = function callMethod(isStr, method, context, argument) {
    return isStr ? obj[method](argument) : method.call(context, argument);
};