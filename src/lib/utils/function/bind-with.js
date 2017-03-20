module.exports = function bindWith(func, args) {
    return func.bind.apply(func, args);
};