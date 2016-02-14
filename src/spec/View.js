application.scope().run(function (app, _, factories, $) {
    describe('View', function () {
        var view;
        beforeEach(function () {
            view = factories.View();
        });
        it('is an object', function () {
            expect(_.isObject(view)).toEqual(true);
        });
    });
});