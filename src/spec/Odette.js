application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    test.describe('Odette', function () {
        test.describe('creates version independent application objects', function () {
            test.it('wherever the "where" array says it has', function () {
                _.each(Odette.where, function (key) {
                    test.expect(window[key]).not.toEqual(void 0);
                });
            }, 1);
            test.it('will create new version independent application objects when it is', function () {
                var ran = false;
                Odette(window, 'testApp', '0.0.1', function (application, app) {
                    test.expect(application).not.toBe(window.application);
                    test.expect(window.testApp).toBe(application);
                    test.expect(application.VERSION).toEqual(Odette.VERSION);
                    ran = true;
                }, function () {
                    test.expect(ran).toBe(true);
                });
            }, 4);
            test.it('but will not run the first function if it has already been created', function () {
                var ran = false;
                // usually these two will be the same function, but for speed's sake, i'm just going to make it a simple switch
                Odette(window, 'testApp', '0.0.1', function () {
                    ran = true;
                }, function () {
                    test.expect(ran).toBe(false);
                });
            }, 1);
            test.it('and those objects have scoped constructors at the Application property', function () {
                test.expect(_.isFunction(testApp.Application)).toBe(true);
            }, 1);
            test.it('they also have a current version focus', function () {
                test.expect(testApp.currentVersion).toBe('0.0.1');
                Odette(window, 'testApp', '0.0.2', function () {});
                test.expect(testApp.currentVersion).toBe('0.0.2');
            }, 2);
            test.it('as well as a default version focus', function () {
                test.expect(testApp.defaultVersion).toBe('0.0.2');
                Odette(window, 'testApp', '0.0.1', function () {});
                test.expect(testApp.defaultVersion).toBe('0.0.2');
            }, 2);
            test.it('using scope you can target specific versions, or blindly return the default (highest) version', function () {
                test.expect(application.scope(app.VERSION)).toBe(app);
                Odette(window, 'application', '0.0.1', function () {});
                test.expect(application.scope()).toBe(application.scope(application.defaultVersion));
            }, 2);
            test.it('also has a counter that is shared globaly across all version independent application objects and used by all scoped apps', function () {
                // useful for
                test.expect(Odette.counter() + 1).toBe(app.counter());
            }, 1);
            test.it('can also do a simple return', function () {
                test.expect(application.get('fakeout')).toBe(void 0);
                test.expect(application.get(app.VERSION)).toBe(app);
            }, 2);
            test.it('version independent applications unhook their version apps using the unRegisterVersion method', function () {
                var counter, subapp = testApp.get('0.0.1');
                test.expect(subapp).not.toBe(void 0);
                subapp.destroy = function () {
                    counter = 1;
                };
                testApp.unRegisterVersion('0.0.1');
                test.expect(counter).toBe(1);
            }, 2);
        });
    });
});