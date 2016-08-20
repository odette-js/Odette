var content = ['browserify', 'distribute'],
    server = ['serve', 'open'],
    allTasks = content.concat(['watch'], server),
    devTasks = allTasks.concat(content),
    gulp = require('gulp'),
    gulpTasker = require('./gulp'),
    path = require('path'),
    _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    spawn = require('child_process').spawn,
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
        src: './src/**/*',
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
gulpTasker(allTasks, [require('./settings'), paths]);
gulp.task('build', content);
gulp.task('dev', devTasks);
gulp.task('default', allTasks);
var BrowserStack = require("browserstack");
var webdriver = require('browserstack-webdriver');
var client = BrowserStack.createClient({
    username: "shashank@gospecless.com",
    password: "Specless@BrowserStack"
});
var log = function () {
    console.log.apply(console, arguments);
};
var prebrowsers;
gulp.task('stack', function () {
    // Input capabilities
    var browserIdx = 0,
        capabilities = {
            'browserstack.user': 'michaelmclaughli1',
            'browserstack.key': 'cxod2DQsjWhVERxYkCbB',
            'browserstack.local': true
        },
        browsers = prebrowsers || _.toArray(_.foldl(require('./gulp/browsers.js')().sort(function (a, b) {
            return a.browser_version < b.browser_version ? 1 : -1;
        }), function (list, browser) {
            var currentBrowserVersion;
            if (!list[browser.browserName]) {
                list[browser.browserName] = _.extend({}, browser);
            } else {
                currentBrowserVersion = list[browser.browserName].browser_version;
                if (+currentBrowserVersion < +browser.browser_version) {
                    list[browser.browserName] = browser;
                } else {
                    if (+currentBrowserVersion === +browser.browser_version && macOs[browser.os]) {
                        list[browser.browserName] = browser;
                    }
                }
            }
            return list;
        }, {})),
        macOs = {
            'OS X': true,
            ios: true
        },
        writeToResults = function (name, result) {
            var filename = path.join(__dirname, 'results', name + '.json');
            fs.writeFile(filename, result, function () {
                spawn('json-prettify', [filename]).on('data', function (data) {
                    console.log(data);
                });
            });
        },
        queueNext = function (driver) {
            driver.quit().then(function () {
                browserIdx++;
                setTimeout(function () {
                    if (!browsers[browserIdx]) {
                        process.exit();
                    } else {
                        browserTest(browsers[browserIdx]);
                    }
                });
            });
        },
        browserTest = function (browser) {
            var driver;
            if (!browser) {
                return;
            }
            log('testing: ' + browser.browserName + ' v' + (browser.browser_version) + ' on ' + browser.os + ' ' + browser.os_version);
            driver = new webdriver.Builder().usingServer('http://hub.browserstack.com/wd/hub').withCapabilities(_.extend({}, capabilities, browser)).build();
            var waits = function () {
                driver.findElements(webdriver.By.className('test-output')).then(function (els) {
                    return els.length ? els[0].getText().then(function (text) {
                        writeToResults(browser.browserName.split(' ').join('') + '_' + browser.browser_version.split(' ').join('') + '_' + browser.os.split(' ').join('') + '_' + browser.os_version, text);
                        queueNext(driver);
                    }) : setTimeout(waits, 2000);
                });
            };
            driver.get('http://localhost:8080/test/browserstack/').then(function () {
                // wait for the tests to complete
                setTimeout(waits, 10000);
            });
        };
    setTimeout(function () {
        browserTest(browsers[browserIdx]);
    }, 1000);
});
gulp.task('stackie', function () {
    prebrowsers = require('./gulp/browsers-ie.js')();
    gulp.start('stack');
});
gulp.task('stackie9', function () {
    prebrowsers = _.filter(require('./gulp/browsers-ie.js')(), function (browser) {
        return +browser.browser_version === 9;
    });
    gulp.start('stack');
});
gulp.task('browserstack', ['default', 'stack']);
gulp.task('browserstackie', ['default', 'stackie']);
gulp.task('browserstackie9', ['default', 'stackie9']);