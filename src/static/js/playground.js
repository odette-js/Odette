application.scope().run(window, function (module, app, _, factories, $) {
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
            var model = this.model();
            model.set({
                clicks: model.get('clicks') + 1
            });
        }
    });
    var ViewContainer = scopedFactories.View.extend({
        Child: PersonView,
        Model: Company,
        template: $.compile(function () {
            return [
                ["h3", null, this.name],
                ["ul", {
                        class: "employees"
                    },
                    null, {
                        key: "list"
                    }
                ]
            ];
        }),
        attributes: {
            class: 'employees-container'
        },
        ui: {
            title: 'h3'
        },
        regions: {
            employees: 'list'
        }
    });
    documentView.addRegion({
        summaries: '#main-region'
    });
    $.HTTP('/json/data.json').then(function (data) {
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