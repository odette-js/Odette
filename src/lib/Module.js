app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Model = factories.Model,
        Collection = factories.Collection,
        MODULES = 'Modules',
        STARTED = START + 'ed',
        INITIALIZED = 'initialized',
        DEFINED = 'defined',
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
            if (this.startWithParent) {
                this[START](e);
            }
        },
        doStop = function (e) {
            if (this.stopWithParent) {
                this[STOP](e);
            }
        },
        createArguments = function (module, args) {
            return [module].concat(module.application.createArguments(), args || []);
        },
        checks = function (app, list) {
            var exporting = [];
            duff(list, function (path) {
                var module = app.module(path);
                if (module.is(INITIALIZED)) {
                    exporting.push(module.exports);
                }
            });
            return exporting[LENGTH] === list[LENGTH] ? exporting : BOOLEAN_FALSE;
        },
        Promise = _.Promise,
        moduleMethods = {
            Child: BOOLEAN_TRUE,
            module: function (name_, windo, fn) {
                var initResult, list, globalname, arg1, arg2, parentModulesDirective, modules, attrs, parentIsModule, nametree, parent = this,
                    originalParent = parent,
                    name = name_,
                    // globalname = name,
                    namespace = name.split(PERIOD),
                    module = parent.directive(CHILDREN).get(name_),
                    triggerBubble = function () {
                        module.mark(DEFINED);
                        module.parent.bubble(INITIALIZED + ':submodule');
                    };
                if (module) {
                    // hey, i found it. we're done here
                    parent = module.parent;
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
                    list = parent.globalname ? parent.globalname.split('.') : [];
                    list.push(name);
                    globalname = list.join('.');
                    arg2 = extend(result(parent, 'childOptions') || {}, {
                        application: app,
                        parent: parent,
                        id: name,
                        globalname: globalname
                    });
                    if (parent === app) {
                        module = Module({}, arg2);
                        parentModulesDirective.add(module);
                    } else {
                        module = parent.add({}, arg2)[0];
                    }
                    parentModulesDirective.keep(ID, name, module);
                    app[CHILDREN].keep(ID, globalname, module);
                }
                if (isWindow(windo) || isFunction(windo) || isFunction(fn)) {
                    module.exports = module.exports || {};
                    module.mark(INITIALIZED);
                    initResult = module.run(windo, fn);
                    // allows us to create dependency graphs
                    if (initResult && isInstance(initResult, Promise)) {
                        initResult.success(triggerBubble);
                    } else {
                        triggerBubble();
                    }
                }
                return module;
            },
            run: function (windo, fn_) {
                var application, result, module = this,
                    fn = isFunction(windo) ? windo : fn_,
                    args = isWindow(windo) ? [windo.DOMA] : [];
                if (isFunction(fn)) {
                    application = module.application;
                    if (application && application !== module) {
                        result = fn.apply(module, createArguments(module, args));
                    } else {
                        result = fn.apply(module, module.createArguments(args));
                    }
                }
                return result === UNDEFINED ? module : result;
            },
            publicize: function (one, two) {
                var module = this;
                intendedObject(one, two, function (key, value) {
                    module.exports[key] = value;
                });
                return module;
            },
            constructor: function (attrs, opts) {
                var module = this;
                module.startWithParent = BOOLEAN_TRUE;
                module.stopWithParent = BOOLEAN_TRUE;
                module.exports = {};
                Model[CONSTRUCTOR].apply(module, arguments);
                module.listenTo(module.parent, {
                    start: doStart,
                    stop: doStop
                });
                return module;
            },
            topLevel: function () {
                return !this.application || this.application === this[PARENT];
            },
            require: function (modulename, handler) {
                var promise, module, list, mappedArguments, app = this;
                if (!isFunction(handler)) {
                    module = app.module(modulename);
                    return module.is(DEFINED) ? module.exports : exception({
                        message: 'that module has not ' + DEFINED + ' initialization yet'
                    });
                } else {
                    promise = _.Promise();
                    list = gapSplit(modulename);
                    if (!isArray(list) || !list[LENGTH]) {
                        return promise;
                    }
                    list = list.slice(0);
                    promise.success(bind(handler, app));
                    if ((mappedArguments = checks(app, list))) {
                        promise.fulfill(mappedArguments);
                    } else {
                        app.application.on(INITIALIZED + ':submodule', function () {
                            if ((mappedArguments = checks(app, list))) {
                                app.off();
                                promise.fulfill(mappedArguments);
                            }
                        });
                    }
                    return promise;
                }
            }
        },
        extraModuleArguments = [],
        Module = factories.Module = factories.Model.extend('Module', extend({}, startableMethods, moduleMethods)),
        baseModuleArguments = function (app) {
            var _ = app._;
            return [app, _, _ && _.factories];
        },
        appextendresult = app.extend(extend({}, factories.Directive[CONSTRUCTOR][PROTOTYPE], factories.Events[CONSTRUCTOR][PROTOTYPE], startableMethods, moduleMethods, {
            addModuleArguments: function (arr) {
                _.addAll(extraModuleArguments, arr);
                return this;
            },
            removeModuleArguments: function (arr) {
                _.removeAll(extraModuleArguments, arr);
                return this;
            },
            createArguments: function (args) {
                return baseModuleArguments(this).concat(extraModuleArguments, args || []);
            }
        }));
});