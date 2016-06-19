application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var console = _.console;
    var Company = factories.Model.extend({
        idAttribute: _.returns('name')
    });
    var Person = factories.Model.extend({
        idAttribute: _.returns('first_name'),
        defaults: function () {
            return {
                clicks: 0
            };
        }
    });
    var PersonView = scopedFactories.View.extend({
        Model: Person,
        template: $.compile('profile-summary'),
        className: _.returns('profile'),
        tagName: _.returns('li'),
        elementEvents: {
            click: 'incrementClicks'
        },
        incrementClicks: function () {
            this.model.set({
                clicks: this.model.get('clicks') + 1
            });
        }
    });
    var ViewContainer = scopedFactories.View.extend({
        Child: PersonView,
        Model: Company,
        template: $.compile('employees-container'),
        className: _.returns('employees-container'),
        regions: function () {
            return {
                employees: '.employees'
            };
        }
    });
    documentView.directive('RegionManager').add({
        summaries: '#main-region'
    });
    factories.HTTP('/json/data.json').success(function (data) {
        var summaries = app.directive('RegionManager').get('summaries');
        var speclessView = ViewContainer({
            model: {
                name: 'Specless',
                type: 'inc'
            }
        });
        speclessView.addChildView('employees', data);
        documentView.addChildView('summaries', speclessView);
        speclessView.render(_.returns(true));
        var employees = speclessView.getChildren('employees');
        var michael = employees.get('modelId', 'Michael');
        var michaelModel = michael.model;
        michaelModel.set('clicks', 2);
        console.log(speclessView);
    });
});