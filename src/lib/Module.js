application.scope(function (app) {
    var blank, _ = app._,
        factories = _.factories,
        Box = _.factories.Box,
        isFunction = _.isFunction,
        extend = _.extend,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        _EXTRA_MODULE_ARGS = '_extraModuleArgs',
        startableMethods = {
            start: function (evnt) {
                var startable = this;
                if (!startable.started) {
                    startable.dispatchEvent('before:start', evnt);
                    startable.started = BOOLEAN_TRUE;
                    startable.dispatchEvent('start', evnt);
                }
                return startable;
            },
            stop: function (evnt) {
                var startable = this;
                if (startable.started) {
                    startable.dispatchEvent('before:stop', evnt);
                    startable.started = BOOLEAN_FALSE;
                    startable.dispatchEvent('stop', evnt);
                }
                return startable;
            },
            toggle: function () {
                var startable = this;
                if (startable.started) {
                    startable.stop(evnt);
                } else {
                    startable.start(evnt);
                }
                return startable;
            }
        },
        Startable = factories.Box.extend('Startable', startableMethods, BOOLEAN_TRUE),
        doStart = function (e) {
            if (this.get('startWithParent')) {
                this.start(e);
            }
        },
        doStop = function (e) {
            if (this.get('stopWithParent')) {
                this.stop(e);
            }
        },
        moduleHandler = function (name_, fn) {
            var module, attrs, parentIsModule, nametree, parent = this,
                originalParent = parent,
                name = name_,
                namespace = name.split('.');
            while (namespace.length > 1) {
                parent = parent.module(namespace[0]);
                namespace.shift();
            }
            name = namespace.join('.');
            module = parent.children.get(name);
            // module = parent.submodules[name];
            if (!module) {
                parentIsModule = _.isInstance(parent, Module);
                if (parentIsModule) {
                    namespace.unshift(parent.get('globalname'));
                }
                namespace = namespace.join('.');
                attrs = {
                    id: name,
                    name: name,
                    globalname: namespace
                };
                if (parentIsModule) {
                    module = parent.add(attrs)[0];
                } else {
                    module = new Module(attrs, {
                        application: app,
                        parent: parent
                    });
                    parent.children.add(module);
                }
                // parent.children.register(name, module);
            }
            if (!module.hasInitialized && isFunction(fn)) {
                module.hasInitialized = BOOLEAN_TRUE;
                module.handler(fn);
            }
            return module;
        },
        moduleRunner = function (fn) {
            var module = this;
            fn.apply(module, module.createArguments());
            return module;
        },
        moduleMethods = extend({}, startableMethods, {
            idAttribute: 'name',
            module: moduleHandler,
            parentEvents: {
                start: doStart,
                stop: doStop
            },
            exports: function (obj) {
                extend(this.get('exports'), obj);
                return this;
            },
            run: moduleRunner,
            createArguments: function () {
                return [this].concat(this.application.createArguments());
            },
            constructor: function (attrs, opts) {
                var module = this;
                // module.submodules = {};
                module.name = attrs.name;
                module.application = opts.application;
                module.handlers = factories.Collection();
                factories.Messenger(this);
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
        appextendresult = app.extend(extend({}, factories.Events.constructor.prototype, moduleMethods, {
            _extraModuleArgs: [],
            children: factories.Collection(),
            module: moduleHandler,
            /**
             * @func
             * @name Specless#run
             * @returns {*}
             */
            run: moduleRunner,
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
             * @name Specless#addModuleArgs
             * @param {Array} arr - list of arguments that will be added to the extraModule args list
             * @returns {Specless} instance
             */
            addModuleArgs: function (arr) {
                var app = this;
                app._.addAll(app[_EXTRA_MODULE_ARGS], arr);
                return app;
            },
            /**
             * @func
             * @name Specless#removeModuleArgs
             * @param {Array} arr - list of objects or functions that will be removed from the extraModuleArgs
             * @returns {Specless} instance
             */
            removeModuleArgs: function (arr) {
                this.utils.removeAll(this[_EXTRA_MODULE_ARGS], arr);
                return this;
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
});