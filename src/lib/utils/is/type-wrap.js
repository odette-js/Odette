var type = require('./utils/type');
var lowerCaseString = require('./utils/string/lower-case');
module.exports = function (type_, fn_) {
    var ty = lowerCaseString(type_);
    var fn = fn_ || function () {
        return true;
    };
    return function (thing) {
        return type(thing) === ty && fn(thing);
    };
};