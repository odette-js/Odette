module.exports = function (fn) {
    return function (nil, second) {
        return fn(second);
    };
};