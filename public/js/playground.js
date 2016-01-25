application.scope().module('playground', function (module, app, _, factories, $) {
    // console.log(arguments);
    var SomeView = factories.View.extend({});
    var someview = SomeView();
    app.addRegion({
        main: '#main-region'
    });
    // var main = factories.Region();
    console.log(app.regionManager);
});