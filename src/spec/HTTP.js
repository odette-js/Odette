application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    _.test.describe('HTTP', function () {
        var allstates;
        _.test.it('is an object', function () {
            var ajax = factories.HTTP('/json/reporting.json');
            // allstates = ajax.allStates();
            _.test.expect(isObject(ajax)).toEqual(BOOLEAN_TRUE);
        });
        // _.test.it('can accept an object as a first argument', function (done) {
        //     factories.HTTP('/json/reporting.json').success(function (json) {
        //         _.test.expect(isObject(json)).toEqual(BOOLEAN_TRUE);
        //         done();
        //     });
        // });
        _.test.it('can accept a string as a first argument', function (done) {
            var original, handlerCounter = 0;
            factories.HTTP('/json/reporting.json').then(function (json) {
                _.test.expect(true).toEqual(true);
                done();
            });
            // .handle('status:200', function (json) {
            //     handlerCounter++;
            //     original = json;
            // }).success(function (json) {
            //     handlerCounter++;
            //     _.test.expect(original === json).toEqual(BOOLEAN_TRUE);
            // }).always(function () {
            //     handlerCounter++;
            //     _.test.expect(handlerCounter).toEqual(3);
            //     done();
            // });
        });
        _.test.it('can post', function (done) {
            factories.HTTP({
                type: 'POST',
                url: '/postecho',
                data: {
                    success: true
                }
            }).then(function (data) {
                _.test.expect(data && data.successful).toBe(true);
                done();
            }, function (err) {
                console.log(err);
            });
        });
        _.test.describe('can handle', function () {
            _.test.it('failures', function (done) {
                var handlerCounter = 0;
                var prom = factories.HTTP('https://google.com').then(function () {
                    throw new Error('did not handle error well');
                }, function (result) {
                    _.test.expect(true).toBe(true);
                    done();
                });
                // .failure(function () {
                //     handlerCounter++;
                // });
                // .always(function () {
                //     handlerCounter++;
                //     _.test.expect(handlerCounter).toEqual(2);
                //     done();
                // });
                // prom.reject();
            });
            _.test.it('errors', function (done) {
                // var handlerCounter = 0;
                factories.HTTP('/json/reporting.json').then(function (result) {
                    _.test.expect(result).not.toBe(null);
                    throw new Error("some msg here");
                }).catch(function (e) {
                    _.test.expect(e == null).not.toBe(true);
                    done();
                });
                // .success(function (json) {
                //     handlerCounter++;
                //     _.test.expect(handlerCounter).toEqual(1);
                //     throw new Error('some message here');
                // }).failure(function () {
                //     handlerCounter++;
                // }).always(function () {
                //     handlerCounter++;
                //     _.test.expect(handlerCounter).toEqual(3);
                //     done();
                // });
            });
            _.test.describe('status codes (more than the ones listed here)', function () {
                _.test.it('200', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/200').then(function (data) {
                        _.test.expect(handlerCounter).toEqual(0);
                        done();
                    });
                    // .handle('status:200', function () {
                    //     handlerCounter++;
                    // }).success(function () {
                    //     handlerCounter++;
                    // }).failure(function () {
                    //     handlerCounter--;
                    // }).always(function () {
                    //     handlerCounter++;
                    //     _.test.expect(handlerCounter).toEqual(3);
                    //     done();
                    // });
                });
                _.test.it('404', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/404').then(function (data) {
                        debugger;
                        throw new Error('404 test failed');
                    }, function (data) {
                        _.test.expect(handlerCounter).toEqual(0);
                        done();
                    });
                    // .handle('status:404', function () {
                    //     handlerCounter++;
                    // }).failure(function () {
                    //     handlerCounter++;
                    // }).always(function () {
                    //     handlerCounter++;
                    //     _.test.expect(handlerCounter).toEqual(3);
                    //     done();
                    // });
                });
                _.test.it('500', function (done) {
                    var handlerCounter = 0;
                    factories.HTTP('/gibberish/500').then(function (data) {
                        throw new Error('500 test failed');
                    }, function (data) {
                        _.test.expect(handlerCounter).toEqual(0);
                        done();
                    });
                    // .handle('status:500', function () {
                    //     handlerCounter++;
                    // }).failure(function () {
                    //     handlerCounter++;
                    // }).always(function () {
                    //     handlerCounter++;
                    //     _.test.expect(handlerCounter).toEqual(3);
                    //     done();
                    // });
                });
            });
        });
        // rewrite this to recursively go through each key and make sure it resolves to always
        // _.test.describe('status codes are used as a layer over success and failure', function () {
        //     _.test.it('200 is success', function () {
        //         _.test.expect(allstates['status:200']).toEqual('success');
        //     });
        //     _.test.it('202 is success', function () {
        //         _.test.expect(allstates['status:202']).toEqual('success');
        //     });
        //     _.test.it('204 is success', function () {
        //         _.test.expect(allstates['status:204']).toEqual('success');
        //     });
        //     _.test.it('205 is success', function () {
        //         _.test.expect(allstates['status:205']).toEqual('success');
        //     });
        //     _.test.it('302 is success', function () {
        //         _.test.expect(allstates['status:302']).toEqual('success');
        //     });
        //     _.test.it('304 is success', function () {
        //         _.test.expect(allstates['status:304']).toEqual('success');
        //     });
        //     _.test.it('400 is failure', function () {
        //         _.test.expect(allstates['status:400']).toEqual('failure');
        //     });
        //     _.test.it('401 is failure', function () {
        //         _.test.expect(allstates['status:401']).toEqual('failure');
        //     });
        //     _.test.it('403 is failure', function () {
        //         _.test.expect(allstates['status:403']).toEqual('failure');
        //     });
        //     _.test.it('404 is failure', function () {
        //         _.test.expect(allstates['status:404']).toEqual('failure');
        //     });
        //     _.test.it('405 is failure', function () {
        //         _.test.expect(allstates['status:405']).toEqual('failure');
        //     });
        //     _.test.it('406 is failure', function () {
        //         _.test.expect(allstates['status:406']).toEqual('failure');
        //     });
        //     _.test.it('500 is failure', function () {
        //         _.test.expect(allstates['status:500']).toEqual('failure');
        //     });
        //     _.test.it('502 is failure', function () {
        //         _.test.expect(allstates['status:502']).toEqual('failure');
        //     });
        //     _.test.it('505 is failure', function () {
        //         _.test.expect(allstates['status:505']).toEqual('failure');
        //     });
        //     _.test.it('511 is failure', function () {
        //         _.test.expect(allstates['status:511']).toEqual('failure');
        //     });
        // });
    });
});