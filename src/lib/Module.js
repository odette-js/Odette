app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Model = factories.Model,
        Collection = factories.Collection,
        MODULE = 'module',
        CAPITAL_MODULE = capitalize(MODULE),
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
            module: function (name_, windo, fn) {
                var initResult, list, globalname, arg1, arg2, parentModulesDirective, modules, attrs, parentIsModule, nametree, parent = this,
                    originalParent = parent,
                    name = name_,
                    // globalname = name,
                    namespace = name.split(PERIOD),
                    module = parent.directive(CHILDREN).get(name_),
                    triggerBubble = function () {
                        module.mark(DEFINED);
                        module[PARENT].bubble(INITIALIZED_COLON_SUBMODULE);
                    };
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
                    if (initResult && Promise.fn.isChildType(initResult)) {
                        initResult.success(triggerBubble);
                    } else {
                        triggerBubble();
                    }
                }
                return module;
            },
            createArguments: function (windo) {
                var module = this;
                return [module].concat(module[APPLICATION].createArguments(windo));
            },
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
            topLevel: function () {
                return !this[APPLICATION] || this[APPLICATION] === this[PARENT];
            },
            require: function (key, fn) {
                return this.application.require(this.globalname + PERIOD + key, fn);
            }
        },
        Module = factories.Module = factories.Model.extend(CAPITAL_MODULE, extend({}, startableMethods, moduleMethods)),
        appextendresult = app.extend(extend({}, factories.Directive[CONSTRUCTOR][PROTOTYPE], factories.Events[CONSTRUCTOR][PROTOTYPE], factories.Parent[CONSTRUCTOR][PROTOTYPE], startableMethods, moduleMethods, {
            createArguments: function (windo) {
                var app = this,
                    _ = app._,
                    id = windo[DOCUMENT][__ELID__],
                    documentManagerDocuments = app.directive(DOCUMENT_MANAGER).documents,
                    documentView = documentManagerDocuments.get(ID, id);
                if (!documentView) {
                    app.global.definition(app.VERSION, windo);
                    documentView = documentManagerDocuments.get(ID, id);
                }
                return [app, _, _ && _.factories, documentView, documentView.factories, documentView.$];
            },
            require: function (modulename, handler) {
                var promise, module, list, mappedArguments, app = this;
                if (!isFunction(handler)) {
                    module = app.module(modulename);
                    return module.is(DEFINED) ? module[EXPORTS] : exception(notDefinedYetMessage);
                } else {
                    promise = Promise();
                    list = toArray(modulename, SPACE).slice(0);
                    promise.success(bind(handler, app));
                    if ((mappedArguments = checks(app, list))) {
                        promise.fulfill(mappedArguments);
                    } else {
                        app.on(INITIALIZED_COLON_SUBMODULE, function () {
                            if ((mappedArguments = checks(app, list))) {
                                app.off();
                                promise.fulfill(mappedArguments);
                            }
                        });
                    }
                    return promise;
                }
            }
        }));
    // delete the prototype link from parent prototype
    delete app.fn;
});