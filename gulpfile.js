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
    modules = 'beforeSetup setup scopeStart constants utils shims Strings Directives Collection Messenger Events Model directives/Events directives/Data directives/Children directives/Linguistics Promise Associator Ajax Module DOMM Looper directives/Element View Buster tests scopeEnd'.split(' '),
    extraModules = 'Socket Router LocalStorage NoSock'.split(' '),
    framedModules = 'index'.split(' '),
    paths = makePath({
        jsAll: './src/**/*.js',
        jsList: _.map(modules, function (name) {
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
        serverIndex: './index.js',
        ignoreFiles: ['.git/', 'node_modules/', './gulp', 'gulpfile.js', './public']
    });
paths.jsTestOutput = 'spec.js';
paths.jsOutput = 'odette.js';
paths.jsExtraOutput = 'extra.js';
paths.jsFramedOutput = 'framed.js';
gulpTasker(allTasks, [require('./settings'), paths]);
gulp.task('build', content);
gulp.task('dev', devTasks);
gulp.task('default', server);