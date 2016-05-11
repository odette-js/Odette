var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    srcMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    copy = require('gulp-copy'),
    path = require('path'),
    browserify = require('gulp-browserify');
module.exports = function (settings, paths) {
    return function () {
        gulp.src(paths.jsSetup).pipe(plumber())
        // .pipe(srcMaps.init())
        .pipe(concat(paths.jsOdetteOutput)).pipe(gulp.dest(paths.jspublic))
        // .pipe(gulp.src(paths.jsOdetteOutput))
        .pipe(uglify()).pipe(rename("odette.min.js"))
        // .pipe(srcMaps.write('.'))
        .pipe(gulp.dest(paths.jspublic));
        gulp.src(paths.jsApplication).pipe(plumber())
        // .pipe(srcMaps.init())
        .pipe(concat(paths.jsApplicationOutput)).pipe(gulp.dest(paths.jspublic))
        // .pipe(gulp.src(paths.jsApplicationOutput))
        .pipe(uglify()).pipe(rename("application.min.js"))
        // .pipe(srcMaps.write('.'))
        .pipe(gulp.dest(paths.jspublic));
        gulp.src(paths.jsList).pipe(plumber())
        // .pipe(srcMaps.init())
        .pipe(concat(paths.jsOutput)).pipe(gulp.dest(paths.jspublic))
        // .pipe(gulp.src(paths.jsOutput))
        .pipe(uglify()).pipe(rename("library.min.js"))
        // .pipe(srcMaps.write('.'))
        .pipe(gulp.dest(paths.jspublic));
        gulp.src(paths.jsTestList).pipe(plumber())
        // .pipe(srcMaps.init())
        .pipe(concat(paths.jsTestOutput))
        // .pipe(srcMaps.write('.'))
        .pipe(gulp.dest(paths.jsTestsPublic));
        gulp.src(paths.jsExtra).pipe(plumber())
        // .pipe(srcMaps.init())
        .pipe(concat(paths.jsExtraOutput))
        // .pipe(srcMaps.write('.'))
        .pipe(gulp.dest(paths.jspublic));
        gulp.src(paths.jsFramed).pipe(plumber())
        // .pipe(srcMaps.init())
        .pipe(concat(paths.jsFramedOutput))
        // .pipe(srcMaps.write('.'))
        .pipe(gulp.dest(paths.jspublic));
    };
};