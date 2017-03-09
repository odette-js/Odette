var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    srcMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    browserify = require('gulp-browserify'),
    copy = require('gulp-copy'),
    path = require('path'),
    fs = require('fs'),
    gutil = require('gulp-util'),
    through = require('through2'),
    _ = require('lodash'),
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
// function browserify() {
//     'use strict';
//     var watchify = require('watchify');
//     var browserify = require('browserify');
//     var gulp = require('gulp');
//     var source = require('vinyl-source-stream');
//     var buffer = require('vinyl-buffer');
//     var gutil = require('gulp-util');
//     var sourcemaps = require('gulp-sourcemaps');
//     var assign = require('lodash.assign');
//     // add custom browserify options here
//     var customOpts = {
//         entries: ['./src/index.js'],
//         debug: true
//     };
//     var opts = _.assign({}, watchify.args, customOpts);
//     var b = watchify(browserify(opts));
//     // add transformations here
//     // i.e. b.transform(coffeeify);
//     gulp.task('js', bundle); // so you can run `gulp js` to build the file
//     b.on('update', bundle); // on any dep update, runs the bundler
//     b.on('log', gutil.log); // output build logs to terminal
//     function bundle() {
//         return b.bundle()
//             // log errors if they happen
//             .on('error', gutil.log.bind(gutil, 'Browserify Error')).pipe(source('bundle.js'))
//             // optional, remove if you don't need to buffer file contents
//             .pipe(buffer())
//             // optional, remove if you dont want sourcemaps
//             .pipe(sourcemaps.init({
//                 loadMaps: true
//             })) // loads map from browserify file
//             // Add transformation tasks to the pipeline here.
//             .pipe(sourcemaps.write('./')) // writes .map file
//             .pipe(gulp.dest('./dist'));
//     }
// }
// function browserify() {
//     return through.obj(function (file, encoding, cb) {
//         // console.log(JSON.stringify(file));
//         var browserify = require('browserify');
//         var b = browserify(file._contents.data);
//         file.contents = file.pipe(b.bundle(cb));
//         this.push(file);
//         // .bundle(function (err, result) {
//         //     if (err) {
//         //         return cb(err);
//         //     }
//         //     // return cb(null, result);
//         //     cb(null, new gutil.File({
//         //         base: file.base,
//         //         cwd: file.cwd,
//         //         path: file.path,
//         //         contents: result
//         //     }));
//         // });
//     });
// }