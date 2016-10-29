app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Model = factories.Model,
        Collection = factories.Collection,
        REQUIRE = 'require',
        MODULE = 'module',
        CAPITAL_MODULE = capitalize(MODULE),
        MODULE_MANAGER = CAPITAL_MODULE + 'Manager',
        MODULES = CAPITAL_MODULE + 's',
        STARTED = START + 'ed',
        INITIALIZED = 'initialized',
        INITIALIZED_COLON_SUBMODULE = INITIALIZED + COLON + 'sub' + MODULE,
        DEFINED = 'defined',
        notDefinedYetMessage = 'that module has not been ' + DEFINED + ' yet',
        startableMethods = {
            start: function (evnt) {
                var startable = this;
                if (!startable.is(STARTED)) {
                    startable.mark(STARTED);
                    startable[DISPATCH_EVENT](START, evnt);
                }
                return startable;
            },
            stop: function (evnt) {
                var startable = this;
                if (startable.is(STARTED)) {
                    startable.unmark(STARTED);
                    startable[DISPATCH_EVENT](STOP, evnt);
                }
                return startable;
            },
            toggle: function (evnt) {
                var startable = this;
                if (startable.is(STARTED)) {
                    startable[STOP](evnt);
                } else {
                    startable[START](evnt);
                }
                return startable;
            },
            restart: function (evnt) {
                var startable = this;
                if (startable.is(STARTED)) {
                    startable[STOP](evnt);
                }
                startable[START](evnt);
                return startable;
            }
        },
        Startable = factories.Startable = factories.Model.extend('Startable', startableMethods),
        doStart = function (e) {
            if (result(this, 'startWithParent')) {
                this[START](e);
            }
        },
        doStop = function (e) {
            if (result(this, 'stopWithParent')) {
                this[STOP](e);
            }
        },
        checks = function (app, list) {
            var exporting = [];
            duff(list, function (path) {
                var module = app.module(path);
                if (module.is(INITIALIZED)) {
                    exporting.push(module[EXPORTS]);
                }
            });
            return exporting[LENGTH] === list[LENGTH] ? exporting : BOOLEAN_FALSE;
        },
        Promise = _.Promise,
        moduleMethods = {
            run: function (windo_, fn_) {
                var result, module = this,
                    fn = isWindow(windo_) ? fn_ : windo_,
                    windo = fn === windo_ ? window : windo_;
                if (isFunction(fn)) {
                    result = fn.apply(module, module.createArguments(windo));
                }
                return result === UNDEFINED ? module : result;
            },
            publicize: intendedApi(function (key, value) {
                this[EXPORTS][key] = value;
            }),
            require: _.directives.parody(MODULE_MANAGER, REQUIRE),
            module: _.directives.parody(MODULE_MANAGER, MODULE),
            startWithParent: returns(BOOLEAN_TRUE),
            stopWithParent: returns(BOOLEAN_TRUE),
            constructor: function (attrs, opts) {
                var module = this;
                module[EXPORTS] = {};
                module[CONSTRUCTOR + COLON + 'Model'](attrs, opts);
                module.listenTo(module[PARENT], {
                    start: doStart,
                    stop: doStop
                });
                return module;
            },
            createArguments: function (windo) {
                var module = this;
                return [module].concat(module[APPLICATION].directive(MODULE_MANAGER).createArguments(windo));
            },
            topLevel: function () {
                return !this[APPLICATION] || this[APPLICATION] === this[PARENT];
            }
        },
        newModuleMethods = extend({}, startableMethods, moduleMethods),
        Module = factories.Module = factories.Model.extend(CAPITAL_MODULE, newModuleMethods),
        ModuleManager = Collection.extend(MODULE_MANAGER, extend({
            constructor: function (target) {
                var manager = this;
                manager.target = target;
                manager.application = target.application || target;
                manager[CONSTRUCTOR + COLON + COLLECTION]();
                return manager;
            },
            createArguments: function (windo) {
                var manager = this,
                    app = manager.application,
                    _ = app._,
                    docu = windo[DOCUMENT],
                    id = docu[__ELID__],
                    documentManagerDocuments = app.directive(DOCUMENT_MANAGER).documents,
                    documentView = documentManagerDocuments.get(ID, id, function () {
                        app.global.definition(app.VERSION, windo);
                        return documentManagerDocuments.get(ID, docu[__ELID__]);
                    });
                return [app, _, _ && _.factories, documentView, documentView.factories, documentView.$];
            },
            require: function (modulename, handler) {
                var promise, module, manager = this,
                    target = manager.target,
                    app = manager.application;
                // globalname = ((globalname = module.globalname) ? globalname.split(PERIOD) : []).concat(key.split(PERIOD));
                // function (key, fn) {
                // var globalname, module = this;
                // return module.application.directive(MODULE_MANAGER).require().join(PERIOD), fn);
                // }
                // console.log(app);
                if (!isFunction(handler)) {
                    module = target.module(modulename);
                    return module.is(DEFINED) ? module[EXPORTS] : exception(notDefinedYetMessage);
                } else {
                    return Promise(function (success, failure) {
                        var mappedArguments, list = toArray(modulename, SPACE).slice(0);
                        console.log(list);
                        if ((mappedArguments = checks(app, list))) {
                            console.log(mappedArguments);
                            success(mappedArguments);
                        } else {
                            app.on(INITIALIZED_COLON_SUBMODULE, function () {
                                var mappedArguments;
                                if ((mappedArguments = checks(app, list))) {
                                    app.off();
                                    success(mappedArguments);
                                }
                                console.log(mappedArguments);
                            });
                        }
                    });
                }
            },
            module: function (name_, windo, fn) {
                var initResult, list, globalname, arg1, arg2, parentModulesDirective, modules, attrs, parentIsModule, nametree, manager = this,
                    parent = manager.target,
                    app = manager.application,
                    originalParent = parent,
                    name = name_,
                    // globalname = name,
                    namespace = name.split(PERIOD),
                    module = parent.directive(CHILDREN).get(name_),
                    triggerBubble = function () {
                        module.mark(DEFINED);
                        module[PARENT].bubble(INITIALIZED_COLON_SUBMODULE);
                    };
                console.log(name_);
                if (module) {
                    // hey, i found it. we're done here
                    parent = module[PARENT];
                    if (!fn) {
                        return module;
                    }
                    namespace = [module.id];
                } else {
                    // now i have to make the chain
                    while (namespace.length > 1) {
                        parent = parent.module(namespace[0]);
                        namespace.shift();
                    }
                }
                parentModulesDirective = parent.directive(CHILDREN);
                name = namespace.join(PERIOD);
                module = parentModulesDirective.get(ID, name);
                if (!module) {
                    list = parent.globalname ? parent.globalname.split(PERIOD) : [];
                    list.push(name);
                    globalname = list.join(PERIOD);
                    arg2 = extend({}, result(parent, CHILD_OPTIONS) || {}, {
                        application: app,
                        parent: parent,
                        id: name,
                        globalname: globalname
                    });
                    if (parent === app) {
                        module = Module({}, arg2);
                        parentModulesDirective.add(module);
                        parentModulesDirective.keep(ID, name, module);
                    } else {
                        module = parent.add({}, arg2).item(0);
                    }
                    app[CHILDREN].keep(ID, globalname, module);
                }
                if (isWindow(windo) || isFunction(windo) || isFunction(fn)) {
                    module[EXPORTS] = module[EXPORTS] || {};
                    module.mark(INITIALIZED);
                    initResult = module.run(windo, fn);
                    // allows us to create dependency graphs
                    // look into creating promise
                    if (initResult && _.isPromise(initResult)) {
                        initResult.then(triggerBubble);
                    } else {
                        triggerBubble();
                    }
                }
                return module;
            }
        })),
        appextendresult = app.extend(extend({}, factories.Directive[CONSTRUCTOR][PROTOTYPE], factories.Events[CONSTRUCTOR][PROTOTYPE], factories.Parent[CONSTRUCTOR][PROTOTYPE], newModuleMethods, {
            'directive:creation:ModuleManager': ModuleManager.extend({
                createArguments: function (windo) {
                    var manager = this,
                        app = manager.application,
                        _ = app._,
                        docu = windo[DOCUMENT],
                        id = docu[__ELID__],
                        documentManagerDocuments = app.directive(DOCUMENT_MANAGER).documents,
                        documentView = documentManagerDocuments.get(ID, id, function () {
                            app.global.definition(app.VERSION, windo);
                            return documentManagerDocuments.get(ID, docu[__ELID__]);
                        });
                    return [app, _, _ && _.factories, documentView, documentView.factories, documentView.$];
                }
            })
        }));
    app.defineDirective(MODULE_MANAGER, ModuleManager[CONSTRUCTOR]);
    // delete the prototype link from parent prototype
    delete app.fn;
});