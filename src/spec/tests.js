application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.describe('Tests', function () {
        _.describe('useful for verifying information.', function () {
            _.describe('and you can easily make comparisons with the expect method and it\'s follow-up operations like:', function () {
                _.it('toBe', function () {
                    _.expect(1).toBe(1);
                    _.expect(true).toBe(true);
                    var obj = {};
                    // same pointers
                    _.expect(obj).toBe(obj);
                    _.expect(_.noop).toBe(_.noop);
                });
                _.it('not.toBe', function () {
                    _.expect(1).not.toBe(2);
                    _.expect(true).not.toBe(false);
                    // different pointers
                    _.expect({}).not.toBe({});
                    _.expect(function () {}).not.toEqual(function () {});
                });
                _.it('toEqual', function () {
                    _.expect(1).toEqual(1);
                    // different pointers, same values
                    _.expect([1]).toEqual([1]);
                    _.expect({
                        one: 1
                    }).toEqual({
                        one: 1
                    });
                    _.expect(_.noop).toEqual(_.noop);
                });
                _.it('not.toEqual', function () {
                    _.expect(1).not.toEqual(2);
                    // different pointers, different values
                    _.expect([1]).not.toEqual([2]);
                    _.expect({
                        one: 2
                    }).not.toEqual({
                        one: 1
                    });
                    // just different pointers
                    _.expect(function () {}).not.toEqual(function () {});
                });
                _.it('toEvaluateTo', function () {
                    _.expect(function () {
                        return 4;
                    }).toEvaluateTo(4);
                    // uses _.isEqual
                    _.expect(function () {
                        return {};
                    }).toEvaluateTo({});
                    _.expect(function () {
                        return _.noop;
                    }).toEvaluateTo(_.noop);
                });
                _.it('not.toEvaluateTo', function () {
                    _.expect(function () {
                        return '';
                    }).not.toEvaluateTo('beep');
                    _.expect(function () {
                        return {};
                    }).not.toEvaluateTo([]);
                    _.expect(function () {
                        return _.noop;
                    }).not.toEvaluateTo(function () {});
                    var test = function () {};
                    // it should be comparing the function to undefined
                    _.expect(test).not.toEvaluateTo(test);
                });
                _.it('toThrow', function () {
                    _.expect(function () {
                        throw new Error('testing throw');
                    }).toThrow();
                });
                _.it('not.toThrow', function () {
                    _.expect(function () {}).not.toThrow();
                });
            });
        });
        _.it('expect throws when it is nested... so don\'t do it', function () {
            _.expect(function () {
                _.expect();
            }).toThrow();
        });
        var describeReturnValue = _.describe('executed in their own stack', function () {
            var returnValue = _.it('for example this dummy test', function () {
                _.expect(1).toEqual(1);
            });
            _.it('will return a promise, and so will the describe method', function () {
                _.expect(_.Promise.isInstance(returnValue)).toEqual(true);
                _.expect(_.Promise.isInstance(describeReturnValue)).toEqual(true);
            });
        });
        _.describe('expect can also be extended to include custom tests using the maker method which is a member of the expect method', function () {
            _.it('including value / object comparison', function () {
                var expectation = _.expect('test');
                var value = expectation.toBeGreaterThan;
                expectation.toBe('test');
                _.expect(value).toBe(void 0);
                _.expect.maker('toBeGreaterThan', function (a, b) {
                    return a > b;
                }, function (a, b) {
                    return _.stringify(a) + ' was expected to be greater than ' + _.stringify(b);
                }, function () {
                    return _.stringify(a) + ' was expected not to be greater than ' + _.stringify(b);
                });
                expectation = _.expect(1);
                expectation.toBeGreaterThan(0);
                _.expect(_.isFunction(expectation.toBeGreaterThan)).toEqual(true);
                _.expect(_.isFunction(expectation.not.toBeGreaterThan)).toEqual(true);
            });
            _.it('as well as function comparison, where the function \'s result is compared', function () {
                var expectation = _.expect('test');
                var value = expectation.toEvaluateUnder;
                expectation.toBe('test');
                _.expect(value).toBe(void 0);
                _.expect.maker('toEvaluateUnder', function (a, b) {
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
                expectation = _.expect(bound);
                expectation.toEvaluateUnder(obj);
                _.expect(bound).not.toEvaluateUnder({});
                _.expect(_.isFunction(expectation.toEvaluateUnder)).toEqual(true);
                _.expect(_.isFunction(expectation.not.toEvaluateUnder)).toEqual(true);
            });
        });
    });
});