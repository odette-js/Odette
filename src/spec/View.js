application.scope().run(window, function (module, app, _, factories, $) {
    test.describe('View', function () {
        var view, complexView, count, ComplexView = $.View.extend({
            ui: {
                there: '.here',
                r: '.region-here'
            },
            events: {
                'sometrigger': 'dosomething'
            },
            elementEvents: {
                'click @there': 'doThis'
            },
            elementTriggers: {
                'click': 'sometrigger'
            },
            regions: {
                reg: 'r'
            },
            dosomething: function () {
                count++;
            },
            doThis: function () {
                count++;
            },
            template: function () {
                return [
                    ['span'],
                    ['div.here'],
                    ['div.region-here', {
                        key: 'r'
                    }, false]
                ];
            }
        });
        $.documentView.addRegion('main', '.test-div');

        function insert() {
            $.documentView.addChildView('main', complexView);
        }
        test.beforeEach(function () {
            count = 0;
            view = $.View();
            complexView = ComplexView();
        });
        test.afterEach(function () {
            view.destroy();
            complexView.destroy();
        });
        test.it('is an object', function () {
            test.expect(_.isObject(view)).toEqual(true);
            test.expect(_.isInstance(view, $.View)).toEqual(true);
        }, 2);
        test.it('has an element that you can interact with', function () {
            test.expect(_.isInstance(view.el, factories.DomManager)).toEqual(true);
        }, 1);
        test.it('can even have extra elements tied to it... but only when it is rendered', function () {
            test.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            test.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
        }, 2);
        test.it('can be rendered', function () {
            test.expect(complexView.el.html()).toEqual('');
            complexView.render();
            test.expect(complexView.el.html()).not.toEqual('');
        }, 2);
        test.it('can be attached to a region', function () {
            test.expect(complexView.el.element().parentNode).toEqual(null);
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(complexView.el.element().parentNode).not.toEqual(null);
        }, 2);
        test.it('can have extra elements', function () {
            test.expect(_.isObject(complexView.ui)).toEqual(true);
            test.expect(_.isString(complexView.ui.there)).toEqual(true);
            complexView.render();
            test.expect(_.isInstance(complexView.ui.there, factories.DOMA)).toEqual(true);
            test.expect(complexView.ui.there.length()).toEqual(1);
        }, 4);
        test.it('can also attach events to it\'s element', function () {
            test.expect(count).toEqual(0);
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(count).toEqual(0);
            complexView.el.click();
            test.expect(count).toEqual(1);
            complexView.render();
            test.expect(count).toEqual(1);
            complexView.el.click();
            test.expect(count).toEqual(2);
        }, 5);
        test.it('as well as it\'s ui elements', function () {
            test.expect(count).toEqual(0);
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(count).toEqual(0);
            complexView.ui.there.click();
            test.expect(count).toEqual(2);
            complexView.render();
            test.expect(count).toEqual(2);
            complexView.ui.there.click();
            test.expect(count).toEqual(4);
        }, 5);
        test.it('views can be detached', function () {
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(count).toEqual(0);
            complexView.ui.there.click();
            test.expect(count).toEqual(2);
            complexView.remove();
            test.expect(count).toEqual(2);
        }, 3);
        test.it('and still keep their elements and events intact', function () {
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(count).toEqual(0);
            complexView.ui.there.click();
            test.expect(count).toEqual(2);
            complexView.remove();
            test.expect(count).toEqual(2);
            complexView.ui.there.click();
            test.expect(count).toEqual(4);
        }, 4);
        test.it('they can even be reattached', function () {
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(count).toEqual(0);
            complexView.ui.there.click();
            test.expect(count).toEqual(2);
            complexView.remove();
            test.expect(count).toEqual(2);
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(count).toEqual(2);
            complexView.ui.there.click();
            test.expect(count).toEqual(4);
        }, 5);
        test.it('when they are destroyed however, their events are detached from the element and the view is automatically removed', function () {
            $.documentView.directive('RegionManager').get('main').add(complexView);
            test.expect(count).toEqual(0);
            // cache it so we can access it after the view has been destroyed
            var there = complexView.ui.there;
            there.click();
            test.expect(count).toEqual(2);
            complexView.destroy();
            test.expect(count).toEqual(2);
            there.click();
            test.expect(count).toEqual(2);
        }, 4);
        test.it('when rendering a view, if a false is passed, then it will leave the children alone', function () {
            var LeftAloneView = $.View.extend({
                template: _.returns(false)
            });
            var leftAloneView = LeftAloneView();
            var newdiv = $.createElement('div');
            leftAloneView.render();
            leftAloneView.el.append(newdiv);
            leftAloneView.render();
            test.expect(leftAloneView.el.children().length()).toEqual(1);
        }, 1);
        test.it('when rendering a view if a string is passed, the children will be overwritten', function () {
            var EmptiedView = $.View.extend({
                template: _.returns('')
            });
            var emptiedView = EmptiedView();
            var newdiv2 = $.createElement('div');
            emptiedView.render();
            emptiedView.el.append(newdiv2);
            emptiedView.render();
            test.expect(emptiedView.el.children().length()).toEqual(0);
        }, 1);
        test.it('also allows for triggers to be connected and piped through from element to view', function () {
            $.documentView.directive('RegionManager').get('main').add(complexView);
            var el = complexView.el;
            el.click();
            test.expect(count).toEqual(1);
            complexView.dispatchEvent('sometrigger');
            test.expect(count).toEqual(2);
            complexView.destroy();
            test.expect(count).toEqual(2);
            el.click();
            test.expect(count).toEqual(2);
        }, 4);
        // test.it('can define regions to be created on the view', function () {
        //     insert();
        //     test.expect(1).toBe(1);
        // }, 1);
    });
});