module.exports = function (settings, paths) {
    var path = require('path');
    var gulp = require('gulp');
    return function () {
        settings.prebrowsers = require(path.join(paths.gulpdir, './gulp/browsers-ie.js'))();
        gulp.start('stack');
    };
};