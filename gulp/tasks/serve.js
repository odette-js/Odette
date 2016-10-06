var gulp = require('gulp');
module.exports = function (settings, paths) {
    gulp.task('serve', ['altserver'], function () {
        return require(process.cwd())(settings.http.port);
    });
};