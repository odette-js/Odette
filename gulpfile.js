var content = ['browserify'],
    server = ['open', 'serve'],
    allTasks = content.concat(server, ['watch']),
    devTasks = allTasks.concat(['build']),
    gulp = require('gulp'),
    gulpTasker = require('./gulp'),
    path = require('path'),
    _ = require('underscore'),
    makePath = function (obj) {
        return _.each(obj, function (val, key) {
            if (_.isObject(val)) {
                makePath(val);
            } else {
                obj[key] = path.join(__dirname, val);
            }
        });
    },
    modules = 'scopeStart constants utils shims Strings Directives Collection Messenger Events Model directives/Events directives/Data directives/Children directives/Linguistics Promise Associator HTTP Module DOMA Looper directives/Element View Buster directives/swipe tests scopeEnd'.split(' '),
    extraModules = 'Socket Router LocalStorage NoSock'.split(' '),
    framedModules = 'index'.split(' '),
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
        jsTestList: _.map(modules, function (name) {
            return './src/spec/' + name + '.js';
        }),
        jsExtraTest: _.map(extraModules, function (name) {
            return './src/spec/' + name + '.js';
        }),
        jsFramed: _.map(framedModules, function (name) {
            return './src/framed/' + name + '.js';
        }),
        jspublic: './public/js/',
        jsTestsPublic: './public/js/',
        serverIndex: './index.js',
        ignoreFiles: ['.git/', 'node_modules/', './gulp', 'gulpfile.js', './public']
    }), {
        publicized: './src/static/**/*',
        publicizedOutput: './public',
        jsLibraryOutput: 'library.js',
        jsOdetteOutput: 'odette.js',
        jsApplicationOutput: 'application.js',
        jsTestOutput: 'spec.js',
        jsExtraOutput: 'extra.js',
        jsFramedOutput: 'framed.js'
    });
gulpTasker(allTasks, [require('./settings'), paths]);
gulp.task('build', content);
gulp.task('dev', devTasks);
gulp.task('default', allTasks);