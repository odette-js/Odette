application.scope().run(function (app, _, factories) {
    _.describe('View', function () {
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
        app.RegionManager.add('main', '.test-div');
        _.beforeEach(function () {
            count = 0;
            view = factories.View();
            complexView = ComplexView();
        });
        _.afterEach(function () {
            view.destroy();
            complexView.destroy();
        });
        _.it('is an object', function () {
            _.expect(_.isObject(view)).toEqual(true);
            _.expect(_.isInstance(view, factories.View)).toEqual(true);
        });
        _.it('has an element that you can interact with', function () {
            _.expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
            window.readytostop = true;
        });
        // this test is invalid because there should be no ui available before render
        _.it('can even have extra elements tied to it... but only when it is rendered', function () {
            _.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            _.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
        });
        _.it('can be rendered', function () {
            _.expect(complexView.el.html()).toEqual('');
            complexView.render();
            _.expect(complexView.el.html()).not.toEqual('');
        });
        _.it('can be attached to a region', function () {
            _.expect(returnsElement(complexView.el).parentNode).toEqual(null);
            app.RegionManager.get('main').add(complexView);
            _.expect(returnsElement(complexView.el).parentNode).not.toEqual(null);
        });
        _.it('can be filtered', function () {
            _.expect(returnsElement(complexView.el).parentNode).toEqual(null);
            complexView.filter = function () {
                return false;
            };
            app.RegionManager.get('main').add(complexView);
            _.expect(returnsElement(complexView.el).parentNode).toEqual(null);
        });
        _.it('can have extra elements', function () {
            _.expect(_.isObject(complexView.ui)).toEqual(true);
            _.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            _.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
            _.expect(complexView.ui.there.length()).toEqual(1);
        });
        _.it('can also attach events to it\'s element', function () {
            _.expect(count).toEqual(0);
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.el.click();
            _.expect(count).toEqual(1);
            complexView.render();
            _.expect(count).toEqual(1);
            complexView.el.click();
            _.expect(count).toEqual(2);
        });
        _.it('as well as it\'s ui elements', function () {
            _.expect(count).toEqual(0);
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.render();
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('views can be detached', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
        });
        _.it('and still keep their elements and events intact', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('they can even be reattached', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('when they are destroyed however, their events are detached from the element and the view is automatically removed', function () {
            app.RegionManager.get('main').add(complexView);
            _.expect(count).toEqual(0);
            var there = complexView.ui.there;
            there.click();
            _.expect(count).toEqual(1);
            complexView.destroy();
            _.expect(count).toEqual(1);
            there.click();
            _.expect(count).toEqual(1);
        });
    });
});