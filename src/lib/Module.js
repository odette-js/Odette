app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Model = factories.Model,
        Collection = factories.Collection,
        _EXTRA_MODULE_ARGS = '_extraModuleArguments',
        MODULES = 'modules',
        startableMethods = {
            start: function (evnt) {
                var startable = this;
                if (!startable.started) {
                    startable.started = BOOLEAN_TRUE;
                    startable[DISPATCH_EVENT](START, evnt);
                }
                return startable;
            },
            stop: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable.started = BOOLEAN_FALSE;
                    startable[DISPATCH_EVENT](STOP, evnt);
                }
                return startable;
            },
            toggle: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable[STOP](evnt);
                } else {
                    startable[START](evnt);
                }
                return startable;
            },
            restart: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable[STOP](evnt);
                }
                startable[START](evnt);
                return startable;
            }
        },
        Startable = factories.Model.extend('Startable', startableMethods, BOOLEAN_TRUE),
        doStart = function (e) {
            if (this.get('startWithParent')) {
                this[START](e);
            }
        },
        doStop = function (e) {
            if (this.get('stopWithParent')) {
                this[STOP](e);
            }
        },
        moduleMethods = extend({}, factories.Events[CONSTRUCTOR][PROTOTYPE], startableMethods, {
            module: function (name_, windo, fn) {
                var parentModulesDirective, modules, attrs, parentIsModule, nametree, parent = this,
                    originalParent = parent,
                    name = name_,
                    globalname = name,
                    namespace = name.split(PERIOD),
                    module = parent.directive(CHILDREN).get(name_);
                if (module) {
                    // hey, i found it. we're done here
                    parent = module.parent;
                    if (!fn) {
                        return module;
                    }
                    namespace = [module.id];
                } else {
                    // crap, now i have to make the chain
                    while (namespace.length > 1) {
                        parent = parent.module(namespace[0]);
                        namespace.shift();
                    }
                }
                parentModulesDirective = parent.directive(CHILDREN);
                name = namespace.join(PERIOD);
                module = parentModulesDirective.get(ID, name);
                if (!module) {
                    parentIsModule = _.isInstance(parent, Module);
                    if (parentIsModule) {
                        namespace.unshift(globalname);
                    }
                    namespace = namespace.join(PERIOD);
                    module = Module({
                        id: name,
                        globalname: namespace
                    }, {
                        application: app,
                        parent: parent
                    });
                    if (module.topLevel()) {
                        parentModulesDirective.add(module);
                    } else {
                        parent.add(module);
                    }
                    parentModulesDirective.register(ID, name, module);
                    app[CHILDREN].register(ID, globalname, module);
                }
                if (isWindow(windo) || isFunction(windo) || isFunction(fn)) {
                    module.isInitialized = BOOLEAN_TRUE;
                    module.run(windo, fn);
                }
                return module;
            },
            run: function (windo, fn_) {
                var module = this;
                var fn = isFunction(windo) ? windo : fn_;
                var args = isWindow(windo) ? [windo.DOMM] : [];
                if (isFunction(fn)) {
                    fn.apply(module, module.createArguments(args));
                }
                return module;
            },
            parentEvents: function () {
                return {
                    start: doStart,
                    stop: doStop
                };
            },
            exports: function (obj) {
                extend(BOOLEAN_TRUE, this.get('exports'), obj);
                return this;
            },
            createArguments: function (args) {
                return [this].concat(this.application.createArguments(), args || []);
            },
            constructor: function (attrs, opts) {
                var module = this;
                module.application = opts.application;
                module.handlers = Collection();
                Model[CONSTRUCTOR].apply(this, arguments);
                return module;
            },
            defaults: function () {
                return {
                    startWithParent: BOOLEAN_TRUE,
                    stopWithParent: BOOLEAN_TRUE,
                    exports: {}
                };
            },
            topLevel: function () {
                return this.application === this[PARENT];
            },
            childOptions: function () {
                return {
                    application: this.application,
                    parent: this
                };
            }
        }),
        Module = factories.Model.extend('Module', moduleMethods, BOOLEAN_TRUE),
        appextendresult = app.extend(extend({}, moduleMethods, {
            // _startPromise: _.when(domPromise),
            _extraModuleArguments: [],
            /**
             * @func
             * @name Specless#baseModuleArguments
             * @returns {Array} list of base arguments to apply to submodules
             */
            baseModuleArguments: function () {
                var app = this,
                    _ = app._;
                return [app, _, _ && _.factories];
            },
            /**
             * @func
             * @name Specless#addModuleArguments
             * @param {Array} arr - list of arguments that will be added to the extraModule args list
             * @returns {Specless} instance
             */
            addModuleArguments: function (arr) {
                var app = this;
                duff(arr, function (item) {
                    _.add(app[_EXTRA_MODULE_ARGS], item);
                });
                return app;
            },
            /**
             * @func
             * @name Specless#removeModuleArguments
             * @param {Array} arr - list of objects or functions that will be removed from the extraModuleArgs
             * @returns {Specless} instance
             */
            removeModuleArguments: function (arr) {
                var app = this;
                duff(arr, function (item) {
                    _.remove(app[_EXTRA_MODULE_ARGS], item);
                });
                return app;
            },
            /**
             * @func
             * @name Specless#createArguments
             * @returns {Object[]}
             */
            createArguments: function (args) {
                return this.baseModuleArguments().concat(this[_EXTRA_MODULE_ARGS], args || []);
            },
            require: function (modulename) {
                var module = this[CHILDREN].get(ID, modulename) || exception({
                    message: 'that module does not exist yet'
                });
                return module.get('exports');
            }
        }));
    app.defineDirective('modules', function () {
        return Collection();
    });
});