var gulp = require('gulp');
module.exports = function (settings, paths) {
    return function () {
        return gulp.src(paths.img).pipe(gulp.dest(paths.publicImg));
    };
};