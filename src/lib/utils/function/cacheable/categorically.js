var cacheable = require('./utils/function/cacheable');
module.exports = function categoricallyCachable(fn, baseCategory) {
    var cache = {};
    return function categoricallyCachableInstance(string, category_) {
        var cacher;
        var category = category_ || baseCategory;
        cacher = cache[category] = cache[category] || cacheable(fn(category));
        return cacher(string);
    };
};