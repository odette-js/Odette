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
    modules = 'setup utils shims Strings Collection Events Reqres Box Module Storage Looper Promise Ajax Associator DOMM Element View Buster'.split(' '),
    paths = makePath({
        jsAll: './src/**/*.js',
        jsList: _.map(modules, function (name) {
            return './src/lib/' + name + '.js';
        }),
        jsTestList: _.map(modules, function (name) {
            return './src/spec/' + name + '.js';
        }),
        jspublic: './public/js/',
        serverIndex: './index.js',
        ignoreFiles: ['.git/', 'node_modules/', './gulp', 'gulpfile.js', './public']
    });
paths.jsTestOutput = 'spec.js';
paths.jsOutput = 'all.js';
gulpTasker(allTasks, [require('./settings'), paths]);
gulp.task('build', content);
gulp.task('dev', devTasks);
gulp.task('default', server);