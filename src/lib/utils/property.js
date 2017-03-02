module.exports = function (string) {
    return function (object) {
        return object[string];
    };
};