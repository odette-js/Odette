var gulp = require('gulp'),
    fs = require('fs');
module.exports = function (tasks, args) {
    tasks.forEach(function (name) {
        console.log(name);
        gulp.task(name, require('./tasks/' + name).apply(null, args));
    });
};