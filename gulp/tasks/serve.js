var path = require('path');
var gulp = require('gulp');
module.exports = function (settings, paths) {
    gulp.task('serve', ['altserver'], function () {
        return require(path.join(process.cwd(), 'index.js'))(settings.http.port);
    });
};