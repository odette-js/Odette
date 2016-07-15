var gulp = require('gulp');
module.exports = function (settings, paths) {
    return function () {
        gulp.watch(paths.src, ['browserify', 'distribute']);
    };
};