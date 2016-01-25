application.scope().run(function (app, _, factories, $) {
    var BOOLEAN_TRUE = true,
        isObject = _.isObject;
    describe('Ajax', function () {
        var ajax;
        beforeEach(function () {
            ajax = factories.Ajax();
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
    });
});