var REQUIRE = 'require',
    MODULE = 'module',
    INITIALIZED = 'initialized',
    DEFINED = 'defined',
    INITIALIZED_COLON_SUBMODULE = INITIALIZED + COLON + 'sub' + MODULE,
    STARTED = START + 'ed',
    CAPITAL_MODULE = capitalize(MODULE),
    MODULE_MANAGER = CAPITAL_MODULE + 'Manager',
    Module = app.block(function (app) {
        var notDefinedYetMessage = 'that module has not been ' + DEFINED + ' yet',
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
            moduleLoadPromise = function (registry) {
                var promise = registry.target;
                return Promise(function (success, failure) {
                    if (module.is(INITIALIZED)) {
                        success();
                    } else {
                        module.on(INITIALIZED_COLON_SUBMODULE, function () {
                            if (!module.is(INITIALIZED)) {
                                return;
                            }
                            module.off();
                            success();
                        });
                    }
                });
            },
            moduleMethods = {
                // run: function (windo_, fn_) {
                //     var result, module = this,
                //         fn = isFunction(windo_) ? windo_ : fn_,
                //         windo = isWindow(windo_) ? windo_ : window;
                //     if (isFunction(fn)) {
                //         result = fn.apply(module, module.createArguments(windo));
                //     }
                //     return result === UNDEFINED ? module : result;
                // },
                parent: function () {
                    var splitglobal, splitsliced, terminator, module = this,
                        globalname = module.globalname;
                    // terminator
                    if (!globalname) {
                        return NULL;
                    }
                    splitglobal = globalname.split(PERIOD);
                    splitsliced = splitglobal.slice(0, splitglobal.length - 1);
                    // terminating points
                    terminator = module.directive(MODULE_MANAGER).terminator();
                    if (!splitsliced.length) {
                        return terminator;
                    }
                    return terminator.module(splitsliced.join(PERIOD));
                },
                publicize: intendedApi(function (key, value) {
                    this[EXPORTS][key] = value;
                }),
                run: _.directives.parody(MODULE_MANAGER, 'run'),
                require: _.directives.parody(MODULE_MANAGER, REQUIRE),
                module: _.directives.parody(MODULE_MANAGER, MODULE),
                createArguments: _.directives.parody(MODULE_MANAGER, 'createArguments'),
                startWithParent: returns(BOOLEAN_TRUE),
                stopWithParent: returns(BOOLEAN_TRUE),
                constructor: function (attrs, opts) {
                    var module = this;
                    module[EXPORTS] = {};
                    module[CONSTRUCTOR + COLON + MODEL](attrs, opts);
                    module.listenTo(module[PARENT](), {
                        start: doStart,
                        stop: doStop
                    });
                    return module;
                },
                topLevel: function () {
                    return !this[APPLICATION] || this[APPLICATION] === this[PARENT];
                },
                load: function () {
                    return this.directive(REGISTRY).get(PROMISES, 'load', moduleLoadPromise);
                }
            },
            newModuleMethods = extend({}, startableMethods, moduleMethods),
            Module = factories.Module = Model.extend(CAPITAL_MODULE, newModuleMethods),
            ModuleManager = Collection.extend(MODULE_MANAGER, extend({
                Module: Module,
                constructor: function (target) {
                    var manager = this;
                    manager.target = target;
                    manager.application = target.application || target;
                    manager[CONSTRUCTOR + COLON + COLLECTION]();
                    return manager;
                },
                terminator: function () {
                    return (this.target && this.target.terminator) || this.target;
                },
                run: function (windo_, fn_) {
                    var result, manager = this,
                        module = manager.target,
                        fn = isFunction(windo_) ? windo_ : fn_,
                        windo = isWindow(windo_) ? windo_ : window;
                    if (isFunction(fn)) {
                        result = fn.apply(module, manager.createArguments(windo));
                    }
                    return result === UNDEFINED ? module : result;
                },
                createArguments: function (windo) {
                    var manager = this,
                        app = manager.terminator(),
                        _ = app._,
                        docu = windo[DOCUMENT],
                        id = docu[__ELID__],
                        documentManagerDocuments = app.directive(DOCUMENT_MANAGER).documents,
                        documentView = documentManagerDocuments.get(ID, id, function () {
                            app.global.definition(app.VERSION, windo);
                            return documentManagerDocuments.get(ID, docu[__ELID__]);
                        });
                    return [manager.target, app, _, _ && _.factories, documentView, documentView.factories, documentView.$];
                },
                require: function (modulename, handler) {
                    var promise, module, manager = this,
                        target = manager.target,
                        app = manager.application;
                    if (!isFunction(handler)) {
                        module = target.module(modulename);
                        return module.is(DEFINED) ? module[EXPORTS] : exception(notDefinedYetMessage);
                    } else {
                        return Promise(function (success, failure) {
                            var mappedArguments, list = toArray(modulename, SPACE).slice(0);
                            if ((mappedArguments = checks(app, list))) {
                                success(mappedArguments);
                            } else {
                                app.on(INITIALIZED_COLON_SUBMODULE, function () {
                                    var mappedArguments;
                                    if ((mappedArguments = checks(app, list))) {
                                        app.off();
                                        success(mappedArguments);
                                    }
                                });
                            }
                        });
                    }
                },
                module: function (name_, windo_, fn_) {
                    var initResult, list, globalname, parentManager, module, arg1, arg2, parentModulesDirective, modules, attrs, parentIsModule, nametree, manager = this,
                        parent = manager.target,
                        app = manager.application,
                        originalParent = parent,
                        name = name_,
                        namespace = name.split(PERIOD),
                        wasWindow = isWindow(windo_),
                        windo = wasWindow ? windo_ : NULL,
                        fn = isFunction(fn_) ? fn_ : (!wasWindow && isFunction(windo_) ? windo_ : NULL),
                        triggerBubble = function () {
                            module.mark(DEFINED);
                            module.bubble(INITIALIZED_COLON_SUBMODULE);
                        };
                    // now i make the chain
                    while (namespace.length > 1) {
                        parent = parent.module(namespace[0]);
                        namespace.shift();
                    }
                    parentManager = parent.directive(MODULE_MANAGER);
                    module = parentManager.get(ID, namespace[0]);
                    if (module && !fn) {
                        return module;
                    }
                    name = namespace.join(PERIOD);
                    if (!module) {
                        list = parent.globalname ? parent.globalname.split(PERIOD) : [];
                        list.push(name);
                        globalname = list.join(PERIOD);
                        arg2 = extend({}, result(parent, CHILD_OPTIONS) || {}, {
                            application: app.app(),
                            terminator: app,
                            id: name,
                            globalname: globalname
                        });
                        module = manager.Module({}, arg2);
                        parentManager.push(module);
                        parentManager.keep(ID, name, module);
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
            }));
        app.defineDirective(MODULE_MANAGER, ModuleManager[CONSTRUCTOR]);
        app.extend(extend({}, Directive.fn, Events.fn, factories.Parent.fn, newModuleMethods, {
            app: function () {
                return this;
            }
        }));
        // delete the prototype link from parent prototype
        delete app.fn;
        return Module;
    });