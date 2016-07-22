application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var registry = factories.Associator();
    _.test.describe('Registry', function () {
        _.test.beforeEach(function () {});
        _.test.it('is made by the specless object', function () {
            _.test.expect(_.isInstance(registry, factories.Associator)).toEqual(true);
        });
        _.test.it('is not a collection', function () {
            _.test.expect(_.isInstance(registry, factories.Collection)).toEqual(false);
        });
        _.test.it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            _.test.expect(registry.get(window).some).toEqual('data');
        });
        _.test.it('can also get any group of data that the same type', function () {
            var one = {},
                two = {};
            registry.set(one, {
                one: 1
            });
            registry.set(two, {
                two: 2
            });
            _.test.expect(_.keys(registry.sameType(two).__elid__).length).toEqual(2);
        });
    });
});