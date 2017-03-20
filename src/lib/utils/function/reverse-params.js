module.exports = function reverseParameters(iteratorFn) {
    return function reversesParameters(value, key, third) {
        return iteratorFn(key, value, third);
    };
};