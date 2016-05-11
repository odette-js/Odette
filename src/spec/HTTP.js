application.scope().run(function (app, _, factories) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    _.describe('HTTP', function () {
        var ajax, allstates;
        _.beforeEach(function () {
            ajax = factories.HTTP();
            allstates = ajax.allStates();
        });
        _.it('is an object', function () {
            _.expect(isObject(ajax)).toEqual(BOOLEAN_TRUE);
        });
        _.it('can accept an object as a first argument', function (done) {
            factories.HTTP({
                url: '/json/reporting.json'
            }).success(function (json) {
                _.expect(isObject(json)).toEqual(BOOLEAN_TRUE);
                done();
            });
        });
        _.it('can accept a string as a first argument', function (done) {
            var original, handlerCounter = 0;
            factories.HTTP('/json/reporting.json').handle('status:200', function (json) {
                handlerCounter++;
                original = json;
            }).success(function (json) {
                handlerCounter++;
                _.expect(original === json).toEqual(BOOLEAN_TRUE);
            }).always(function () {
                handlerCounter++;
                _.expect(handlerCounter).toEqual(3);
                done();
            });
        });
        _.describe('can handle', function () {
            _.it('failures', function (done) {
                var handlerCounter = 0;
                var prom = factories.HTTP().failure(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    _.expect(handlerCounter).toEqual(2);
                    done();
                });
                prom.reject();
            });
            _.it('errors', function (done) {
                var handlerCounter = 0;
                factories.HTTP('/json/reporting.json').success(function (json) {
                    handlerCounter++;
                    _.expect(handlerCounter).toEqual(1);
                    throw new Error('some message here');
                }).error(function () {
                    handlerCounter++;
                }).always(function () {
                    handlerCounter++;
                    _.expect(handlerCounter).toEqual(3);
                    done();
                });
            });
            _.describe('status codes (more than the ones listed here)', function () {
                _.it('200', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/200').handle('status:200', function () {
                        handlerCounter++;
                    }).success(function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter--;
                    }).always(function () {
                        handlerCounter++;
                        _.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                _.it('404', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/404').handle('status:404', function () {
                        handlerCounter++;
                    }).failure(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        _.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
                _.it('500', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/500').handle('status:500', function () {
                        handlerCounter++;
                    }).error(function () {
                        handlerCounter++;
                    }).always(function () {
                        handlerCounter++;
                        _.expect(handlerCounter).toEqual(3);
                        done();
                    });
                });
            });
        });
        _.describe('status codes are used as a layer over success and failure', function () {
            _.it('200 is success', function () {
                _.expect(allstates['status:200']).toEqual('success');
            });
            _.it('202 is success', function () {
                _.expect(allstates['status:202']).toEqual('success');
            });
            _.it('205 is success', function () {
                _.expect(allstates['status:205']).toEqual('success');
            });
            _.it('302 is success', function () {
                _.expect(allstates['status:302']).toEqual('success');
            });
            _.it('304 is success', function () {
                _.expect(allstates['status:304']).toEqual('success');
            });
            _.it('400 is failure', function () {
                _.expect(allstates['status:400']).toEqual('failure');
            });
            _.it('401 is failure', function () {
                _.expect(allstates['status:401']).toEqual('failure');
            });
            _.it('403 is failure', function () {
                _.expect(allstates['status:403']).toEqual('failure');
            });
            _.it('404 is failure', function () {
                _.expect(allstates['status:404']).toEqual('failure');
            });
            _.it('405 is failure', function () {
                _.expect(allstates['status:405']).toEqual('failure');
            });
            _.it('406 is failure', function () {
                _.expect(allstates['status:406']).toEqual('failure');
            });
            _.it('500 is error', function () {
                _.expect(allstates['status:500']).toEqual('error');
            });
            _.it('502 is error', function () {
                _.expect(allstates['status:502']).toEqual('error');
            });
            _.it('505 is error', function () {
                _.expect(allstates['status:505']).toEqual('error');
            });
            _.it('511 is error', function () {
                _.expect(allstates['status:511']).toEqual('error');
            });
        });
    });
});