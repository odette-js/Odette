application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var buster, iframe, count, handler = function () {
            count++;
        },
        contextHandler = function (expects) {
            return function () {
                count += (expects === this);
            };
        },
        framed_pathway = '/test/' + (app.BROWSERSTACKING ? 'browserstack/' : '') + 'framed.html',
        pagePromise = factories.HTTP.get('/test/framed.html');
    _.describe('Buster', function () {
        _.beforeEach(function () {
            count = 0;
        });
        _.describe('can receive messages on', function () {
            _.it('unfriendly windows', function (done) {
                var iframe = $.createElement('iframe');
                documentView.directive('RegionManager').get('main').el.append(iframe);
                var buster = scopedFactories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8000' + framed_pathway
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
            _.it('windows without a source', function (done) {
                pagePromise.success(function (response) {
                    var iframe = $.createElement('iframe');
                    documentView.directive('RegionManager').get('main').el.append(iframe);
                    var buster = scopedFactories.Buster(window, iframe, {
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
            _.it('friendly windows', function (done) {
                var iframe = $.createElement('iframe');
                documentView.directive('RegionManager').get('main').el.append(iframe);
                var buster = scopedFactories.Buster(window, iframe, {
                    iframeSrc: 'http://localhost:8080' + framed_pathway
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
//