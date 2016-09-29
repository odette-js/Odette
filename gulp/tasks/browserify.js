var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require("gulp-rename"),
    srcMaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    copy = require('gulp-copy'),
    path = require('path'),
    // browserify = require('gulp-browserify'),
    minName = function (filename) {
        var name = filename.split('.');
        name.splice(name.length - 1, 0, 'min');
        return name.join('.');
    };
module.exports = function (settings, paths) {
    return function () {
        gulp.src(paths.jsOdette).pipe(plumber())
            // .pipe(srcMaps.init())
            .pipe(concat(paths.jsOdetteOutput)).pipe(gulp.dest(paths.jspublic))
            // .pipe(gulp.src(paths.jsOdetteOutput))
            .pipe(uglify()).pipe(rename(minName(paths.jsOdetteOutput)))
            // .pipe(srcMaps.write('.'))
            .pipe(gulp.dest(paths.jspublic));
        gulp.src(paths.jsApplication).pipe(plumber())
            // .pipe(srcMaps.init())
            .pipe(concat(paths.jsApplicationOutput)).pipe(gulp.dest(paths.jspublic))
            // .pipe(gulp.src(paths.jsApplicationOutput))
            .pipe(uglify()).pipe(rename(minName(paths.jsApplicationOutput)))
            // .pipe(srcMaps.write('.'))
            .pipe(gulp.dest(paths.jspublic));
        gulp.src(paths.jsLibraryList).pipe(plumber())
            // .pipe(srcMaps.init())
            .pipe(concat(paths.jsLibraryOutput)).pipe(gulp.dest(paths.jspublic))
            // .pipe(gulp.src(paths.jsOutput))
            .pipe(uglify()).pipe(rename(minName(paths.jsLibraryOutput)))
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
        gulp.src(paths.publicized).pipe(plumber()).pipe(gulp.dest(paths.publicizedOutput));
    };
};