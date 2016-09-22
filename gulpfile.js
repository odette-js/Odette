var content = ['browserify', 'distribute'],
    server = ['serve', 'open'],
    stackTasks = ['stack', 'stackie', 'stackie9'],
    docsTasks = ['builddocumentation', 'watchdocs'],
    devTasks = content.concat(['watch'], server),
    // devTasks = allTasks.concat(content),
    gulp = require('gulp'),
    gulpTasker = require('./gulp'),
    path = require('path'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
    runSequence = require('run-sequence'),
    makePath = function (obj) {
        return _.each(obj, function (val, key) {
            if (_.isObject(val)) {
                makePath(val);
            } else {
                obj[key] = path.join(__dirname, val);
            }
        });
    },
    modules = 'scopeStart constants utils shims Strings Directives Collection Messenger Events Model directives/Events directives/Data directives/Children directives/Linguistics Promise Associator HTTP Module DOMA ElementWatcher Looper directives/Element View Buster tests scopeEnd'.split(' '),
    // just to make a new one
    specModules = modules.concat(['odette']),
    extraModules = 'Socket Router LocalStorage NoSock'.split(' '),
    framedModules = 'index'.split(' '),
    makeSpecPath = function (name) {
        return './src/spec/' + name + '.js';
    },
    paths = _.extend(makePath({
        // watch path
        jsAll: './src/**/*.js',
        // build list
        jsOdette: ['./src/lib/odette.js'],
        jsApplication: ['./src/lib/application.js'],
        jsLibraryList: _.map(modules, function (name) {
            return './src/lib/' + name + '.js';
        }),
        jsExtra: _.map(extraModules, function (name) {
            return './src/extras/' + name + '.js';
        }),
        jsTestList: _.map(specModules, makeSpecPath),
        jsExtraTest: _.map(extraModules, function (name) {
            return './src/spec/' + name + '.js';
        }),
        jsFramed: _.map(framedModules, function (name) {
            return './src/framed/' + name + '.js';
        }),
        jspublic: './dist/js/',
        jsTestsPublic: './dist/js/',
        serverIndex: './index.js',
        ignoreFiles: ['.git/', 'node_modules/', './gulp', 'gulpfile.js', './dist', './results']
    }), {
        gulpdir: __dirname,
        src: './src/**/*',
        // jsAllLib: './src/lib/**/*.js',
        jsAllLib: ['./src/lib/**/*', '!./src/lib/**/scope*'],
        documentationOutput: './dist/docs',
        publicized: './src/static/**/*',
        publicizedOutput: './dist',
        jsLibraryOutput: 'library.js',
        jsOdetteOutput: 'odette.js',
        jsApplicationOutput: 'application.js',
        jsTestOutput: 'spec.js',
        jsExtraOutput: 'extra.js',
        jsFramedOutput: 'framed.js',
        jsOdetteDistribute: 'odette.js',
        jsApplicationDistribute: 'application.js',
        jsLibraryDistribute: 'library.js',
        jsDistributes: './dist/build/'
    });
gulpTasker(devTasks.concat(stackTasks, docsTasks), [require('./settings'), paths]);
gulp.task('build', content);
gulp.task('dev', devTasks);
gulp.task('docs', function (cb) {
    runSequence('build', 'builddocumentation', cb);
});
gulp.task('devdocs', ['dev', 'builddocumentation', 'watchdocs']);
gulp.task('uploaddocs', function (cb) {
    runSequence('default', 'builddocs', 'upload', cb);
});
gulp.task('browserstack', ['default', 'stack']);
gulp.task('browserstackie', ['default', 'stackie']);
gulp.task('browserstackie9', ['default', 'stackie9']);