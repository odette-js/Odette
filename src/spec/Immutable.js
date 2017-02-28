application.scope().block(function (app, _, factories) {
    test.describe('Immutable', function () {
        var Immutable = factories.Immutable,
            ImmutableMap = Immutable.Map,
            ImmutableCollection = Immutable.Collection;
        test.describe('objects come in 2 forms, which are parodies of js objects', function () {
            test.it('Map, which is like a js object', function () {
                test.expect(ImmutableMap().typeOf()).toBe('object');
            }, 1);
            test.it('Collection, which is like a js array', function () {
                test.expect(ImmutableCollection().toJSON()).toBeArray();
            }, 1);
        });
    });
});