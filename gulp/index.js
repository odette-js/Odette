var gulp = require('gulp'),
    fs = require('fs');
module.exports = function (tasks, args) {
    tasks.forEach(function (name) {
        var handler = require('./tasks/' + name).apply(null, args.concat([name]));
        if (!handler) {
            return;
        }
        gulp.task(name, handler);
    });
};