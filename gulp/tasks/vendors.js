var gulp = require('gulp');
module.exports = function (settings, files) {
    return function () {
        return gulp.src(files.vendors).pipe(gulp.dest(files.vendorsPublic));
    };
};