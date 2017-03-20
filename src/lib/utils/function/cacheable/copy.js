var stringify = require('./utils/JSON/stringify');
var parse = require('./utils/object/parse');
module.exports = function cacheableCopy(fn) {
    var cache = {};
    return function cacheableCopyInstance(string) {
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