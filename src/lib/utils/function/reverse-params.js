module.exports = function (iteratorFn) {
    return function (value, key, third) {
        return iteratorFn(key, value, third);
    };
};