application.scope().run(window, function (module, app, _, factories, $) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    test.describe('HTTP', function () {
        var allstates;
        test.it('is an object', function () {
            var ajax = $.HTTP('/json/reporting.json');
            // allstates = ajax.allStates();
            test.expect(isObject(ajax)).toEqual(BOOLEAN_TRUE);
        }, 1);
        // test.it('can accept an object as a first argument', function (done) {
        //     $.HTTP('/json/reporting.json').success(function (json) {
        //         test.expect(isObject(json)).toEqual(BOOLEAN_TRUE);
        //         done();
        //     });
        // });
        test.it('can accept a string as a first argument', function (done) {
            var original, handlerCounter = 0;
            $.HTTP('/json/reporting.json').then(function (json) {
                test.expect(true).toEqual(true);
                done();
            });
            // .handle('status:200', function (json) {
            //     handlerCounter++;
            //     original = json;
            // }).success(function (json) {
            //     handlerCounter++;
            //     test.expect(original === json).toEqual(BOOLEAN_TRUE);
            // }).always(function () {
            //     handlerCounter++;
            //     test.expect(handlerCounter).toEqual(3);
            //     done();
            // });
        }, 1);
        test.it('can post', function (done) {
            $.HTTP({
                type: 'POST',
                url: '/postecho',
                data: {
                    success: true
                }
            }).then(function (data) {
                test.expect(data && data.successful).toBe(true);
                done();
            }, function (err) {
                console.log(err);
            });
        }, 1);
        test.describe('can handle', function () {
            test.it('failures', function (done) {
                var handlerCounter = 0;
                var prom = $.HTTP('https://google.com').then(function () {
                    throw new Error('did not handle error well');
                }, function (result) {
                    test.expect(true).toBe(true);
                    done();
                });
                // .failure(function () {
                //     handlerCounter++;
                // });
                // .always(function () {
                //     handlerCounter++;
                //     test.expect(handlerCounter).toEqual(2);
                //     done();
                // });
                // prom.reject();
            }, 1);
            test.it('errors', function (done) {
                // var handlerCounter = 0;
                $.HTTP('/json/reporting.json').then(function (result) {
                    test.expect(result).not.toBe(null);
                    throw new Error("some msg here");
                }).catch(function (e) {
                    test.expect(e === undefined).not.toBe(true);
                    done();
                });
                // .success(function (json) {
                //     handlerCounter++;
                //     test.expect(handlerCounter).toEqual(1);
                //     throw new Error('some message here');
                // }).failure(function () {
                //     handlerCounter++;
                // }).always(function () {
                //     handlerCounter++;
                //     test.expect(handlerCounter).toEqual(3);
                //     done();
                // });
            }, 2);
            test.describe('status codes (more than the ones listed here)', function () {
                test.it('200', function (done) {
                    var handlerCounter = 0;
                    $.HTTP('/gibberish/200').then(function (data) {
                        test.expect(handlerCounter).toEqual(0);
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
                    //     test.expect(handlerCounter).toEqual(3);
                    //     done();
                    // });
                }, 1);
                test.it('404', function (done) {
                    var handlerCounter = 0;
                    $.HTTP('/gibberish/404').then(function (data) {
                        throw new Error('404 test failed');
                    }, function (data) {
                        test.expect(handlerCounter).toEqual(0);
                        done();
                    });
                    // .handle('status:404', function () {
                    //     handlerCounter++;
                    // }).failure(function () {
                    //     handlerCounter++;
                    // }).always(function () {
                    //     handlerCounter++;
                    //     test.expect(handlerCounter).toEqual(3);
                    //     done();
                    // });
                }, 1);
                test.it('500', function (done) {
                    var handlerCounter = 0;
                    $.HTTP('/gibberish/500').then(function (data) {
                        throw new Error('500 test failed');
                    }, function (data) {
                        test.expect(handlerCounter).toEqual(0);
                        done();
                    });
                    // .handle('status:500', function () {
                    //     handlerCounter++;
                    // }).failure(function () {
                    //     handlerCounter++;
                    // }).always(function () {
                    //     handlerCounter++;
                    //     test.expect(handlerCounter).toEqual(3);
                    //     done();
                    // });
                }, 1);
            });
        });
        // rewrite this to recursively go through each key and make sure it resolves to always
        // test.describe('status codes are used as a layer over success and failure', function () {
        //     test.it('200 is success', function () {
        //         test.expect(allstates['status:200']).toEqual('success');
        //     });
        //     test.it('202 is success', function () {
        //         test.expect(allstates['status:202']).toEqual('success');
        //     });
        //     test.it('204 is success', function () {
        //         test.expect(allstates['status:204']).toEqual('success');
        //     });
        //     test.it('205 is success', function () {
        //         test.expect(allstates['status:205']).toEqual('success');
        //     });
        //     test.it('302 is success', function () {
        //         test.expect(allstates['status:302']).toEqual('success');
        //     });
        //     test.it('304 is success', function () {
        //         test.expect(allstates['status:304']).toEqual('success');
        //     });
        //     test.it('400 is failure', function () {
        //         test.expect(allstates['status:400']).toEqual('failure');
        //     });
        //     test.it('401 is failure', function () {
        //         test.expect(allstates['status:401']).toEqual('failure');
        //     });
        //     test.it('403 is failure', function () {
        //         test.expect(allstates['status:403']).toEqual('failure');
        //     });
        //     test.it('404 is failure', function () {
        //         test.expect(allstates['status:404']).toEqual('failure');
        //     });
        //     test.it('405 is failure', function () {
        //         test.expect(allstates['status:405']).toEqual('failure');
        //     });
        //     test.it('406 is failure', function () {
        //         test.expect(allstates['status:406']).toEqual('failure');
        //     });
        //     test.it('500 is failure', function () {
        //         test.expect(allstates['status:500']).toEqual('failure');
        //     });
        //     test.it('502 is failure', function () {
        //         test.expect(allstates['status:502']).toEqual('failure');
        //     });
        //     test.it('505 is failure', function () {
        //         test.expect(allstates['status:505']).toEqual('failure');
        //     });
        //     test.it('511 is failure', function () {
        //         test.expect(allstates['status:511']).toEqual('failure');
        //     });
        // });
    });
});