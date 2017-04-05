application.scope().run(window, function (module, app, _, factories, $) {
    test.describe('Promise', function () {
        var madeit, promise, handler = function () {
            madeit++;
        };
        test.beforeEach(function () {
            madeit = 0;
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
                test.expect(e).toBeObject();
                test.expect(e.message).toBe("invalid result detected");
                return "default value";
            }).then(function (result) {
                test.expect(result).toEqual("default value"); // true
                done();
            });
        }, 3);
        test.it('also handles chainging different n promises together', function (done) {
            var counter = 0;
            _.Promise(function (success, failure) {
                setTimeout(success, 0);
                counter++;
            }).then(function () {
                test.expect(counter).toEqual(1);
                return runMany();
            }).catch(function () {
                counter++;
                return {};
            }).then(function () {
                test.expect(counter).toEqual(1);
                return _.Promise(function (success, failure) {
                    setTimeout(success);
                });
            }).catch(function () {
                console.log('should not have run');
            }).then(function () {
                counter++;
                window.consolable = true;
                return runMany(2);
            }).catch(function (res) {
                test.expect(res).toBe(3);
                test.expect(counter).toBe(2);
            }).then(function () {
                test.expect(counter).toEqual(2);
                done();
            });

            function runMany(fails) {
                return _.Promise.all(_.map([1, 2, 3, 4], function (value, index) {
                    return _.Promise(function (success, failure) {
                        if (index === fails) {
                            setTimeout(function () {
                                failure(value);
                            }, value);
                        } else {
                            setTimeout(success, value);
                        }
                    });
                }));
            }
        }, 5);
    });
});