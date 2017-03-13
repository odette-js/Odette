module.exports = (function () {
    var cache = {};
    return function (string) {
        var found = cache[string];
        if (!found) {
            cache[string] = found = new Function.constructor('return ' + string);
        }
        return found();
    };
}());