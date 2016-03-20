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
        RENDERED = RENDER + 'ed',
        OPTIONS = 'options',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        BUFFERED_VIEWS = 'bufferedViews',
        REGION_MANAGER = 'regionManager',
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
        Parent = factories.Parent,
        Model = factories.Model,
        Region = Parent.extend('Region', {
            constructor: function (secondary) {
                var model = this;
                Parent[CONSTRUCTOR].call(model, secondary);
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
            attach: function (view) {
                var parentNode, bufferDirective, el = view.el && view.el.element();
                if (!el) {
                    return;
                }
                parentNode = el.parentNode;
                bufferDirective = this.directive(BUFFERED_VIEWS);
                if (parentNode && parentNode === bufferDirective.region.el.element()) {
                    return;
                }
                bufferDirective.els.appendChild(el);
            },
            // this needs to be modified for shared windows
            setElement: function () {
                var manager, region = this,
                    selector = region[SELECTOR],
                    parent = region[PARENT][PARENT];
                if (parent !== app) {
                    if (parent.is(RENDERED)) {
                        manager = parent.el.$(selector)[INDEX](0);
                    }
                } else {
                    manager = (region._owner$ || $)(selector)[INDEX](0);
                }
                if (!manager) {
                    return;
                }
                region.directive(ELEMENT).set(manager);
            },
            render: function () {
                var region = this,
                    bufferDirective = region.directive(BUFFERED_VIEWS),
                    elementDirective = region.directive(ELEMENT);
                region.unmark(RENDERED);
                // doc frags on regionviews, list of children to trigger events on
                bufferDirective.ensure();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                region.setElement();
                // update new element's attributes
                elementDirective.setAttributes();
                // puts children back inside parent
                region[CHILDREN].eachCall(RENDER);
                // attach region element
                // appends child elements
                elementDirective.el.append(bufferDirective.els);
                // pass the buffered views up
                // region.passBuffered(list);
                // mark the view as rendered
                region.mark(RENDERED);
                // reset buffered objects
                bufferDirective.reset();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            }
        }, BOOLEAN_TRUE),
        // view needs to be pitted against a document
        View = Region.extend('View', {
            tagName: 'div',
            filter: BOOLEAN_TRUE,
            templateIsElement: BOOLEAN_FALSE,
            getRegion: getRegion,
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
                var view = this;
                Parent[CONSTRUCTOR].call(view, secondary);
                view.directive(ELEMENT).ensure();
                this.id = uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE);
                this.establishRegions();
                return view;
            },
            establishRegions: function () {
                var regions = result(this, 'regions');
                var regionsResult = keys(regions)[LENGTH] && this.directive(REGION_MANAGER).establish(regionsResult);
                return this;
            },
            valueOf: function () {
                return this.id;
            },
            destroy: function () {
                var view = this;
                if (view.is('destroying')) {
                    return view;
                }
                view.mark('destroying');
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall('destroy');
                }
                view.el.destroy();
                view.directiveDestruction(ELEMENT);
                Parent[CONSTRUCTOR][PROTOTYPE].destroy.call(view);
                return view;
            },
            render: function () {
                var newelementisDifferent, element, json, html, renderResult, bufferedDirective, template, settingElement, view = this,
                    // you might be able to do this a better way
                    neverRendered = !view.is(RENDERED);
                view.unmark(RENDERED);
                if (!result(view, 'filter')) {
                    return view;
                }
                element = view.directive(ELEMENT);
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT]('before:' + RENDER);
                // renders the html
                if (isFunction(view.template)) {
                    json = view.model && view.model.toJSON();
                    // try to generate template
                    html = view.template(json);
                } else {
                    html = view.template;
                }
                settingElement = view.el;
                if (result(view, 'templateIsElement')) {
                    settingElement = view.el.owner.fragment(html).children();
                    html = BOOLEAN_FALSE;
                }
                newelementisDifferent = settingElement !== element.el;
                if (newelementisDifferent) {
                    element.unset();
                }
                // turns ui into a string
                element.degenerateUIBindings();
                // unbinds and rebinds element only if it changes
                element.set(settingElement);
                if (html !== BOOLEAN_FALSE) {
                    element.render(html);
                }
                element.generateUIBindings();
                element.bindUI();
                if (newelementisDifferent || neverRendered) {
                    element.delegateEvents();
                    element.delegateTriggers();
                }
                // update new element's attributes
                element.setAttributes();
                // mark the view as rendered
                view.establishRegions();
                view.mark(RENDERED);
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                // pass buffered views up to region
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall(RENDER);
                }
                element = view[PARENT] && view[PARENT].attach(view);
                return view;
            }
        }, BOOLEAN_TRUE),
        _View = factories.View,
        establishRegion = function (key, selector) {
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
                // if ($selected) {
                region.el = $selected;
                // }
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
            list: Collection(),
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