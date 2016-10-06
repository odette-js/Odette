var through = require('through2');
var path = require('path');
var _ = require('lodash');
module.exports = function (coming_, going_, statics) {
    var cwd = process.cwd();
    var going = path.join(cwd, going_);
    var coming = path.join(cwd, coming_);
    var replace = function (file) {
        var full = path.join(file.base, file.relative);
        var rel = path.relative(full, coming).slice(1);
        var replacement = new RegExp(replacement || '__ROOT_URL__', 'gm');
        if (!file.contents) {
            return file;
        }
        var str = file.contents.toString();
        var replaced = _.reduce(statics, function (memo, value, key) {
            var regexp = new RegExp(key, 'gm');
            return memo.replace(regexp, value);
        }, str.replace(replacement, rel));
        file.contents = new Buffer(replaced);
        return file;
    };
    return through.obj(function (file, encoding, callback) {
        callback(null, replace(file));
    });
};