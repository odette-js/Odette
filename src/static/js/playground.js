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
        tagName: _.returns('li'),
        attributes: {
            class: 'profile'
        },
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
        template: $.compile(function () {
            return [
                ["h3", null, this.name, {
                    key: "company_name"
                }],
                ["ul", {
                        class: "employees"
                    },
                    null, {
                        key: "employees"
                    }
                ]
            ];
        }),
        attributes: {
            class: 'employees-container'
        },
        ui: {
            title: 'company_name'
        },
        regions: {
            employees: 'employees'
        }
    });
    documentView.addRegion({
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
        console.log(speclessView);
    });
    window.$ = $;
});