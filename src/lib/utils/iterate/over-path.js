var lastIs = require('./utils/array/last-is');
var toPath = require('./utils/to/path');
var isArray = require('./utils/is/array');
var dropRight = require('./utils/array/drop-right');
var find = require('./utils/array/find');
module.exports = function (path, fn, object) {
    var list = path;
    if (!isArray(list)) {
        list = toPath(path);
        // check for extra empty string
        list = lastIs(path, ']') ? dropRight(list) : list;
    }
    return find(list, fn);
};