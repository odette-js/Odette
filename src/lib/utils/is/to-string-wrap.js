var createToStringResult = require('./utils/to/string-result');
var callObjectToString = require('./call-object-to-string');
var isStrictlyEqual('./strictly-equal');
module.exports = function (string_) {
    var string = createToStringResult(string_);
    return function (item) {
        return isStrictlyEqual(callObjectToString(item), string);
    };
};