var keys = require('./utils/keys');
var isNil = require('./utils/is/nil');
module.exports = function (map) {
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = new RegExp(source);
    var replaceRegexp = new RegExp(source, 'g');
    return function (string) {
        string = isNil(string) ? '' : '' + string;
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };

    function escaper(match) {
        return map[match];
    }
};