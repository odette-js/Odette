var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (string_) {
    var string = string_.toString(),
        split = string.split('{'),
        first = split[0],
        trimmed = first && first.trim();
    if (isStrictlyEqual(trimmed.slice(0, 8), 'function')) {
        string = split.shift();
        return (string = split.join('{')).slice(0, lastIndex(string));
    }
    return split.join('{');
};