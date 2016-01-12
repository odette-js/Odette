// var gulp = require('gulp'),
//     plumber = require('gulp-plumber'),
//     srcMaps = require('gulp-sourcemaps'),
//     concat = require('gulp-concat'),
//     browserify = require('gulp-browserify');
// module.exports = function (settings, paths) {
//     return function () {
//         gulp.src(paths.jsTestList).pipe(plumber()).pipe(srcMaps.init()).pipe(concat(paths.jsTestOutput)).pipe(srcMaps.write('.')).pipe(gulp.dest(paths.jspublic));
//     };
// };