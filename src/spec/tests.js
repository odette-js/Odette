application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Tests', function () {
        _.test.describe('useful for verifying information.', function () {
            _.test.describe('and you can easily make comparisons with the expect method and it\'s follow-up operations like:', function () {
                _.test.it('toBe', function () {
                    _.test.expect(1).toBe(1);
                    _.test.expect(true).toBe(true);
                    var obj = {};
                    // same pointers
                    _.test.expect(obj).toBe(obj);
                    _.test.expect(_.noop).toBe(_.noop);
                });
                _.test.it('not.toBe', function () {
                    _.test.expect(1).not.toBe(2);
                    _.test.expect(true).not.toBe(false);
                    // different pointers
                    _.test.expect({}).not.toBe({});
                    _.test.expect(function () {}).not.toEqual(function () {});
                });
                _.test.it('toEqual', function () {
                    _.test.expect(1).toEqual(1);
                    // different pointers, same values
                    _.test.expect([1]).toEqual([1]);
                    _.test.expect({
                        one: 1
                    }).toEqual({
                        one: 1
                    });
                    _.test.expect(_.noop).toEqual(_.noop);
                });
                _.test.it('not.toEqual', function () {
                    _.test.expect(1).not.toEqual(2);
                    // different pointers, different values
                    _.test.expect([1]).not.toEqual([2]);
                    _.test.expect({
                        one: 2
                    }).not.toEqual({
                        one: 1
                    });
                    // just different pointers
                    _.test.expect(function () {}).not.toEqual(function () {});
                });
                _.test.it('toEvaluateTo', function () {
                    _.test.expect(function () {
                        return 4;
                    }).toEvaluateTo(4);
                    // uses _.isEqual
                    _.test.expect(function () {
                        return {};
                    }).toEvaluateTo({});
                    _.test.expect(function () {
                        return _.noop;
                    }).toEvaluateTo(_.noop);
                });
                _.test.it('not.toEvaluateTo', function () {
                    _.test.expect(function () {
                        return '';
                    }).not.toEvaluateTo('beep');
                    _.test.expect(function () {
                        return {};
                    }).not.toEvaluateTo([]);
                    _.test.expect(function () {
                        return _.noop;
                    }).not.toEvaluateTo(function () {});
                    var test = function () {};
                    // it should be comparing the function to undefined
                    _.test.expect(test).not.toEvaluateTo(test);
                });
                _.test.it('toThrow', function () {
                    _.test.expect(function () {
                        throw new Error('testing throw');
                    }).toThrow();
                });
                _.test.it('not.toThrow', function () {
                    _.test.expect(function () {}).not.toThrow();
                });
            });
        });
        _.test.it('expect throws when it is nested... so don\'t do it', function () {
            _.test.expect(function () {
                _.test.expect();
            }).toThrow();
        });
        var describeReturnValue = _.test.describe('executed in their own stack', function () {
            var returnValue = _.test.it('for example this dummy test', function () {
                _.test.expect(1).toEqual(1);
            });
            // _.test.it('will return a promise, and so will the describe method', function () {
            //     _.test.expect(_.Promise.isInstance(returnValue)).toEqual(true);
            //     _.test.expect(_.Promise.isInstance(describeReturnValue)).toEqual(true);
            // });
        });
        _.test.describe('expect can also be extended to include custom tests using the maker method which is a member of the expect method', function () {
            _.test.it('including value / object comparison', function () {
                var expectation = _.test.expect('test');
                var value = expectation.toBeGreaterThan;
                expectation.toBe('test');
                _.test.expect(value).toBe(void 0);
                _.test.expect.maker('toBeGreaterThan', function (a, b) {
                    return a > b;
                }, function (a, b) {
                    return _.stringify(a) + ' was expected to be greater than ' + _.stringify(b);
                }, function () {
                    return _.stringify(a) + ' was expected not to be greater than ' + _.stringify(b);
                });
                expectation = _.test.expect(1);
                expectation.toBeGreaterThan(0);
                _.test.expect(_.isFunction(expectation.toBeGreaterThan)).toEqual(true);
                _.test.expect(_.isFunction(expectation.not.toBeGreaterThan)).toEqual(true);
            });
            _.test.it('as well as function comparison, where the function \'s result is compared', function () {
                var expectation = _.test.expect('test');
                expectation.toBe('test');
                _.test.expect(expectation.toEvaluateUnder).toBe(void 0);
                _.test.expect(expectation.not.toEvaluateUnder).toBe(void 0);
                // had to make something up to prove method was executing
                _.test.expect.maker('toEvaluateUnder', function (a, b) {
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
                expectation = _.test.expect(bound);
                expectation.toEvaluateUnder(obj);
                _.test.expect(bound).not.toEvaluateUnder({});
                _.test.expect(_.isFunction(expectation.toEvaluateUnder)).toEqual(true);
                _.test.expect(_.isFunction(expectation.not.toEvaluateUnder)).toEqual(true);
            });
        });
    });
});