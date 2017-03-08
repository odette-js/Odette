var cacheable = require('./utils/function/cacheable');
module.exports = function (fn, baseCategory) {
    var cache = {};
    return function (string, category_) {
        var cacher;
        var category = category_ || baseCategory;
        cacher = cache[category] = cache[category] || cacheable(fn(category));
        return cacher(string);
    };
};