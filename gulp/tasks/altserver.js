var gulp = require('gulp');
var path = require('path');
var pathtosettings = path.join(process.cwd(), './settings');
var settings = require(pathtosettings);
var argv = require('optimist').argv;
module.exports = function (settings, paths) {
    return function () {
        return require(process.cwd())(settings.http.altport);
    };
};