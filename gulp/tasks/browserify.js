var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    srcMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    copy = require('gulp-copy'),
    path = require('path'),
    _ = require('underscore'),
    q = require('q'),
    minName = function (filename) {
        var name = filename.split('.');
        name.splice(name.length - 1, 0, 'min');
        return name.join('.');
    };
module.exports = function (settings, paths, context, name) {
    gulp.task('odette-build', function () {
        return [q.Promise(function (success, failure) {
            gulp.src(paths.jsOdette) //
                .pipe(concat(paths.jsOdetteOutput)) //
                .pipe(gulp.dest(paths.jspublic)).on('end', success).on('error', failure);
        }), q.Promise(function (success, failure) {
            gulp.src(paths.jsApplication) //
                .pipe(concat(paths.jsApplicationOutput)) //
                .pipe(gulp.dest(paths.jspublic)).on('end', success).on('error', failure);
        })];
    });
    gulp.task('library-build', function () {
        return q.Promise(function (success, failure) {
            gulp.src(paths.jsLibraryList) //
                .pipe(concat(paths.jsLibraryOutput)) //
                .pipe(gulp.dest(paths.jspublic)).on('end', success).on('error', failure);
        });
    });
    gulp.task('full-build', function () {
        return q.Promise(function (success, failure) {
            gulp.src(paths.jsFull) //
                .pipe(concat(paths.jsFullOutput)) //
                .pipe(gulp.dest(paths.jspublic)).on('end', success).on('error', failure);
        });
    });
    gulp.task('spec-build', function () {
        return q.Promise(function (success, failure) {
            gulp.src(paths.jsTestList) //
                .pipe(concat(paths.jsTestOutput)) //
                .pipe(gulp.dest(paths.jsTestsPublic)).on('end', success).on('error', failure);
        });
    });
    gulp.task('public-framed', function () {
        return q.Promise(function (success, failure) {
            gulp.src(paths.jsFramed) //
                .pipe(concat(paths.jsFramedOutput)) //
                .pipe(gulp.dest(paths.jspublic)).on('end', success).on('error', failure);
        });
    });
    gulp.task('public-build', function () {
        return q.Promise(function (success, failure) {
            gulp.src(paths.publicized) //
                .pipe(require(path.join(process.cwd(), 'replace-root-url'))('./src/static', './dist/')) //
                .pipe(gulp.dest(paths.publicizedOutput)).on('end', success).on('error', failure);
        });
    });
    gulp.task(name, ['odette-build', 'library-build', 'full-build', 'spec-build', 'public-framed', 'public-build']);
};