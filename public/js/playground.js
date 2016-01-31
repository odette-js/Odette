application.scope().module('playground', function (module, app, _, factories, $) {
    window.app = app;
    window._ = _;
    window.factories = factories;
    window.$ = $;
    var SomeView = factories.View.extend({
        className: 'some',
        template: _.compile('#basic'),
        regions: function () {
            return {
                high: '.region-1',
                tight: '.region-2'
            };
        }
    });
    app.addRegion({
        main: '#main-region'
    });
    var topLayer = app.getRegion('main');
    var middleLayer = SomeView();
    var middleHighRegion = middleLayer.getRegion('high');
    var bottomLayer1 = SomeView();
    var bottomLayer2 = SomeView();
    var bottomLayer3 = SomeView();
    var bottomLayer4 = SomeView();
    middleHighRegion.add([bottomLayer1, bottomLayer2, bottomLayer3, bottomLayer4]);
    topLayer.add(middleLayer);
    topLayer.render();
});