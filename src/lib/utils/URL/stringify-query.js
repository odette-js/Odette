var isObject = require('./utils/is/object');
var stringify = require('./utils/object/stringify');
module.exports = function (obj) {
    var val, n, base = obj.url,
        query = [];
    if (isObject(obj)) {
        forOwn(obj.query, function (val, n) {
            if (val !== undefined) {
                val = encodeURIComponent(stringify(val));
                query.push(n + '=' + val);
            }
        });
        if (query.length) {
            base += '?';
        }
        base += query.join('&');
        if (obj.hash) {
            obj.hash = isObject(obj.hash) ? encodeURI(stringify(obj.hash)) : hash;
            base += ('#' + obj.hash);
        }
    } else {
        base = obj;
    }
    return base;
};