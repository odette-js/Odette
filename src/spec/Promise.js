application.scope().run(function (app, _, factories, $) {
    describe('Promise', function () {
        var madeit, promise;
        beforeEach(function () {
            madeit = 0;
            promise = _.Promise();
        });
        it('allows for async resolution of state', function () {
            expect(_.isObject(promise)).toEqual(true);
            promise.always(function (e) {
                madeit++;
            });
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
                promise.success(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // resolve promise for success
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
            it('failure', function (done) {
                // attach failure handler
                promise.failure(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // resolve promise for failure
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
        });
        describe('but it also can trigger functions on any resolution with the always method such as', function () {
            it('resolve', function (done) {
                // attach always handler
                promise.always(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // resolve promise for failure
                    promise.resolve();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
            it('reject', function (done) {
                // attach always handler
                promise.always(function () {
                    madeit++;
                });
                setTimeout(function () {
                    // reject promise
                    promise.reject();
                    // expect madeit to increase
                    expect(madeit).toEqual(1);
                    // let jasmine know we're all good
                    done();
                }, 100);
            });
        });
    });
});