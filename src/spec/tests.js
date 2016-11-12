application.scope().run(window, function (module, app, _, factories, $) {
    test.describe('Tests', function () {
        test.describe('useful for verifying information.', function () {
            test.describe('and you can easily make comparisons with the expect method and it\'s follow-up operations like:', function () {
                test.it('toBe', function () {
                    test.expect(1).toBe(1);
                    test.expect(true).toBe(true);
                    var obj = {};
                    // same pointers
                    test.expect(obj).toBe(obj);
                    test.expect(_.noop).toBe(_.noop);
                }, 4);
                test.it('not.toBe', function () {
                    test.expect(1).not.toBe(2);
                    test.expect(true).not.toBe(false);
                    // different pointers
                    test.expect({}).not.toBe({});
                    test.expect(function () {}).not.toEqual(function () {});
                }, 4);
                test.it('toEqual', function () {
                    test.expect(1).toEqual(1);
                    // different pointers, same values
                    test.expect([1]).toEqual([1]);
                    test.expect({
                        one: 1
                    }).toEqual({
                        one: 1
                    });
                    test.expect(_.noop).toEqual(_.noop);
                }, 4);
                test.it('not.toEqual', function () {
                    test.expect(1).not.toEqual(2);
                    // different pointers, different values
                    test.expect([1]).not.toEqual([2]);
                    test.expect({
                        one: 2
                    }).not.toEqual({
                        one: 1
                    });
                    // just different pointers
                    test.expect(function () {}).not.toEqual(function () {});
                }, 4);
                test.it('toEvaluateTo', function () {
                    test.expect(function () {
                        return 4;
                    }).toEvaluateTo(4);
                    // uses _.isEqual
                    test.expect(function () {
                        return {};
                    }).toEvaluateTo({});
                    test.expect(function () {
                        return _.noop;
                    }).toEvaluateTo(_.noop);
                }, 3);
                test.it('not.toEvaluateTo', function () {
                    test.expect(function () {
                        return '';
                    }).not.toEvaluateTo('beep');
                    test.expect(function () {
                        return {};
                    }).not.toEvaluateTo([]);
                    test.expect(function () {
                        return _.noop;
                    }).not.toEvaluateTo(function () {});
                    var tst = function () {};
                    // it should be comparing the function to undefined
                    test.expect(tst).not.toEvaluateTo(tst);
                }, 4);
                test.it('toThrow', function () {
                    test.expect(function () {
                        throw new Error('testing throw');
                    }).toThrow();
                }, 1);
                test.it('not.toThrow', function () {
                    test.expect(function () {}).not.toThrow();
                }, 1);
            });
        });
        test.it('expect throws when it is nested... so don\'t do it', function () {
            test.expect(function () {
                test.expect();
            }).toThrow();
        }, 1);
        var describeReturnValue = test.describe('executed in their own stack', function () {
            var returnValue = test.it('for example this dummy test', function () {
                test.expect(1).toEqual(1);
            }, 1);
            // test.it('will return a promise, and so will the describe method', function () {
            //     test.expect(_.Promise.isInstance(returnValue)).toEqual(true);
            //     test.expect(_.Promise.isInstance(describeReturnValue)).toEqual(true);
            // });
        });
        test.describe('expect can also be extended to include custom tests using the maker method which is a member of the expect method', function () {
            test.it('including value / object comparison', function () {
                var expectation = test.expect('test');
                var value = expectation.toBeGreaterThan;
                expectation.toBe('test');
                test.expect(value).toBe(void 0);
                test.maker('toBeGreaterThan', function (a, b) {
                    return a > b;
                }, function (a, b) {
                    return _.stringify(a) + ' was expected to be greater than ' + _.stringify(b);
                }, function () {
                    return _.stringify(a) + ' was expected not to be greater than ' + _.stringify(b);
                });
                expectation = test.expect(1);
                expectation.toBeGreaterThan(0);
                test.expect(_.isFunction(expectation.toBeGreaterThan)).toEqual(true);
                test.expect(_.isFunction(expectation.not.toBeGreaterThan)).toEqual(true);
            }, 5);
            test.it('as well as function comparison, where the function \'s result is compared', function () {
                var expectation = test.expect('test');
                expectation.toBe('test');
                test.expect(expectation.toEvaluateUnder).toBe(void 0);
                test.expect(expectation.not.toEvaluateUnder).toBe(void 0);
                // had to make something up to prove method was executing
                test.maker('toEvaluateUnder', function (a, b) {
                    return a === b;
                }, function (a, b) {
                    return _.stringify(a) + ' was expected to be evaluated with the context of ' + _.stringify(b);
                }, function () {
                    return _.stringify(a) + ' was expected not to be evaluated with the context of ' + _.stringify(b);
                }, true);
                var obj = {};
                var bound = _.bind(function () {
                    return this;
                }, obj);
                expectation = test.expect(bound);
                expectation.toEvaluateUnder(obj);
                test.expect(bound).not.toEvaluateUnder({});
                test.expect(_.isFunction(expectation.toEvaluateUnder)).toEqual(true);
                test.expect(_.isFunction(expectation.not.toEvaluateUnder)).toEqual(true);
            }, 7);
        });
    });
});