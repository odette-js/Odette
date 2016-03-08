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
            it('can receive messages on windows', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    expect(count).toEqual(1);
                    iframe.destroy();
                    done();
                });
            });
            it('as well as deferred messages', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000/test/framed.html'
                });
                buster.connected(handler);
                buster.create('delayed').response(function () {
                    console.log('response: delayed');
                    handler();
                }).deferred(function (e) {
                    console.log('deferred: delayed');
                    expect(e.data().success).toEqual(true);
                    expect(count).toEqual(2);
                    iframe.destroy();
                    done();
                }).send();
            });
        });
        describe('and windows without a source', function () {
            it('can receive messages on windows', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    app.getRegion('main').el.append(iframe);
                    var buster = factories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.sync(function (e) {
                        expect(count).toEqual(1);
                        iframe.destroy();
                        done();
                    });
                });
            });
            it('as well as deferred messages', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    app.getRegion('main').el.append(iframe);
                    var buster = factories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.create('delayed').response(handler).deferred(function (e) {
                        expect(e.data().success).toEqual(true);
                        expect(count).toEqual(2);
                        iframe.destroy();
                        done();
                    }).send();
                });
            });
        });
        describe('can understand friendly windows', function () {
            it('can receive messages on windows', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8080/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    expect(count).toEqual(1);
                    iframe.destroy();
                    done();
                });
            });
            it('as well as deferred messages', function (done) {
                var iframe = $.createElement('iframe');
                app.getRegion('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8080/test/framed.html'
                });
                buster.connected(handler);
                buster.create('delayed').response(handler).deferred(function (e) {
                    expect(e.data().success).toEqual(true);
                    expect(count).toEqual(2);
                    iframe.destroy();
                    done();
                }).send();
            });
        });
    });
});