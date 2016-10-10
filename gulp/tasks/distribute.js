var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    _ = require('lodash'),
    q = require('q'),
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
        return q.all(_.map([
            [paths.jsOdette, paths.jsOdetteDistribute],
            [paths.jsApplication, paths.jsApplicationDistribute],
            [paths.jsLibraryList, paths.jsLibraryDistribute]
        ], function (set) {
            return q.Promise(function (success, failure) {
                gulp.src(set[0]).pipe(plumber()) //
                    .pipe(concat(set[1])) //
                    .pipe(gulp.dest(paths.jsDistributes)) //
                    .pipe(uglify()).pipe(rename(minName(set[1]))) //
                    .pipe(gulp.dest(paths.jsDistributes)) //
                    .on('end', success) //
                    .on('error', failure);
            });
        }));
    };
};