app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        Collection = factories.Collection,
        protoProp = _.protoProp,
        isFragment = _.isFragment,
        isInstance = _.isInstance,
        isFunction = _.isFunction,
        isArrayLike = _.isArrayLike,
        reverseParams = _.reverseParams,
        intendedObject = _.intendedObject,
        createDocumentFragment = _.createDocumentFragment,
        RENDER = 'render',
        OPTIONS = 'options',
        IS_RENDERED = 'isRendered',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        BUFFERED_VIEWS = 'bufferedViews',
        REGION_MANAGER = 'regionManager',
        ESTABLISH_REGIONS = 'establishRegions',
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements',
        getRegion = function (key) {
            return this.directive(REGION_MANAGER).list.get(ID, key);
        },
        addRegion = function (key, selector) {
            var regionManagerDirective = this.directive(REGION_MANAGER);
            intendedObject(key, selector, function (key, selector) {
                var region = regionManagerDirective.list.get(key);
                if (!region) {
                    regionManagerDirective.establish(key, selector);
                }
            });
        },
        /**
         * @class View
         * @augments Model
         * @augments Model
         * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
         */
        // region views are useful if you're constructing different components
        // from a separate place and just want it to be in the attach pipeline
        // very useful for componentizing your ui
        // LeafView = factories.
        // regionConstructor = ,
        Model = factories.Model,
        Region = factories.Model.extend('Region', {
            constructor: function (secondary) {
                var model = this;
                factories.Model[CONSTRUCTOR].call(model, {}, secondary);
                model.directive(CHILDREN);
                model.setElement();
                return model;
            },
            add: function (models_, options_) {
                var bufferedViewsDirective, region = this,
                    options = options_ || {},
                    unwrapped = Collection(models_).each(function (view_) {
                        var view = isInstance(view_, View) ? view_ : (options.Child || region.Child || factories.View)({
                                model: isInstance(view_, Model) ? view_ : view_ = Model(view_)
                            }),
                            nul = bufferedViewsDirective || ((bufferedViewsDirective = region.directive(BUFFERED_VIEWS)) && bufferedViewsDirective.ensure());
                        region.adopt(view);
                        bufferedViewsDirective.views.push(view);
                    }).unwrap();
                if (region.el) {
                    region.render();
                }
                return unwrapped;
            },
            adopt: function (view) {
                var region = this,
                    children = region[CHILDREN];
                if (view[PARENT]) {
                    if (view[PARENT] === region) {
                        return;
                    } else {
                        view[PARENT].disown(view);
                    }
                }
                view[PARENT] = region;
                children.add(view);
            },
            disown: function (view) {
                var region = this,
                    children = region[CHILDREN];
                view[PARENT] = NULL;
                children.remove(view);
            },
            attachElement: function (view) {
                var bufferDirective, el = view.el && view.el.element();
                if (el) {
                    bufferDirective = this.directive(BUFFERED_VIEWS);
                    bufferDirective.els.appendChild(el);
                }
            },
            setElement: function () {
                var manager, region = this,
                    selector = region[SELECTOR],
                    parent = region[PARENT][PARENT];
                if (parent !== app) {
                    if (parent.isRendered) {
                        manager = parent.$(selector)[INDEX](0);
                    }
                } else {
                    manager = $(selector)[INDEX](0);
                }
                if (manager) {
                    region.directive(ELEMENT).set(manager);
                }
            },
            render: function () {
                var region = this,
                    bufferDirective = region.directive(BUFFERED_VIEWS),
                    elementDirective = region.directive(ELEMENT);
                region[IS_RENDERED] = BOOLEAN_FALSE;
                // doc frags on regionviews, list of children to trigger events on
                bufferDirective.ensure();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                // update new element's attributes
                region.setElement();
                elementDirective.setAttributes();
                // puts children back inside parent
                // bufferDirective.attach();
                region[CHILDREN].eachCall(RENDER);
                // attach region element
                // appends child elements
                elementDirective.el.append(bufferDirective.els);
                // pass the buffered views up
                // region.passBuffered(list);
                // mark the view as rendered
                region[IS_RENDERED] = BOOLEAN_TRUE;
                // reset buffered objects
                bufferDirective.reset();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            }
        }, BOOLEAN_TRUE),
        View = Region.extend('View', {
            tagName: 'div',
            filter: BOOLEAN_TRUE,
            getRegion: getRegion,
            $: function (selector) {
                return this.el.$(selector);
            },
            setElement: function (element) {
                var view = this,
                    previousElement = view.el,
                    elementDirective = view.directive(ELEMENT);
                // detaches events with this view's namespace
                elementDirective.set(element);
                if (previousElement !== view.el) {
                    elementDirective.undelegate(previousElement);
                    elementDirective.delegate();
                }
                // attaches events with this view's namespace
                return view;
            },
            template: function () {
                return EMPTY_STRING;
            },
            parentView: function () {
                var found, view = this,
                    parent = view[PARENT];
                while (found && parent && !isInstance(parent, View)) {
                    parent = parent[PARENT];
                    if (isInstance(parent, View)) {
                        found = parent;
                    }
                }
                return found;
            },
            constructor: function (secondary) {
                var model = this;
                factories.Model[CONSTRUCTOR].call(model, secondary);
                model.directive(ELEMENT).ensure();
                this.id = uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE);
                this.establishRegions();
                return model;
            },
            establishRegions: function () {
                var regions = result(this, 'regions');
                var regionsResult = regions && this.directive(REGION_MANAGER).establish(regionsResult);
                return this;
            },
            valueOf: function () {
                return this.id;
            },
            remove: function () {
                var el, view = this;
                Model[CONSTRUCTOR][PROTOTYPE].remove.apply(view, arguments);
                // if you were not told to select something in
                // _ensureElements then remove the view from the dom
                view.detach();
                return view;
            },
            destroy: function () {
                var view = this;
                Model[CONSTRUCTOR][PROTOTYPE].destroy.call(view);
                view.el.destroy();
                return view;
            },
            rendered: function () {
                return this[IS_RENDERED];
            },
            destroyed: function () {
                return this.isDestroyed;
            },
            render: function () {
                var element, json, bufferedDirective, template, view = this;
                view[IS_RENDERED] = BOOLEAN_FALSE;
                if (!result(view, 'filter')) {
                    return view;
                }
                element = view.directive(ELEMENT);
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                view.setElement(view.el);
                // update new element's attributes
                element.setAttributes();
                // renders the html
                json = view.model && view.model.toJSON();
                // try to generate template
                template = result(view, 'template', json);
                // render the template
                element.render(template);
                // mark the view as rendered
                view[IS_RENDERED] = BOOLEAN_TRUE;
                // bufferedDirective = view[BUFFERED_VIEWS];
                // view.buffer();
                element = view[PARENT] && view[PARENT].attachElement(view);
                // pass buffered views up to region
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                // if (view[IS_RENDERED]) {
                view.directive(REGION_MANAGER).list.eachCall(RENDER);
                // }
                return view;
            }
        }, BOOLEAN_TRUE),
        // View = LeafView.extend('View', {
        //     // getRegion: getRegion,
        //     constructor: function (secondary) {
        //         LeafView[CONSTRUCTOR].apply(this, arguments);
        //         this.directive(REGION_MANAGER).establish(result(this, 'regions'));
        //         return this;
        //     },
        //     render: function () {
        //         var view = this;
        //         LeafView[CONSTRUCTOR][PROTOTYPE][RENDER].apply(this, arguments);
        //         if (view[IS_RENDERED]) {
        //             view.directive(REGION_MANAGER).list.eachCall(RENDER);
        //         }
        //         return view;
        //     }
        // }, BOOLEAN_TRUE),
        _View = factories.View;
    var establishRegion = function (key, selector) {
            var regionManagerDirective = this,
                parentView = regionManagerDirective[PARENT];
            if (!key) {
                return regionManagerDirective;
            }
            intendedObject(key, selector, function (key, selector) {
                var $selected, region = regionManagerDirective.list.get(key);
                if (!region) {
                    region = regionManagerDirective.create(key, selector);
                }
                if (parentView !== app) {
                    $selected = parentView.$(region[SELECTOR])[INDEX](0);
                } else {
                    $selected = $(region[SELECTOR])[INDEX](0);
                }
                if ($selected) {
                    region.el = $selected;
                }
            });
            return regionManagerDirective;
        },
        removeRegion = function (region_) {
            // var regionManager = this;
            // var region = isString(region_) ? regionManager.get(region_) : region_;
            // regionManager.remove(region);
            // regionManager.unRegister(region.id, region);
        },
        createRegion = function (where, region_) {
            var key, regionManagerDirective = this,
                parent = regionManagerDirective[PARENT],
                // assume that it is a region
                selector = region_,
                region = region_;
            if (isInstance(region, Region)) {
                return region;
            }
            region = Region(extend({
                selector: selector || EMPTY_STRING
            }, isObject(region) ? region : {}, {
                id: where,
                parent: regionManagerDirective,
                isAttached: parent === app ? BOOLEAN_TRUE : parent.isAttached
            }));
            regionManagerDirective.list.push(region);
            regionManagerDirective.list.register(ID, where, region);
            return region;
        },
        bufferedEnsure = function () {
            var buffers = this,
                _bufferedViews = isArray(buffers.views) ? 1 : buffers.resetViews(),
                _bufferedEls = isFragment(buffers.els) ? 1 : buffers.resetEls();
        },
        bufferedReset = function () {
            var cached = this.views;
            this.resetEls();
            this.resetViews();
            return cached;
        },
        bufferedElsReset = function () {
            this.els = document.createDocumentFragment();
        },
        bufferedViewsReset = function () {
            this.views = [];
        };
    app.defineDirective(REGION_MANAGER, function (instance) {
        return {
            list: new Collection[CONSTRUCTOR](),
            parent: instance,
            create: createRegion,
            establish: establishRegion,
            remove: removeRegion,
            add: addRegion
        };
    });
    app.defineDirective(BUFFERED_VIEWS, function (instance) {
        return {
            region: instance,
            els: $.createDocumentFragment(),
            views: [],
            reset: bufferedReset,
            ensure: bufferedEnsure,
            resetViews: bufferedViewsReset,
            resetEls: bufferedElsReset
        };
    });
    app.extend({
        getRegion: getRegion,
        addRegion: addRegion,
        removeRegion: removeRegion
    });
});