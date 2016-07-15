var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    //     srcMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    //     copy = require('gulp-copy'),
    //     path = require('path'),
    //     browserify = require('gulp-browserify'),
    minName = function (filename) {
        var name = filename.split('.');
        name.splice(name.length - 1, 0, 'min');
        return name.join('.');
    };
module.exports = function (settings, paths) {
    return function () {
        // odette
        gulp.src(paths.jsOdette).pipe(plumber()) //
        .pipe(concat(paths.jsOdetteDistribute)).pipe(gulp.dest(paths.jsDistributes)) //
        .pipe(uglify()).pipe(rename(minName(paths.jsOdetteDistribute))) //
        .pipe(gulp.dest(paths.jsDistributes));
        // application
        gulp.src(paths.jsApplication).pipe(plumber()) //
        .pipe(concat(paths.jsApplicationDistribute)).pipe(gulp.dest(paths.jsDistributes)) //
        .pipe(uglify()).pipe(rename(minName(paths.jsApplicationDistribute))) //
        .pipe(gulp.dest(paths.jsDistributes));
        // library
        gulp.src(paths.jsLibraryList).pipe(plumber()) //
        .pipe(concat(paths.jsLibraryDistribute)).pipe(gulp.dest(paths.jsDistributes)) //
        .pipe(uglify()).pipe(rename(minName(paths.jsLibraryDistribute))) //
        .pipe(gulp.dest(paths.jsDistributes));
    };
};