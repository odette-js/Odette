module.exports = function (func, context) {
    return context ? func.bind(context) : func;
};