var gulp = require('gulp'),
    nib = require('nib'),
    plumber = require('gulp-plumber'),
    srcMaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    stylus = require('gulp-stylus');
module.exports = function (settings, paths) {
    return function () {
        return gulp.src(paths.stylus).pipe(plumber()).pipe(srcMaps.init()).pipe(stylus({
            use: [nib()],
            comments: true
        })).pipe(autoprefixer({
            browsers: ['> 0.1%', 'IE 9']
        })).pipe(srcMaps.write('.')).pipe(gulp.dest(paths.css));
    };
};