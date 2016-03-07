application.scope().run(function (app, _, factories) {
    var buster, iframe, count, handler = function () {
            count++;
        },
        contextHandler = function (expects) {
            return function () {
                count += (expects === this);
            };
        },
        pagePromise = _.get('/test/framed.html');
    describe('Buster', function () {
        beforeEach(function () {
            count = 0;
        });
        describe('can understand unfriendly windows', function () {
            beforeEach(function () {
                count = 0;
                iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000/test/framed.html'
                });
            });
            afterEach(function () {
                iframe.destroy();
            });
            it('can receive messages on windows', function (done) {
                buster.connected(handler);
                var message = buster.sync(function (e) {
                    expect(count).toEqual(1);
                    expect(e.origin).toEqual(message);
                }).response(done);
            });
            it('as well as deferred messages', function (done) {
                buster.connected(handler);
                var message = buster.connected(handler).send('delayed').response(handler).deferred(function (e) {
                    expect(e.data().success).toEqual(true);
                    expect(count).toEqual(3);
                    done();
                });
            });
        });
        describe('and windows without a source', function () {
            beforeEach(function (done) {
                pagePromise.success(function (response) {
                    count = 0;
                    iframe = $.createElement('iframe');
                    app.getRegion('main').el.append(iframe);
                    buster = factories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    done();
                });
            });
            afterEach(function () {
                iframe.destroy();
            });
            it('can receive messages on windows', function (done) {
                buster.connected(handler);
                buster.sync(function (e) {
                    expect(count).toEqual(1);
                    expect(e.origin).toEqual(this);
                }).response(done);
            });
            it('as well as deferred messages', function (done) {
                buster.connected(handler);
                var message = buster.send('delayed').response(handler).deferred(function (e) {
                    expect(e.data().success).toEqual(true);
                    expect(count).toEqual(2);
                    done();
                });
            });
        });
        // describe('can understand friendly windows', function () {
        //     var stopHere;
        //     beforeEach(function () {
        //         count = 0;
        //         iframe = $.createElement('iframe');
        //         if (stopHere) {
        //             debugger;
        //         }
        //         app.getRegion('main').el.append(iframe);
        //         buster = factories.Buster(window, iframe, {
        //             iframeSrc: 'http://localhost:8080/test/framed.html'
        //         });
        //     });
        //     afterEach(function () {
        //         iframe.destroy();
        //     });
        //     it('can receive messages on windows', function (done) {
        //         buster.connected(handler);
        //         var message = buster.sync(function (e) {
        //             expect(count).toEqual(1);
        //             expect(e.origin).toEqual(message);
        //             stopHere = true;
        //         }).response(done);
        //     });
        //     it('as well as deferred messages', function (done) {
        //         buster.connected(handler);
        //         var message = buster.send('delayed').response(handler).deferred(function (e) {
        //             expect(e.data().success).toEqual(true);
        //             expect(count).toEqual(2);
        //             done();
        //         });
        //     });
        // });
    });
});