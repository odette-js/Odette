application.scope().run(function (app, _, factories) {
    var buster, iframe, count, handler = function () {
            count++;
        },
        contextHandler = function (expects) {
            return function () {
                count += (expects === this);
            };
        };
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
                    iframeHref: 'http://localhost:8000/test/framed.html'
                });
            });
            afterEach(function () {
                iframe.destroy();
            });
            it('can receive messages on windows', function (done) {
                expect(_.isObject(buster)).toEqual(true);
                buster.connected(handler);
                buster.send('first', {
                    count: 0
                }).response(function () {
                    done();
                });
            });
        });
    });
});