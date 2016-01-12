var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');
module.exports = function (settings, paths) {
    return function () {
        nodemon({
            script: paths.serverIndex,
            ignore: paths.ignoreFiles
        });
    };
};