application.scope(function (app) {
    var blank, _ = app._,
        // submodules = app.submodules = {},
        factories = _.factories,
        Box = _.factories.Box,
        startableMethods = {
            start: function () {
                var startable = this;
                if (!startable.started) {
                    startable.dispatchEvent('before:start', arguments);
                    startable.started = true;
                    startable.dispatchEvent('start', arguments);
                }
            },
            stop: function () {
                var startable = this;
                if (startable.started) {
                    startable.dispatchEvent('before:stop', arguments);
                    startable.started = false;
                    startable.dispatchEvent('stop', arguments);
                }
            },
            toggle: function () {
                var module = this;
                if (module.started) {
                    module.stop.apply(module, arguments);
                } else {
                    module.start.apply(module, arguments);
                }
                return module;
            }
        },
        Startable = _.extendFrom.Box('Startable', startableMethods, !0),
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
                parent.children.register(name, module);
                // parent.registerModule(name, module);
            }
            if (!module.hasInitialized && _.isFunction(fn)) {
                module.hasInitialized = true;
                module.handler(fn);
            }
            return module;
        },
        Module = _.extendFrom.Box('Module', _.extend({}, startableMethods, {
            // registerModule: registerModule,
            // unRegisterModule: unRegisterModule,
            idAttribute: 'name',
            module: moduleHandler,
            parentEvents: {
                start: doStart,
                stop: doStop
            },
            exports: function (obj) {
                _.extend(this.get('exports'), obj);
                return this;
            },
            run: function (fn) {
                var module = this;
                fn.apply(module, module.createArguments());
                return module;
            },
            createArguments: function () {
                return [this].concat(this.application.createArguments());
            },
            constructor: function (attrs, opts) {
                var module = this;
                // module.submodules = {};
                module.name = attrs.name;
                module.application = opts.application;
                module.handlers = _.Collection();
                _.messenger(this);
                Box.apply(this, arguments);
                return module;
            },
            defaults: function () {
                return {
                    startWithParent: true,
                    stopWithParent: true,
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
        }), !0);
    app.extend({
        children: _.Collection(),
        // registerModule: registerModule,
        /**
         * @func
         * @name Specless#run
         * @returns {*}
         */
        run: Module.prototype.run,
        /**
         * @func
         * @name Specless#baseModuleArguments
         * @returns {Array} list of base arguments to apply to submodules
         */
        baseModuleArguments: function () {
            var app = this;
            return [app, app._];
        },
        /**
         * @func
         * @name Specless#addModuleArgs
         * @param {Array} arr - list of arguments that will be added to the extraModule args list
         * @returns {Specless} instance
         */
        addModuleArgs: function (arr) {
            var app = this;
            app.extraModuleArgs = app.extraModuleArgs || [];
            app._.addAll(app.extraModuleArgs, arr);
            return app;
        },
        /**
         * @func
         * @name Specless#removeModuleArgs
         * @param {Array} arr - list of objects or functions that will be removed from the extraModuleArgs
         * @returns {Specless} instance
         */
        removeModuleArgs: function (arr) {
            this.utils.removeAll(this.extraModuleArgs, arr);
            return this;
        },
        /**
         * @func
         * @name Specless#createArguments
         * @returns {Object[]}
         */
        createArguments: function () {
            return this.baseModuleArguments().concat(this.extraModuleArgs);
        },
        require: function (modulename) {
            var module = this.module(modulename);
            return module.getExports();
        },
        module: moduleHandler
    });
});