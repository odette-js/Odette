var content = ['browserify', 'distribute'],
    server = ['serve', 'open'],
    stackTasks = ['stack', 'stackie', 'stackie9'],
    watch = ['watch'],
    devTasks = content.concat(watch, server),
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
    setup = '../wrappers/start ../wrappers/constants'.split(' '),
    end = '../wrappers/end'.split(' '),
    shims = '../wrappers/shims_start shims registerElement ../wrappers/shims_end'.split(' '),
    specs = 'utils Strings Directives Immutable Registry Collection Events directives/Linguistics Model directives/Events directives/Data directives/Children Promise directives/DependencyManager Deferred WeakMap Module HTTP ResizeObserver DOMA ElementWatcher Looper directives/Element View Buster tests'.split(' '),
    modules = specs.slice(0),
    removed = modules.splice.apply(modules, [1, 0].concat(shims)),
    library = setup.concat(modules, end),
    auto_app = ['odette', 'application'],
    // just to make a new one
    specModules = ['setup'].concat(specs, auto_app, ['teardown']),
    extraModules = 'Socket Router LocalStorage NoSock'.split(' '),
    framedModules = 'index'.split(' '),
    routeToFile = function (folder) {
        return function (name) {
            return path.join(__dirname, folder, name + '.js');
        };
    },
    makeSpecPath = function (name) {
        return path.join('./src/spec/', name + '.js');
    },
    libPath = function (name) {
        return path.join('./src/lib/', name + '.js');
    },
    extraPath = function (name) {
        return path.join('./src/extras/', name + '.js');
    },
    specPath = function (name) {
        return path.join('./src/spec/', name + '.js');
    },
    framedPath = function (name) {
        return path.join('./src/framed/', name + '.js');
    },
    paths = _.extend(makePath({
        // watch path
        jsAll: './src/**/*.js',
        // build list
        jsOdette: ['./src/lib/odette.js'],
        jsApplication: ['./src/lib/application.js'],
        jsLibraryList: _.map(library, libPath),
        jsExtra: _.map(extraModules, extraPath),
        jsTestList: _.map(specModules, makeSpecPath),
        jsExtraTest: _.map(extraModules, specPath),
        jsFramed: _.map(framedModules, framedPath),
        jspublic: './dist/js/',
        jsTestsPublic: './dist/js/',
        serverIndex: './index.js',
        ignoreFiles: ['.git/', 'node_modules/', './gulp', 'gulpfile.js', './dist', './results']
    }), {
        jsOdetteNode: routeToFile('./src/node/')('index'),
        jsOdetteNodeDistribute: 'index.js',
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
        jsNodeDistribute: 'index.js',
        jsDistributes: './dist/build/',
        jsFull: _.map(auto_app.concat(library, ['../wrappers/auto_setup']), libPath),
        jsFullOutput: 'odette-full.js',
        jsFullOutputDistribute: 'odette-full.js'
    }),
    settings = require('./settings'),
    argv = require('optimist').argv;
settings.http.altport = (argv.port || settings.http.port) - 80;
gulpTasker(devTasks.concat(stackTasks, ['altserver']), [settings, paths, {}]);
gulp.task('build', function (cb) {
    runSequence('browserify', 'distribute', cb);
});
gulp.task('dev', function (cb) {
    runSequence('build', 'watch', 'serve', 'open', cb);
});
gulp.task('browserstack', ['default', 'stack']);
gulp.task('browserstackie', ['default', 'stackie']);
gulp.task('browserstackie9', ['default', 'stackie9']);