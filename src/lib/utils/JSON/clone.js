var parse = require('./parse');
var stringify = require('./stringify');
module.exports = function (item) {
    return parse(stringify(item));
};