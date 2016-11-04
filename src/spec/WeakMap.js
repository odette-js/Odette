application.scope().run(window, function (module, app, _, factories, documentView, scopedFactories, $) {
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
        test.it('can also get any group of data that the same type', function () {
            var one = {},
                two = {};
            registry.set(one, {
                one: 1
            });
            registry.set(two, {
                two: 2
            });
            test.expect(_.keys(registry.sameType(two).__elid__).length).toEqual(2);
        }, 1);
    });
});