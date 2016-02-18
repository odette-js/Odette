application.scope().module('playground', function (module, app, _, factories, $) {
    var data = [{
        text: 'there'
    }, {
        text: 'where'
    }, {
        text: 'there'
    }, {
        text: 'overthere'
    }];
    var moarData = [{
        text: 'there'
    }, {
        text: 'where'
    }, {
        text: 'there'
    }, {
        text: 'overthere'
    }];
    var SomeParentView = factories.View.extend({
        className: 'some',
        template: _.compile('basic'),
        regions: {
            high: '.region-1',
            tight: '.region-2'
        },
        ui: {
            spanner: 'span'
        },
        elementTriggers: {
            'click @ui.spanner': 'external:event'
        }
    });
    app.addRegion({
        main: '#main-region'
    });
    var topLayer = app.getRegion('main');
    var middleLayer = SomeParentView({
        model: factories.Container({
            text: 'here'
        })
    });
    var middleHighRegion = middleLayer.getRegion('high');
    middleHighRegion.Child = SomeParentView;
    middleHighRegion.add(data);
    var middleTightRegion = middleLayer.getRegion('tight');
    middleTightRegion.Child = SomeParentView;
    middleTightRegion.add(moarData);
    topLayer.add(middleLayer);
});