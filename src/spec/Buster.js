application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var buster, iframe, count, handler = function () {
            count++;
        },
        contextHandler = function (expects) {
            return function () {
                count += (expects === this);
            };
        },
        protocol = window.location.protocol,
        framed_pathway = '/test/' + (app.BROWSERSTACKING ? 'browserstack/' : '') + 'framed.html',
        pagePromise = factories.HTTP.get('/test/framed.html');
    // testing from same server across different origins
    if (!window.location.port) {
        return;
    }
    _.test.describe('Buster', function () {
        _.test.beforeEach(function () {
            count = 0;
        });
        _.test.describe('can receive messages on', function () {
            _.test.it('unfriendly windows', function (done) {
                var iframe = $.createElement('iframe');
                documentView.directive('RegionManager').get('main').el.append(iframe);
                var split = window.location.origin.split(':');
                var buster = scopedFactories.Buster(window, iframe, {
                    iframeSrc: window.location.protocol + '//' + window.location.hostname + ':' + 9000 + framed_pathway
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.test.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.test.expect(e.data().success).toEqual(true);
                    _.test.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
            _.test.it('windows without a source', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    documentView.directive('RegionManager').get('main').el.append(iframe);
                    var buster = scopedFactories.Buster(window, iframe, {
                        iframeContent: response
                    });
                    buster.connected(handler);
                    buster.sync(function (e) {
                        _.test.expect(count).toEqual(1);
                    });
                    buster.create('delayed').response(handler).deferred(function (e) {
                        _.test.expect(e.data().success).toEqual(true);
                        _.test.expect(count).toEqual(2);
                        iframe.destroy(done);
                    }).send();
                });
            });
            _.test.it('friendly windows', function (done) {
                var iframe = $.createElement('iframe');
                documentView.directive('RegionManager').get('main').el.append(iframe);
                var buster = scopedFactories.Buster(window, iframe, {
                    iframeSrc: window.location.origin + framed_pathway
                });
                buster.connected(handler);
                buster.sync(function (e) {
                    _.test.expect(count).toEqual(1);
                });
                buster.create('delayed').response(handler).deferred(function (e) {
                    _.test.expect(e.data().success).toEqual(true);
                    _.test.expect(count).toEqual(2);
                    iframe.destroy(done);
                }).send();
            });
        });
    });
});