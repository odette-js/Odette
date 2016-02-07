application.scope().run(function (app, _, factories, $) {
    describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        beforeEach(function () {
            madeit = 0;
            promise = factories.Promise();
        });
        it('allows for async resolution of state', function () {
            expect(_.isObject(promise)).toEqual(true);
            promise.always(handler);
            // test for premature trigger
            expect(madeit).toEqual(0);
            // make sure promise is an object
            expect(_.isObject(promise)).toEqual(true);
            // make sure it has the right "state"
            expect(promise.state()).toEqual('pending');
            // resolve the promise
            promise.resolve();
            // make sure that it hit the function once and only once
            expect(madeit).toEqual(1);
            // make sure it has the correct state after resolution
            expect(promise.state()).toEqual('success');
        });
        it('can tell you if it has resolved or not', function () {
            expect(promise.resolved()).toEqual(false);
            promise.resolve();
            expect(promise.resolved()).toEqual(true);
        });
        describe('can tell you what state it is in such as', function () {
            it('pending', function () {
                expect(promise.state()).toEqual('pending');
            });
            it('success', function () {
                promise.resolve();
                expect(promise.state()).toEqual('success');
            });
            it('failure', function () {
                promise.reject();
                expect(promise.state()).toEqual('failure');
            });
        });
        describe('or it can give you a boolean value for resolutions like', function () {
            it('pending', function () {
                expect(promise.isPending()).toEqual(true);
            });
            it('success', function () {
                promise.resolve();
                expect(promise.isFulfilled()).toEqual(true);
            });
            it('failure', function () {
                promise.reject();
                expect(promise.isRejected()).toEqual(true);
            });
        });
        describe('can resolve to different states such as', function () {
            it('success', function (done) {
                // attach handler
                promise.success(handler);
                setTimeout(function () {
                    // resolve promise for success
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
            it('failure', function (done) {
                // attach failure handler
                promise.failure(handler);
                setTimeout(function () {
                    // resolve promise for failure
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                });
            });
        });
        describe('but it also can trigger functions on any resolution with the always method such as', function () {
            it('resolve', function (done) {
                // attach always handler
                promise.success(handler);
                promise.always(handler);
                setTimeout(function () {
                    // resolve promise for failure
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                expect(madeit).toEqual(0);
            });
            it('reject', function (done) {
                // attach always handler
                promise.failure(handler);
                promise.always(handler);
                setTimeout(function () {
                    // reject promise
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(2);
                    // let jasmine know we're all good
                    done();
                });
                expect(madeit).toEqual(0);
            });
        });
        describe('creates a tree of dependencies', function () {
            it('always is a nonstring', function () {
                var allstates = promise.allStates();
                expect(!_.isString(allstates.always)).toEqual(true);
            });
            it('success is set to always', function () {
                var allstates = promise.allStates();
                expect(allstates.success).toEqual('always');
            });
            it('failure is set to always', function () {
                var allstates = promise.allStates();
                expect(allstates.failure).toEqual('always');
            });
            it('error is set to always', function () {
                var allstates = promise.allStates();
                expect(allstates.error).toEqual('always');
            });
        });
    });
});