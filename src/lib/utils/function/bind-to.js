module.exports = function bindTo(func, context) {
    return context ? func.bind(context) : func;
};