application.scope().run(function (app, _, $) {
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
        it('can get any object\'s data', function () {
            expect(registry.get(window)).toEqual({
                dataset: {}
            });
        });
        it('can save data against pointers', function () {
            registry.set(window, {
                some: 'data'
            });
            expect(registry.get(window)).toEqual({
                dataset: {},
                some: 'data'
            });
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
            expect(registry.sameType(two)).toEqual({
                data: [{
                    dataset: {},
                    one: 1
                }, {
                    dataset: {},
                    two: 2
                }],
                items: [one, two],
                readData: 1
            });
        });
    });
});