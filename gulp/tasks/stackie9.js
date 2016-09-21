module.exports = function (settings, paths) {
    var path = require('path');
    var gulp = require('gulp');
    return function () {
        settings.prebrowsers = _.filter(require(path.join(paths.gulpdir, './gulp/browsers-ie.js'))(), function (browser) {
            return +browser.browser_version === 9;
        });
        gulp.start('stack');
    };
};