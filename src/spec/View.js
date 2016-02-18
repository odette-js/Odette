application.scope().run(function (app, _, factories, $) {
    describe('View', function () {
        var view, complexView, ComplexView = factories.View.extend({
            ui: {
                there: '.here'
            },
            template: function () {
                return '<span></span><div class="here"></div>';
            }
        });
        app.addRegion('main', '.test-div');
        beforeEach(function () {
            view = factories.View();
            complexView = ComplexView();
        });
        it('is an object', function () {
            expect(_.isObject(view)).toEqual(true);
            expect(_.isInstance(view, factories.View)).toEqual(true);
        });
        it('has an element that you can interact with', function () {
            expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
        });
        it('can even have extra elements tied to it... but only when it is rendered', function () {
            expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            expect(_.isInstance(complexView.ui.there, factories.DOMM)).toEqual(true);
        });
        it('can be rendered', function () {
            expect(complexView.el.html()).toEqual('');
            complexView.render();
            expect(complexView.el.html()).not.toEqual('');
        });
        it('can be attached to a region', function () {
            expect(complexView.el.unwrap().parentNode).toEqual(null);
            app.getRegion('main').add(complexView);
            expect(complexView.el.unwrap().parentNode).not.toEqual(null);
        });
        it('can be filtered', function () {
            expect(complexView.el.unwrap().parentNode).toEqual(null);
            complexView.filter = false;
            app.getRegion('main').add(complexView);
            expect(complexView.el.unwrap().parentNode).toEqual(null);
        });
    });
});