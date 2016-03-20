application.scope().run(function (app, _, factories) {
    var registry = factories.Associator();
    _.describe('Registry', function () {
        _.beforeEach(function () {});
        _.it('is made by the specless object', function () {
            _.expect(_.isInstance(registry, factories.Associator)).toEqual(true);
        });
        _.it('is not a collection', function () {
            _.expect(_.isInstance(registry, factories.Collection)).toEqual(false);
        });
        _.it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            _.expect(registry.get(window).some).toEqual('data');
        });
        _.it('can also get any group of data that the same type', function () {
            var one = {},
                two = {};
            registry.set(one, {
                one: 1
            });
            registry.set(two, {
                two: 2
            });
            _.expect(_.keys(registry.sameType(two).__elid__).length).toEqual(2);
        });
    });
});