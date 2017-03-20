module.exports = function negate(fn) {
    return function negateInstace() {
        return !fn.apply(this, arguments);
    };
};