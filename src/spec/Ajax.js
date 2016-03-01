application.scope().run(function (app, _, factories) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    describe('Ajax', function () {
        var ajax, allstates;
        beforeEach(function () {
            ajax = factories.Ajax();
            allstates = ajax.allStates();
        });
        it('is an object', function () {
            expect(isObject(ajax)).toEqual(BOOLEAN_TRUE);
        });
        it('can accept an object as a first argument', function (done) {
            factories.Ajax({
                url: '/json/reporting.json'
            }).success(function (json) {
                expect(isObject(json)).toEqual(BOOLEAN_TRUE);
                done();
            });
        });
        it('can accept a string as a first argument', function (done) {
            var original, handlerCounter = 0;
            factories.Ajax('/json/reporting.json').handle('status:200', function (json) {
                handlerCounter++;
                original = json;
            }).success(function (json) {
                handlerCounter++;
                expect(original === json).toEqual(BOOLEAN_TRUE);
            }).always(function () {
                handlerCounter++;
                expect(handlerCounter).toEqual(3);
                done();
            });
        });
        describe('can handle', function () {
            it('failures', function (done) {
                var handlerCounter = 0;
                var prom = factories.Ajax().failure(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    expect(handlerCounter).toEqual(2);
                    done();
                });
                prom.reject();
            });
            it('errors', function (done) {
                var handlerCounter = 0;
                factories.Ajax('/json/reporting.json').success(function (json) {
                    handlerCounter++;
                    expect(handlerCounter).toEqual(1);
                    throw new Error('some message here');
                }).error(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    expect(handlerCounter).toEqual(3);
                    done();
                });
            });
            describe('status codes (more than the ones listed here)', function () {
                it('404', function (done) {
                    var handlerCounter = 0;
                    factories.Ajax('/gibberish/404').handle('status:404', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                it('500', function (done) {
                    var handlerCounter = 0;
                    factories.Ajax('/gibberish/500').handle('status:500', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
            });
        });
        describe('status codes are used as a layer over success and failure', function () {
            it('200 is success', function () {
                expect(allstates['status:200']).toEqual('success');
            });
            it('202 is success', function () {
                expect(allstates['status:202']).toEqual('success');
            });
            it('205 is success', function () {
                expect(allstates['status:205']).toEqual('success');
            });
            it('302 is success', function () {
                expect(allstates['status:302']).toEqual('success');
            });
            it('304 is success', function () {
                expect(allstates['status:304']).toEqual('success');
            });
            it('400 is failure', function () {
                expect(allstates['status:400']).toEqual('failure');
            });
            it('401 is failure', function () {
                expect(allstates['status:401']).toEqual('failure');
            });
            it('403 is failure', function () {
                expect(allstates['status:403']).toEqual('failure');
            });
            it('404 is failure', function () {
                expect(allstates['status:404']).toEqual('failure');
            });
            it('405 is failure', function () {
                expect(allstates['status:405']).toEqual('failure');
            });
            it('406 is failure', function () {
                expect(allstates['status:406']).toEqual('failure');
            });
            it('500 is failure', function () {
                expect(allstates['status:500']).toEqual('failure');
            });
            it('502 is failure', function () {
                expect(allstates['status:502']).toEqual('failure');
            });
            it('505 is failure', function () {
                expect(allstates['status:505']).toEqual('failure');
            });
            it('511 is failure', function () {
                expect(allstates['status:511']).toEqual('failure');
            });
        });
    });
});