application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        Box = factories.Box,
        Collection = factories.Collection,
        _EXTRA_MODULE_ARGS = '_extraModuleArguments',
        startableMethods = {
            start: function (evnt) {
                var startable = this;
                if (!startable.started) {
                    startable.dispatchEvent('before:' + START, evnt);
                    startable.started = BOOLEAN_TRUE;
                    startable.dispatchEvent(START, evnt);
                }
                return startable;
            },
            stop: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable.dispatchEvent('before:' + STOP, evnt);
                    startable.started = BOOLEAN_FALSE;
                    startable.dispatchEvent(STOP, evnt);
                }
                return startable;
            },
            toggle: function () {
                var startable = this;
                if (startable.started) {
                    startable[STOP](evnt);
                } else {
                    startable[START](evnt);
                }
                return startable;
            }
        },
        Startable = factories.Box.extend('Startable', startableMethods, BOOLEAN_TRUE),
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
        // moduleHandler = ,
        // moduleRunner = ,
        moduleMethods = extend({}, factories.Events.constructor.prototype, startableMethods, {
            // idAttribute: 'name',
            module: function (name_, fn) {
                var modules, attrs, parentIsModule, nametree, parent = this,
                    originalParent = parent,
                    name = name_,
                    globalname = name,
                    namespace = name.split(PERIOD),
                    parentModulesDirective = parent.directive('modules'),
                    module = parentModulesDirective.get(name_);
                while (namespace.length > 1) {
                    parent = parent.module(namespace[0]);
                    namespace.shift();
                }
                name = namespace.join(PERIOD);
                module = parentModulesDirective.get(name);
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
                    parentModulesDirective.register(name, module);
                    app.directive('modules').register(globalname, module);
                }
                if (!module.hasInitialized && isFunction(fn)) {
                    module.hasInitialized = BOOLEAN_TRUE;
                    module.handler(fn);
                }
                return module;
            },
            run: function (fn) {
                var module = this;
                fn.apply(module, module.createArguments());
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
            createArguments: function () {
                return [this].concat(this.application.createArguments());
            },
            constructor: function (attrs, opts) {
                var module = this;
                module.application = opts.application;
                module.handlers = Collection();
                // module.modules = Collection();
                Box.constructor.apply(this, arguments);
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
            },
            handler: function (fn) {
                var module = this;
                module.handlers.push(fn);
                module.run(fn);
                return module;
            }
        }),
        Module = factories.Box.extend('Module', moduleMethods, BOOLEAN_TRUE),
        appextendresult = app.extend(extend({}, moduleMethods, {
            _extraModuleArguments: [],
            /**
             * @func
             * @name Specless#baseModuleArguments
             * @returns {Array} list of base arguments to apply to submodules
             */
            baseModuleArguments: function () {
                var app = this;
                return [app, app._, app._ && app._.factories];
            },
            /**
             * @func
             * @name Specless#addModuleArguments
             * @param {Array} arr - list of arguments that will be added to the extraModule args list
             * @returns {Specless} instance
             */
            addModuleArguments: function (arr) {
                var app = this;
                _.duff(arr, function (item) {
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
                _.duff(arr, function (item) {
                    _.remove(app[_EXTRA_MODULE_ARGS], item);
                });
                return app;
            },
            /**
             * @func
             * @name Specless#createArguments
             * @returns {Object[]}
             */
            createArguments: function () {
                return this.baseModuleArguments().concat(this[_EXTRA_MODULE_ARGS]);
            },
            require: function (modulename) {
                var module = this.module(modulename);
                return module.getExports();
            }
        }));
    app.defineDirective('modules', function () {
        return Collection();
    });
});