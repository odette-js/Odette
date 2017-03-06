var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    srcMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    copy = require('gulp-copy'),
    path = require('path'),
    minName = function (filename) {
        var name = filename.split('.');
        name.splice(name.length - 1, 0, 'min');
        return name.join('.');
    };
module.exports = function (settings, paths, context, name) {
    //'odette-build'
    // gulp.task(name, function () {
    return function () {
        var odette = new Promise(function (success, failure) {
            gulp.src(paths.jsOdette) //
                .pipe(browserify()) //
                .pipe(rename(paths.jsOdetteOutput)) //
                .pipe(gulp.dest(paths.jspublic)) //
                .on('end', success) //
                .on('error', failure);
        });
        var application = new Promise(function (success, failure) {
            gulp.src(paths.jsApplication) //
                .pipe(browserify()) //
                .pipe(rename(paths.jsApplicationOutput)) //
                .pipe(gulp.dest(paths.jspublic)) //
                .on('end', success) //
                .on('error', failure);
        });
        var library = new Promise(function (success, failure) {
            console.log(paths.jsLibraryList, paths.jsLibraryOutput, paths.jspublic);
            gulp.src(paths.jsLibraryList) //
                .pipe(browserify()) //
                .pipe(rename(paths.jsLibraryOutput)) //
                .pipe(gulp.dest(paths.jspublic)) //
                .on('end', success) //
                .on('error', failure);
        });
        return Promise.all([odette, application, library]);
    };
    // , q.Promise(function (success, failure) {
    //     gulp.src(paths.jsApplication) //
    //         .pipe(browserify()) //
    //         .pipe(rename(paths.jsApplicationOutput)) //
    //         .pipe(gulp.dest(paths.jspublic)) //
    //         .on('end', success) //
    //         .on('error', failure);
    // })
    // });
    // , q.Promise(function (success, failure) {
    //             gulp.src(paths.jsApplication) //
    //                 .pipe(browserify()) //
    //                 .pipe(rename(paths.jsApplicationOutput)) //
    //                 .pipe(gulp.dest(paths.jspublic)) //
    //                 .on('end', success) //
    //                 .on('error', failure);
    //         })
    // gulp.task('library-build', function () {
    //     return q.Promise(function (success, failure) {
    //         gulp.src(paths.jsLibraryList) //
    //             .pipe(browserify()) //
    //             .pipe(rename(paths.jsLibraryOutput)) //
    //             .pipe(gulp.dest(paths.jspublic)) //
    //             .on('end', success) //
    //             .on('error', failure);
    //     });
    // });
    // gulp.task('full-build', function () {
    //     return q.Promise(function (success, failure) {
    //         gulp.src(paths.jsFull) //
    //             .pipe(browserify()) //
    //             .pipe(rename(paths.jsFullOutput)) //
    //             .pipe(gulp.dest(paths.jspublic)) //
    //             .on('end', success) //
    //             .on('error', failure);
    //     });
    // });
    // gulp.task('spec-build', function () {
    //     return q.Promise(function (success, failure) {
    //         gulp.src(paths.jsTestList) //
    //             .pipe(browserify()) //
    //             .pipe(rename(paths.jsTestOutput)) //
    //             .pipe(gulp.dest(paths.jsTestsPublic)) //
    //             .on('end', success) //
    //             .on('error', failure);
    //     });
    // });
    // gulp.task('public-framed', function () {
    //     return q.Promise(function (success, failure) {
    //         gulp.src(paths.jsFramed) //
    //             .pipe(browserify()) //
    //             .pipe(rename(paths.jsFramedOutput)) //
    //             .pipe(gulp.dest(paths.jspublic)) //
    //             .on('end', success) //
    //             .on('error', failure);
    //     });
    // });
    // gulp.task('public-build', function () {
    //     return q.Promise(function (success, failure) {
    //         gulp.src(paths.publicized) //
    //             .pipe(require(path.join(process.cwd(), 'replace-root-url'))('./src/static', './dist/')) //
    //             .pipe(gulp.dest(paths.publicizedOutput)) //
    //             .on('end', success) //
    //             .on('error', failure);
    //     });
    // });
    // gulp.task(name, ['odette-build', 'library-build', 'full-build', 'spec-build', 'public-framed', 'public-build']);
};