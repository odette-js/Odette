application.scope().run(window, function (module, app, _, factories, $) {
    // var console = _.console;
    // var Company = factories.Model.extend({
    //     idAttribute: _.returns('name')
    // });
    // var Person = factories.Model.extend({
    //     idAttribute: _.returns('first_name'),
    //     defaults: function () {
    //         return {
    //             clicks: 0
    //         };
    //     }
    // });
    // var PersonInfo = $.View.extend({
    //     template: $.compile('profile-extended'),
    //     tagName: _.returns('div'),
    // });
    // var PersonView = $.View.extend({
    //     Model: Person,
    //     template: $.compile('profile-summary'),
    //     tagName: _.returns('li'),
    //     attributes: {
    //         class: 'profile'
    //     },
    //     elementEvents: {
    //         click: 'incrementClicks'
    //     },
    //     incrementClicks: function () {
    //         var model = this.model;
    //         model.set({
    //             clicks: model.get('clicks') + 1
    //         });
    //     },
    //     region: {
    //         info: '.info-container'
    //     }
    // });
    // var ViewContainer = $.View.extend({
    //     Child: PersonView,
    //     Model: Company,
    //     template: $.compile(function () {
    //         return [
    //             ["h3", null, this.name],
    //             ["ul", {
    //                     class: "employees"
    //                 },
    //                 null, {
    //                     key: "list"
    //                 }
    //             ]
    //         ];
    //     }),
    //     attributes: {
    //         class: 'employees-container'
    //     },
    //     ui: {
    //         title: 'h3'
    //     },
    //     regions: {
    //         employees: 'list'
    //     }
    // });
    // $.documentView.addRegion({
    //     summaries: '#main-region'
    // });
    // $.HTTP('/json/data.json').then(function (data) {
    //     var summaries = app.directive('RegionManager').get('summaries');
    //     var speclessView = ViewContainer({
    //         model: {
    //             name: 'Specless',
    //             type: 'inc'
    //         }
    //     });
    //     speclessView.addChildView('employees', data);
    //     $.documentView.addChildView('summaries', speclessView);
    //     console.log(speclessView);
    // });
    // window.$ = $;
    // var app = require('odette');
    // var os = require('os');
    // app.run(window, function (m, app, _, factories, $) {
    // module.exports = render;
    setInterval(function () {
        project = 'thing';
        body.render();
    }, 1000)
    var project = '';
    var Main = $.View.extend({
        template: bodyTemplate,
        ui: {
            compile: '.trigger-compile',
            input: '.project-input',
            choose: '.project-chooser',
            logs: '.log-list',
            newProject: '.create-new-project'
        },
        regions: {
            logs: 'logs'
        },
        elementEvents: {
            // 'click @ui.compile': 'compile',
            // 'click @ui.choose': 'chooseRoot',
            // 'change @ui.input': function (e) {
            //     var $target = this.owner$.returnsManager(e.currentTarget);
            //     var value = $target.prop('value');
            //     this.updateProject(value);
            // },
            // 'click @ui.newProject': 'createNewProject'
        }
        // ,
        // createNewProject: function () {
        //     return createFolder({
        //         defaultPath: path.join(state.read('project'), '..')
        //     }).then(function (result) {
        //         console.log(result);
        //         makeFolder();
        //     });
        // },
        // chooseRoot: function () {
        //     var body = this;
        //     return chooseFolder(['openDirectory']).then(function (folder) {
        //         return body.updateProject(folder);
        //     });
        // },
        // updateProject: function (value) {
        //     var view = this;
        //     return updateProject(value).then(function () {
        //         view.render();
        //     });
        // },
        // compile: function () {
        //     var view = this;
        //     compilingRender(view, true);
        //     return cli.compile().then(function () {
        //         compilingRender(view, false);
        //     }).catch(function (e) {
        //         console.log(e);
        //     });
        // }
    });
    var body = Main();
    body.addChildView('logs', []);
    $.documentView.addRegion('app', '#app');
    $.documentView.addChildView('app', body);

    function bodyTemplate() {
        return [].concat([
            ['div', {
                    class: 'form-control'
                },
                projectInfoAndSetter(project)
            ]
        ], ifProject(project, [
            ['button', {
                class: 'trigger-compile'
            }, this.is('compiling') ? 'Compiling' : 'Compile']
        ]), [
            ['button', {
                class: 'create-new-project'
            }, 'Create new project', {
                key: 'create-new-project'
            }]
        ], [
            ['div', {
                class: 'log-list'
            }, false, {
                key: 'logs'
            }]
        ]);
    }

    function ifProject(project, list) {
        return project ? list : [];
    }

    function projectInfoAndSetter(project) {
        return [].concat(ifProject(project, [
            ['div', {
                class: 'project-input'
            }, project]
        ]), [
            ['button', {
                class: 'project-chooser'
            }, 'Choose']
        ]);
    }

    function buildFolderTree(folder) {
        return _.map(folder.split('/'), function (folder, index) {
            return '    '.repeat(index) + folder;
        }).slice(1).join('\n')
    }

    function compilingRender(view, bool) {
        view.remark('compiling', bool);
        view.render();
    }

    function render() {
        body.render();
    }

    function createFolder(options) {
        return _.Promise(function (success, failure) {
            electron.remote.dialog.showSaveDialog({
                options: options
            }, function (folders) {
                if (folders) {
                    success(folders);
                } else {
                    failure();
                }
            });
        });
    }

    function chooseFolder(properties) {
        return _.Promise(function (success, failure) {
            electron.remote.dialog.showOpenDialog({
                'properties': properties || []
            }, function (folders_) {
                var folder, folders = folders_;
                if (!_.isArray(folders)) {
                    return failure();
                }
                if (!_.isString((folder = folders[0]))) {
                    return failure();
                }
                success(folder);
            });
        });
    }

    function updateProject(value) {
        return state.save({
            project: value
        });
    }
    // });
});