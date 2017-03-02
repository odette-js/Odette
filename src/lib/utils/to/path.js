var toString = require('./string');
var exp = /\]\.|\.|\[|\]/igm;
module.exports = function (string) {
    return toString(string).split(exp);
};