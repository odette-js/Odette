module.exports = function (settings, paths) {
    var log = function () {
        console.log.apply(console, arguments);
    };
    // gulp.task('stack', function () {
    // Input capabilities
    return function () {
        var BrowserStack = require("browserstack");
        var webdriver = require('browserstack-webdriver');
        var client = BrowserStack.createClient({
            username: "shashank@gospecless.com",
            password: "Specless@BrowserStack"
        });
        var browserIdx = 0,
            capabilities = {
                'browserstack.user': 'michaelmclaughli1',
                'browserstack.key': 'cxod2DQsjWhVERxYkCbB',
                'browserstack.local': true
            },
            browsers = settings.prebrowsers || _.toArray(_.foldl(require('./gulp/browsers.js')().sort(function (a, b) {
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
        // });
    };
};