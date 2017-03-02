var isUndefined = require('./undefined');
var isNull = require('./null');
module.exports = function (value) {
    return isNull(value) || isUndefined(value);
};