var gulp = require('gulp'),
    open = require('gulp-open');
module.exports = function (settings, files) {
    return function () {
        return gulp.src(__filename).pipe(open({
            uri: 'http://localhost:' + settings.http.port + '/'
        }));
    };
};