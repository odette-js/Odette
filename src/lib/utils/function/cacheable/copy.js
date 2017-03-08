var stringify = require('./utils/stringify');
var parse = require('./utils/object/parse');
module.exports = function (fn) {
    var cache = {};
    return function (string) {
        var result, cached;
        if (!(cached = cache[string])) {
            result = fn(string);
            cached = cache[string] = stringify(result);
            return result;
        } else {
            return parse(cached);
        }
    };
};