application.scope().run(function (app, _, factories) {
    describe('View', function () {
        var view, complexView, count, ComplexView = factories.View.extend({
            ui: {
                there: '.here'
            },
            elementEvents: {
                'click @ui.there': 'doThis'
            },
            doThis: function () {
                count++;
            },
            template: function () {
                return '<span></span><div class="here"></div>';
            }
        });
        app.addRegion('main', '.test-div');
        beforeEach(function () {
            count = 0;
            view = factories.View();
            complexView = ComplexView();
        });
        afterEach(function () {
            view.destroy();
            complexView.destroy();
        });
        it('is an object', function () {
            expect(_.isObject(view)).toEqual(true);
            expect(_.isInstance(view, factories.View)).toEqual(true);
        });
        it('has an element that you can interact with', function () {
            expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
            window.readytostop = true;
        });
        // this test is invalid because there should be no ui available before render
        // it('can even have extra elements tied to it... but only when it is rendered', function () {
        //     expect(_.isString(complexView.ui.there)).toEqual(true);
        //     complexView.render();
        //     expect(_.isInstance(complexView.ui.there, factories.DOMM)).toEqual(true);
        // });
        it('can be rendered', function () {
            expect(complexView.el.html()).toEqual('');
            complexView.render();
            expect(complexView.el.html()).not.toEqual('');
        });
        it('can be attached to a region', function () {
            expect(complexView.el.element().parentNode).toEqual(null);
            app.getRegion('main').add(complexView);
            expect(complexView.el.element().parentNode).not.toEqual(null);
        });
        it('can be filtered', function () {
            expect(complexView.el.element().parentNode).toEqual(null);
            complexView.filter = false;
            app.getRegion('main').add(complexView);
            expect(complexView.el.element().parentNode).toEqual(null);
        });
        it('can have extra elements', function () {
            // expect(_.isObject(complexView.ui)).toEqual(true);
            // expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            expect(_.isInstance(complexView.ui.there, factories.DOMM)).toEqual(true);
            expect(complexView.ui.there.length()).toEqual(1);
        });
        it('can also attach events to it\'s element', function () {
            expect(count).toEqual(0);
            app.getRegion('main').add(complexView);
            expect(count).toEqual(0);
            complexView.el.click();
            expect(count).toEqual(1);
            complexView.render();
            expect(count).toEqual(1);
            complexView.el.click();
            expect(count).toEqual(2);
        });
        it('as well as it\'s ui elements', function () {
            expect(count).toEqual(0);
            app.getRegion('main').add(complexView);
            expect(count).toEqual(0);
            complexView.ui.there.click();
            expect(count).toEqual(1);
            complexView.render();
            expect(count).toEqual(1);
            complexView.ui.there.click();
            expect(count).toEqual(2);
        });
    });
});