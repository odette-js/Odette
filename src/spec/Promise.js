application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    test.describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        test.beforeEach(function () {
            madeit = 0;
            // promise = _.Promise(_.noop, true);
        });
        test.it('allows for contained async nature', function (done) {
            _.Promise(function (success, failure) {
                setTimeout(function () {
                    handler();
                    success();
                });
            }).then(function () {
                test.expect(madeit).toEqual(1);
                done();
            });
        }, 1);
        test.it('passes results from the original promise to the next one', function (done) {
            _.Promise(function (success, failure) {
                setTimeout(function () {
                    success(3);
                });
            }).then(function (result) {
                test.expect(result).toEqual(3);
                done();
            });
        }, 1);
        test.it('passes results from the original promise to the next one', function (done) {
            _.Promise(function (success, failure) {
                setTimeout(function () {
                    success(3);
                });
            }).then(function (result) {
                return result * result;
            }).then(function (result) {
                test.expect(result).toEqual(9);
                done();
            });
        }, 1);
        test.it('allows for thens after a catch', function (done) {
            _.Promise(function (s) {
                // async process
                s(1);
            }).then(function () {
                throw new Error("invalid result detected");
            }).catch(function (e) {
                test.expect(_.isObject(e)).toBe(true);
                test.expect(e.message).toBe("invalid result detected");
                return "default value";
            }).then(function (result) {
                test.expect(result).toEqual("default value"); // true
                done();
            });
        }, 3);
        //         test.it('allows for async resolution of state', function () {
        //             test.expect(_.isObject(promise)).toEqual(true);
        //             promise.always(handler);
        //             // test for premature trigger
        //             test.expect(madeit).toEqual(0);
        //             // make sure promise is an object
        //             test.expect(_.isObject(promise)).toEqual(true);
        //             // make sure it has the right "state"
        //             test.expect(promise.state).toEqual('pending');
        //             // fulfill the promise
        //             promise.fulfill();
        //             // make sure that it hit the function once and only once
        //             test.expect(madeit).toEqual(1);
        //             // make sure it has the correct state after resolution
        //             test.expect(promise.state).toEqual('success');
        //         });
        //         test.it('can tell you if it has fulfilled or not', function () {
        //             test.expect(promise.is('fulfilled')).toEqual(false);
        //             promise.fulfill();
        //             test.expect(promise.is('fulfilled')).toEqual(true);
        //         });
        //         test.describe('can tell you what state it is in such as', function () {
        //             test.it('pending', function () {
        //                 test.expect(promise.state).toEqual('pending');
        //             });
        //             test.it('success', function () {
        //                 promise.fulfill();
        //                 test.expect(promise.state).toEqual('success');
        //             });
        //             test.it('failure', function () {
        //                 promise.reject();
        //                 test.expect(promise.state).toEqual('failure');
        //             });
        //         });
        //         test.describe('or it can give you a boolean value for resolutions like', function () {
        //             test.it('success', function () {
        //                 promise.fulfill();
        //                 test.expect(promise.is('fulfilled')).toEqual(true);
        //             });
        //             test.it('failure', function () {
        //                 promise.reject();
        //                 test.expect(promise.is('rejected')).toEqual(true);
        //             });
        //         });
        //         test.describe('can fulfill to different states such as', function () {
        //             test.it('success', function (done) {
        //                 // attach handler
        //                 promise.success(handler);
        //                 setTimeout(function () {
        //                     // fulfill promise for success
        //                     promise.fulfill();
        //                     // expect madeit to increase
        //                     test.expect(madeit).toEqual(1);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //             });
        //             test.it('failure', function (done) {
        //                 // attach failure handler
        //                 promise.failure(handler);
        //                 setTimeout(function () {
        //                     // fulfill promise for failure
        //                     promise.reject();
        //                     // expect madeit to increase
        //                     test.expect(madeit).toEqual(1);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //             });
        //         });
        //         test.describe('but it also can trigger functions on any resolution with the always method such as', function () {
        //             test.it('fulfill', function (done) {
        //                 // attach always handler
        //                 promise.success(handler);
        //                 promise.always(handler);
        //                 setTimeout(function () {
        //                     // fulfill promise for failure
        //                     promise.fulfill();
        //                     // expect madeit to increase
        //                     test.expect(madeit).toEqual(2);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //                 test.expect(madeit).toEqual(0);
        //             });
        //             test.it('reject', function (done) {
        //                 // attach always handler
        //                 promise.failure(handler);
        //                 promise.always(handler);
        //                 setTimeout(function () {
        //                     // reject promise
        //                     promise.reject();
        //                     // expect madeit to increase
        //                     test.expect(madeit).toEqual(2);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //                 test.expect(madeit).toEqual(0);
        //             });
        //         });
        //         test.describe('creates a tree of dependencies', function () {
        //             test.it('always is a nonstring (so it terminates)', function () {
        //                 var allstates = promise.allStates();
        //                 test.expect(!_.isString(allstates.always)).toEqual(true);
        //             });
        //             test.it('success is set to always', function () {
        //                 var allstates = promise.allStates();
        //                 test.expect(allstates.success).toEqual('always');
        //             });
        //             test.it('failure is set to always', function () {
        //                 var allstates = promise.allStates();
        //                 test.expect(allstates.failure).toEqual('always');
        //             });
        //         });
    });
});