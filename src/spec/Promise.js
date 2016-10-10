application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        _.test.beforeEach(function () {
            madeit = 0;
            // promise = _.Promise(_.noop, true);
        });
        _.test.it('allows for contained async nature', function (done) {
            _.Promise(function (success, failure) {
                setTimeout(function () {
                    handler();
                    success();
                });
            }).then(function () {
                _.test.expect(madeit).toEqual(1);
                done();
            });
        });
        _.test.it('passes results from the original promise to the next one', function (done) {
            _.Promise(function (success, failure) {
                setTimeout(function () {
                    success(3);
                });
            }).then(function (result) {
                _.test.expect(result).toEqual(3);
                done();
            });
        });
        _.test.it('passes results from the original promise to the next one', function (done) {
            _.Promise(function (success, failure) {
                setTimeout(function () {
                    success(3);
                });
            }).then(function (result) {
                return result * result;
            }).then(function (result) {
                _.test.expect(result).toEqual(9);
                done();
            });
        });
        _.test.it('allows for thens after a catch', function (done) {
            _.Promise(function (s) {
                // async process
                s(1);
            }).then(function () {
                throw new Error("invalid result detected");
            }).catch(function (e) {
                _.test.expect(_.isObject(e)).toBe(true);
                _.test.expect(e.message).toBe("invalid result detected");
                return "default value";
            }).then(function (result) {
                _.test.expect(result).toEqual("default value"); // true
                done();
            });
        });
        //         _.test.it('allows for async resolution of state', function () {
        //             _.test.expect(_.isObject(promise)).toEqual(true);
        //             promise.always(handler);
        //             // test for premature trigger
        //             _.test.expect(madeit).toEqual(0);
        //             // make sure promise is an object
        //             _.test.expect(_.isObject(promise)).toEqual(true);
        //             // make sure it has the right "state"
        //             _.test.expect(promise.state).toEqual('pending');
        //             // fulfill the promise
        //             promise.fulfill();
        //             // make sure that it hit the function once and only once
        //             _.test.expect(madeit).toEqual(1);
        //             // make sure it has the correct state after resolution
        //             _.test.expect(promise.state).toEqual('success');
        //         });
        //         _.test.it('can tell you if it has fulfilled or not', function () {
        //             _.test.expect(promise.is('fulfilled')).toEqual(false);
        //             promise.fulfill();
        //             _.test.expect(promise.is('fulfilled')).toEqual(true);
        //         });
        //         _.test.describe('can tell you what state it is in such as', function () {
        //             _.test.it('pending', function () {
        //                 _.test.expect(promise.state).toEqual('pending');
        //             });
        //             _.test.it('success', function () {
        //                 promise.fulfill();
        //                 _.test.expect(promise.state).toEqual('success');
        //             });
        //             _.test.it('failure', function () {
        //                 promise.reject();
        //                 _.test.expect(promise.state).toEqual('failure');
        //             });
        //         });
        //         _.test.describe('or it can give you a boolean value for resolutions like', function () {
        //             _.test.it('success', function () {
        //                 promise.fulfill();
        //                 _.test.expect(promise.is('fulfilled')).toEqual(true);
        //             });
        //             _.test.it('failure', function () {
        //                 promise.reject();
        //                 _.test.expect(promise.is('rejected')).toEqual(true);
        //             });
        //         });
        //         _.test.describe('can fulfill to different states such as', function () {
        //             _.test.it('success', function (done) {
        //                 // attach handler
        //                 promise.success(handler);
        //                 setTimeout(function () {
        //                     // fulfill promise for success
        //                     promise.fulfill();
        //                     // expect madeit to increase
        //                     _.test.expect(madeit).toEqual(1);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //             });
        //             _.test.it('failure', function (done) {
        //                 // attach failure handler
        //                 promise.failure(handler);
        //                 setTimeout(function () {
        //                     // fulfill promise for failure
        //                     promise.reject();
        //                     // expect madeit to increase
        //                     _.test.expect(madeit).toEqual(1);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //             });
        //         });
        //         _.test.describe('but it also can trigger functions on any resolution with the always method such as', function () {
        //             _.test.it('fulfill', function (done) {
        //                 // attach always handler
        //                 promise.success(handler);
        //                 promise.always(handler);
        //                 setTimeout(function () {
        //                     // fulfill promise for failure
        //                     promise.fulfill();
        //                     // expect madeit to increase
        //                     _.test.expect(madeit).toEqual(2);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //                 _.test.expect(madeit).toEqual(0);
        //             });
        //             _.test.it('reject', function (done) {
        //                 // attach always handler
        //                 promise.failure(handler);
        //                 promise.always(handler);
        //                 setTimeout(function () {
        //                     // reject promise
        //                     promise.reject();
        //                     // expect madeit to increase
        //                     _.test.expect(madeit).toEqual(2);
        //                     // let jasmine know we're all good
        //                     done();
        //                 });
        //                 _.test.expect(madeit).toEqual(0);
        //             });
        //         });
        //         _.test.describe('creates a tree of dependencies', function () {
        //             _.test.it('always is a nonstring (so it terminates)', function () {
        //                 var allstates = promise.allStates();
        //                 _.test.expect(!_.isString(allstates.always)).toEqual(true);
        //             });
        //             _.test.it('success is set to always', function () {
        //                 var allstates = promise.allStates();
        //                 _.test.expect(allstates.success).toEqual('always');
        //             });
        //             _.test.it('failure is set to always', function () {
        //                 var allstates = promise.allStates();
        //                 _.test.expect(allstates.failure).toEqual('always');
        //             });
        //         });
    });
});