application.scope().run(function (app, _) {
    var factories = _.factories;
    var registry = _.associator;
    describe('Registry', function () {
        beforeEach(function () {});
        it('is made by the specless object', function () {
            expect(_.isInstance(registry, factories.Associator)).toEqual(true);
        });
        it('is not a collection', function () {
            expect(_.isInstance(registry, factories.Collection)).toEqual(false);
        });
        // it('can get any object\'s data', function () {
        //     expect(_.has(registry.get(window), 'dataset')).toEqual(true);
        // });
        it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            expect(registry.get(window).some).toEqual('data');
        });
        it('can also get any group of data that the same type', function () {
            var one = {},
                two = {};
            registry.set(one, {
                one: 1
            });
            registry.set(two, {
                two: 2
            });
            expect(_.keys(registry.sameType(two).__elid__).length).toEqual(2);
        });
    });
});