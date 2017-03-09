var parse = require('./utils/JSON/parse');
var stringify = require('./utils/JSON/stringify');
module.exports = function (item) {
    return parse(stringify(item));
};