module.exports = function (func, args) {
    return func.bind.apply(func, args);
};