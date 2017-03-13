var parseUrl = require('./utils/URL/parse');
module.exports = function (object) {
    object.toString = function () {
        return object.href;
    };
    object.replace = function (newlocation) {
        var newparsed = parseUrl(newlocation);
        newparsed.previous = object;
        return newparsed;
    };
    return object;
};