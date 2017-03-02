var lastIs = require('./array/last-is');
var toPath = require('./to/path');
var isArray = require('./is/array');
var dropRight = require('./array/drop-right');
var find = require('./array/find');
module.exports = function (path, fn, object) {
    var list = path;
    if (!isArray(list)) {
        list = toPath(path);
        // check for extra empty string
        list = lastIs(path, ']') ? dropRight(list) : list;
    }
    return find(list, fn);
};