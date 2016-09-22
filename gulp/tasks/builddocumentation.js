var documentation = require('gulp-documentation'),
    gulp = require('gulp');
module.exports = function (settings, paths) {
    return function () {
        // gulp.src('./index.js')
        //   .pipe(documentation({ format: 'md' }))
        //   .pipe(gulp.dest('md-documentation'));
        return gulp.src(paths.jsOdette).pipe(documentation({
            format: 'html'
        })).pipe(gulp.dest(paths.documentationOutput));
        // gulp.src('./index.js')
        //   .pipe(documentation({ format: 'json' }))
        //   .pipe(gulp.dest('json-documentation'));
    };
};