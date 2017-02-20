application.scope().run(window, function (module, app, _, factories, $) {
    var registry = factories.WeakMap();
    test.describe('Registry', function () {
        test.beforeEach(function () {});
        test.it('is made by the specless object', function () {
            test.expect(registry).toBeInstance(factories.WeakMap);
        }, 1);
        test.it('is not a collection', function () {
            test.expect(registry).not.toBeInstance(factories.Collection);
        }, 1);
        test.it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            test.expect(registry.get(window).some).toEqual('data');
        }, 1);
    });
});