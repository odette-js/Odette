application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        _.beforeEach(function () {
            madeit = 0;
            promise = factories.Promise();
        });
        _.it('allows for async resolution of state', function () {
            _.expect(_.isObject(promise)).toEqual(true);
            promise.always(handler);
            // test for premature trigger
            _.expect(madeit).toEqual(0);
            // make sure promise is an object
            _.expect(_.isObject(promise)).toEqual(true);
            // make sure it has the right "state"
            _.expect(promise.state).toEqual('pending');
            // fulfill the promise
            promise.fulfill();
            // make sure that it hit the function once and only once
            _.expect(madeit).toEqual(1);
            // make sure it has the correct state after resolution
            _.expect(promise.state).toEqual('success');
        });
        _.it('can tell you if it has fulfilled or not', function () {
            _.expect(promise.is('fulfilled')).toEqual(false);
            promise.fulfill();
            _.expect(promise.is('fulfilled')).toEqual(true);
        });
        _.describe('can tell you what state it is in such as', function () {
            _.it('pending', function () {
                _.expect(promise.state).toEqual('pending');
            });
            _.it('success', function () {
                promise.fulfill();
                _.expect(promise.state).toEqual('success');
            });
            _.it('failure', function () {
                promise.reject();
                _.expect(promise.state).toEqual('failure');
            });
        });
        _.describe('or it can give you a boolean value for resolutions like', function () {
            _.it('success', function () {
                promise.fulfill();
                _.expect(promise.is('fulfilled')).toEqual(true);
            });
            _.it('failure', function () {
                promise.reject();
                _.expect(promise.is('rejected')).toEqual(true);
            });
        });
        _.describe('can fulfill to different states such as', function () {
            _.it('success', function (done) {
                // attach handler
                promise.success(handler);
                setTimeout(function () {
                    // fulfill promise for success
                    promise.fulfill();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
            _.it('failure', function (done) {
                // attach failure handler
                promise.failure(handler);
                setTimeout(function () {
                    // fulfill promise for failure
                    promise.reject();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
        });
        _.describe('but it also can trigger functions on any resolution with the always method such as', function () {
            _.it('fulfill', function (done) {
                // attach always handler
                promise.success(handler);
                promise.always(handler);
                setTimeout(function () {
                    // fulfill promise for failure
                    promise.fulfill();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                _.expect(madeit).toEqual(0);
            });
            _.it('reject', function (done) {
                // attach always handler
                promise.failure(handler);
                promise.always(handler);
                setTimeout(function () {
                    // reject promise
                    promise.reject();
                    // expect madeit to increase
                    _.expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                _.expect(madeit).toEqual(0);
            });
        });
        _.describe('creates a tree of dependencies', function () {
            _.it('always is a nonstring (so it terminates)', function () {
                var allstates = promise.allStates();
                _.expect(!_.isString(allstates.always)).toEqual(true);
            });
            _.it('success is set to always', function () {
                var allstates = promise.allStates();
                _.expect(allstates.success).toEqual('always');
            });
            _.it('failure is set to always', function () {
                var allstates = promise.allStates();
                _.expect(allstates.failure).toEqual('always');
            });
        });
    });
});