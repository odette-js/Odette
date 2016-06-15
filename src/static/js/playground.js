application.scope().run(function (app, _, factories) {
    var Company = factories.Model.extend({
        idAttribute: _.returns('name')
    });
    var Person = factories.Model.extend({
        idAttribute: _.returns('first_name')
    });
    var PersonView = factories.View.extend({
        template: $.compile('profile-summary'),
        className: _.returns('profile'),
        Model: Person,
        tagName: _.returns('li')
    });
    var ViewContainer = factories.View.extend({
        Child: PersonView,
        template: $.compile('profile-summary-container'),
        className: _.returns('employees-container'),
        regions: function () {
            return {
                employees: '.employees'
            };
        }
    });
    app.addRegion({
        summaries: '#main-region'
    });
    var specless = Company({
        name: 'Specless',
        type: 'inc'
    });
    factories.HTTP('/json/data.json').success(function (data) {
        var summaries = app.getRegion('summaries');
        var speclessView = ViewContainer({
            model: specless
        });
        speclessView.addChildView('employees', data);
        app.addChildView('summaries', speclessView);
        console.log(speclessView);
    });
});