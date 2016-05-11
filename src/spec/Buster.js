application.scope().run(function (app, _, factories) {
    var buster, iframe, count, handler = function () {
            count++;
        },
        contextHandler = function (expects) {
            return function () {
                count += (expects === this);
            };
        },
        pagePromise = factories.HTTP.get('/test/framed.html');
    _.describe('Buster', function () {
        _.beforeEach(function () {
            count = 0;
        });
        _.describe('can understand unfriendly windows', function () {
            _.it('can receive messages on windows', function (done) {
                var iframe = $.createElement('iframe');
                app.RegionManager.get('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.expect(e.data().success).toEqual(true);
                    _.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
        });
        _.describe('and windows without a source', function () {
            _.it('can receive messages on windows', function (done) {
                pagePromise.success(function (response) {
                    console.log('time to stop');
                    var iframe = $.createElement('iframe');
                    app.RegionManager.get('main').el.append(iframe);
                    var buster = factories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.sync(function (e) {
                        _.expect(count).toEqual(1);
                    });
                    buster.create('delayed').response(handler).deferred(function (e) {
                        _.expect(e.data().success).toEqual(true);
                        _.expect(count).toEqual(2);
                        iframe.destroy(done);
                    }).send();
                });
            });
        });
        _.describe('can understand friendly windows', function () {
            _.it('can receive messages on windows', function (done) {
                var iframe = $.createElement('iframe');
                app.RegionManager.get('main').el.append(iframe);
                var buster = factories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8080/test/framed.html'
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.expect(e.data().success).toEqual(true);
                    _.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
        });
    });
});