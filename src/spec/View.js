application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.describe('View', function () {
        var view, complexView, count, ComplexView = scopedFactories.View.extend({
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
                return [
                    ['span'],
                    ['div', {
                            class: 'here'
                        },
                        null
                    ]
                ];
            }
        });
        documentView.addRegion('main', '.test-div');
        _.beforeEach(function () {
            count = 0;
            view = scopedFactories.View();
            complexView = ComplexView();
        });
        _.afterEach(function () {
            view.destroy();
            complexView.destroy();
        });
        _.it('is an object', function () {
            _.expect(_.isObject(view)).toEqual(true);
            _.expect(_.isInstance(view, scopedFactories.View)).toEqual(true);
        });
        _.it('has an element that you can interact with', function () {
            _.expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
        });
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
            _.expect(complexView.el.element().parentNode).toEqual(null);
            documentView.directive('RegionManager').get('main').add(complexView);
            _.expect(complexView.el.element().parentNode).not.toEqual(null);
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
            documentView.directive('RegionManager').get('main').add(complexView);
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
            documentView.directive('RegionManager').get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.render();
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('views can be detached', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
        });
        _.it('and still keep their elements and events intact', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('they can even be reattached', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.expect(count).toEqual(0);
            complexView.ui.there.click();
            _.expect(count).toEqual(1);
            complexView.remove();
            _.expect(count).toEqual(1);
            documentView.directive('RegionManager').get('main').add(complexView);
            _.expect(count).toEqual(1);
            complexView.ui.there.click();
            _.expect(count).toEqual(2);
        });
        _.it('when they are destroyed however, their events are detached from the element and the view is automatically removed', function () {
            documentView.directive('RegionManager').get('main').add(complexView);
            _.expect(count).toEqual(0);
            // cache it so we can access it after the view has been destroyed
            var there = complexView.ui.there;
            there.click();
            _.expect(count).toEqual(1);
            complexView.destroy();
            _.expect(count).toEqual(1);
            there.click();
            _.expect(count).toEqual(1);
        });
        _.it('when rendering a view, if a false is passed, then it will leave the children alone', function () {
            var LeftAloneView = scopedFactories.View.extend({
                template: _.returns(false)
            });
            var leftAloneView = LeftAloneView();
            var newdiv = $.createElement('div');
            leftAloneView.render();
            leftAloneView.el.append(newdiv);
            leftAloneView.render();
            _.expect(leftAloneView.el.children().length()).toEqual(1);
        });
        _.it('when rendering a view if a string is passed, the children will be overwritten', function () {
            var EmptiedView = scopedFactories.View.extend({
                template: _.returns('')
            });
            var emptiedView = EmptiedView();
            var newdiv2 = $.createElement('div');
            emptiedView.render();
            emptiedView.el.append(newdiv2);
            emptiedView.render();
            _.expect(emptiedView.el.children().length()).toEqual(0);
        });
    });
});