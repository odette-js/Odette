application.scope().run(window, function (module, app, _, factories, documentView, scopedFactories, $) {
    test.describe('ElementWatcher', function () {
        var div, windo, doc, count, elWatcher;
        test.beforeEach(function () {
            div = $.createElement('div');
            $('body').append(div);
            elWatcher = elWatcher || factories.ElementWatcher();
            count = 0;
        });
        test.afterEach(function () {
            div.destroy();
            // elWatcher.observer().disconnect();
        });
        test.it('watches for element resizes', function (done) {
            elWatcher.observe(div, function (client) {
                test.expect(client).toBeObject();
                test.expect(client.height).toBe(50);
                test.expect(client.width).toBe(50);
                elWatcher.unobserve(div);
                done();
            });
            div.css({
                height: 50,
                width: 50
            });
        }, 3);
        test.it('can handle multiple callbacks on the same element', function (done) {
            elWatcher.observe(div, function (contentRect) {
                test.expect(contentRect.height).toBe(1);
                test.expect(contentRect.width).toBe(2);
                count++;
            });
            elWatcher.observe(div, function (contentRect) {
                test.expect(count).toBe(1);
                elWatcher.unobserve(div);
                done();
                // take all off
            });
            div.css({
                height: 1,
                width: 2
            });
        }, 3);
        test.it('watches multiple elements', function (done) {
            var div2 = $.createElement('div');
            $('body').append(div2);
            elWatcher.observe(div, function (client) {
                test.expect(client.height).toBe(1);
                test.expect(client.width).toBe(1);
            });
            elWatcher.observe(div2, function (client) {
                test.expect(client.height).toBe(2);
                test.expect(client.width).toBe(2);
                elWatcher.unobserve(div);
                elWatcher.unobserve(div2);
                done();
            });
            div.css({
                height: 1,
                width: 1
            });
            div2.css({
                height: 2,
                width: 2
            });
        }, 4);
        test.it('takes both DomManagers as well as elements and still ties the methods together correctly', function (done) {
            elWatcher.observe(div.element(), function (client) {
                test.expect(client.height).toBe(1);
                test.expect(client.width).toBe(1);
                count++;
            });
            elWatcher.observe(div, function (client) {
                test.expect(count).toBe(1);
                elWatcher.unobserve(div);
                done();
            });
            div.css({
                height: 1,
                width: 1
            });
        }, 3);
    });
});