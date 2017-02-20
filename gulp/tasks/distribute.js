var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    _ = require('lodash'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minName = function (filename) {
        var name = filename.split('.');
        name[0] = name[0] + '-min';
        // name.splice(name.length - 1, 0, '-min');
        return name.join('.');
    };
module.exports = function (settings, paths) {
    return function () {
        // odette
        return Promise.all(_.map([
            [paths.jsOdetteNode, paths.jsOdetteNodeDistribute],
            [paths.jsOdette, paths.jsOdetteDistribute],
            [paths.jsApplication, paths.jsApplicationDistribute],
            [paths.jsLibraryList, paths.jsLibraryDistribute],
            [paths.jsFull, paths.jsFullOutputDistribute]
        ], function (set) {
            return new Promise(function (success, failure) {
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