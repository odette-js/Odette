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
        REGION_MANAGER = 'RegionManager',
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements',
        getRegion = function (key) {
            return this.list.get(ID, key);
        },
        addRegion = intendedApi(function (key, selector) {
            var regionManagerDirective = this;
            var region = regionManagerDirective.list.get(ID, key);
            if (!region) {
                regionManagerDirective.establish(key, selector);
            }
        }),
        noRegionMessage = {
            message: 'that region does not exist'
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
        Parent = factories.Parent,
        Model = factories.Model,
        makesView = function (region, view_) {
            var isModel, child, Child, isView, model = view_,
                children = region.directive(CHILDREN);
            if ((isView = View.isInstance(view_))) {
                if ((child = children.get('modelId', view_.model.id))) {
                    return child;
                } else {
                    return view_;
                }
            }
            if ((isModel = Model.isInstance(model))) {
                if ((child = children.get('modelId', model.id))) {
                    return child;
                }
            } else {
                Child = region.childConstructor();
                return Child({
                    model: Child[CONSTRUCTOR][PROTOTYPE].Model(view_)
                });
            }
        },
        disown = function (currentParent, view, region) {
            var children = currentParent[CHILDREN];
            view[PARENT] = NULL;
            children.remove(view);
            children.drop('viewCid', view.cid);
            children.drop('modelCid', view.model.cid);
            children.drop('modelId', view.model.id);
            return region;
        },
        Region = factories.Region = Parent.extend('Region', {
            // Child: BOOLEAN_FALSE,
            elementAttributes: returns(BOOLEAN_FALSE),
            className: returns(BOOLEAN_FALSE),
            childConstructor: function () {
                return this.Child === BOOLEAN_TRUE ? this[PARENT][PARENT].childConstructor() : this.Child;
            },
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
                    unwrapped = Collection(models_).foldl(function (memo, item) {
                        var adoption;
                        // var model = View.isInstance(item) ? item.model : item;
                        if ((adoption = region.adopt(item))) {
                            memo.push(adoption);
                        }
                        return memo;
                    }, []);
                if (region.el) {
                    region.render();
                }
                return unwrapped;
            },
            adopt: function (view_) {
                var view, region = this,
                    children = region[CHILDREN];
                if (!view_) {
                    return region;
                }
                view = makesView(region, view_);
                if (view[PARENT]) {
                    if (view[PARENT] === region) {
                        return BOOLEAN_FALSE;
                    } else {
                        disown(view[PARENT], view, region);
                    }
                }
                view[PARENT] = region;
                children.add(view);
                children.keep('viewCid', view.cid, view);
                children.keep('modelCid', view.model.cid, view);
                children.keep('modelId', view.model.id, view);
                return view;
            },
            attach: function (view) {
                var parentNode, bufferDirective, region = this,
                    el = view.el && view.el.element();
                if (!el) {
                    return region;
                }
                parentNode = el.parentNode;
                bufferDirective = region.directive(BUFFERED_VIEWS);
                if (parentNode && parentNode === region.el.element()) {
                    return region;
                }
                bufferDirective.els.appendChild(el);
                return region;
            },
            // this needs to be modified for shared windows
            setElement: function () {
                var manager, region = this,
                    selector = region[SELECTOR],
                    parent = region[PARENT][PARENT];
                if (parent !== app) {
                    if (parent.is(RENDERED)) {
                        manager = parent.el.$(selector)[ITEM](0);
                    }
                } else {
                    manager = (region.owner$ || $)(selector)[ITEM](0);
                }
                if (!manager) {
                    return region;
                }
                region.directive(CAPITAL_ELEMENT).set(manager);
                return region;
            },
            render: function () {
                var region = this,
                    bufferDirective = region.directive(BUFFERED_VIEWS),
                    elementDirective = region.directive(CAPITAL_ELEMENT);
                region.unmark(RENDERED);
                // doc frags on regionviews, list of children to trigger events on
                bufferDirective.ensure();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT](BEFORE_COLON + RENDER);
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
                // mark the view as rendered
                region.mark(RENDERED);
                // reset buffered objects
                bufferDirective.reset();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            }
        }),
        establishRegions = function (view) {
            var regions = result(view, 'regions');
            var regionsResult = keys(regions)[LENGTH] && view.directive(REGION_MANAGER).establish(regions);
            return view;
        },
        addChildView = intendedApi(function (regionKey, views) {
            var region;
            return (region = this.directive(REGION_MANAGER).get(regionKey)) ? region.add(views) : exception(noRegionMessage);
        }),
        removeChildView = intendedApi(function (regionKey, views) {
            var region;
            return (region = this.directive(REGION_MANAGER).get(regionKey)) ? region.remove(views) : exception(noRegionMessage);
        }),
        // view needs to be pitted against a document
        View = factories.View = Region.extend('View', {
            Model: Model,
            Child: BOOLEAN_TRUE,
            childConstructor: Parent.fn.childConstructor,
            getRegion: parody(REGION_MANAGER, 'get'),
            addRegion: parody(REGION_MANAGER, 'add'),
            removeRegion: parody(REGION_MANAGER, 'remove'),
            addChildView: addChildView,
            removeChildView: removeChildView,
            tagName: returns('div'),
            filter: returns(BOOLEAN_TRUE),
            elementIsTemplate: returns(BOOLEAN_FALSE),
            template: returns(EMPTY_STRING),
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
            constructor: function (secondary_) {
                var view = this;
                var secondary = secondary_ || {};
                secondary.model = Model.isInstance(secondary.model) ? secondary.model : view.Model(secondary.model);
                Parent[CONSTRUCTOR].call(view, secondary);
                view.directive(CAPITAL_ELEMENT).ensure();
                this.id = uniqueId(BOOLEAN_FALSE, BOOLEAN_TRUE);
                establishRegions(this);
                return view;
            },
            // mostly sorting purposes
            valueOf: function () {
                return this.model.valueOf();
            },
            destroy: function (handler) {
                var view = this;
                if (view.is(DESTROYING)) {
                    return view;
                } else {
                    view[DISPATCH_EVENT](BEFORE_DESTROY);
                }
                view.mark(DESTROYING);
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall(DESTROY);
                }
                if (view.el) {
                    view.el.destroy(handler);
                }
                view.directiveDestruction(CAPITAL_ELEMENT);
                Parent[CONSTRUCTOR][PROTOTYPE].destroy.call(view);
                return view;
            },
            render: function () {
                var newelementisDifferent, element, json, html, renderResult, bufferedDirective, template, settingElement, view = this,
                    // you might be able to do this a better way
                    neverRendered = !view.is(RENDERED);
                view.unmark(RENDERED);
                if (!view.filter()) {
                    return view;
                }
                element = view.directive(CAPITAL_ELEMENT);
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT](BEFORE_COLON + RENDER);
                // renders the html
                json = view.model && view.model.toJSON();
                // try to generate template
                html = view.template(json);
                settingElement = view.el;
                if (view.elementIsTemplate()) {
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
                establishRegions(view);
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
        }),
        // Child = Region[CONSTRUCTOR][PROTOTYPE].Child = View,
        _View = factories.View,
        establishRegion = function (key, selector) {
            var regionManagerDirective = this,
                parentView = regionManagerDirective[PARENT];
            if (!key) {
                return regionManagerDirective;
            }
            intendedObject(key, selector, function (key, selector) {
                var $selected, region = regionManagerDirective.list.get(ID, key);
                if (!region) {
                    region = regionManagerDirective.create(key, selector);
                }
                if (parentView !== app) {
                    $selected = parentView.el.$(region[SELECTOR])[ITEM](0);
                } else {
                    $selected = $(region[SELECTOR])[ITEM](0);
                }
                region.el = $selected;
            });
            return regionManagerDirective;
        },
        removeRegion = function (region_) {
            // var regionManager = this;
            // var region = isString(region_) ? regionManager.get(region_) : region_;
            // regionManager.remove(region);
            // regionManager.drop(region.id, region);
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
                parent: regionManagerDirective
                // ,
                // owner$: makeQueryScope(parent)
                // ,
                // isAttached: parent === app ? BOOLEAN_TRUE : parent.isAttached
            }));
            regionManagerDirective.list.push(region);
            regionManagerDirective.list.keep(ID, where, region);
            return region;
        },
        bufferedEnsure = function () {
            var buffers = this,
                // _bufferedViews = isArray(buffers.views) ? 1 : buffers.resetViews(),
                _bufferedEls = isFragment(buffers.els) ? 1 : buffers.resetEls();
        },
        bufferedReset = function () {
            var cached = this.views;
            this.resetEls();
            return cached;
        },
        bufferedElsReset = function () {
            this.els = document.createDocumentFragment();
        },
        RegionManager = factories[REGION_MANAGER] = factories.Directive.extend(REGION_MANAGER, {
            constructor: function (instance) {
                var regionManager = this;
                regionManager.parent = instance;
                regionManager.list = Collection();
                return regionManager;
            },
            create: createRegion,
            establish: establishRegion,
            remove: removeRegion,
            add: addRegion,
            get: getRegion
        }),
        BufferedViews = factories[BUFFERED_VIEWS] = factories.Directive.extend(BUFFERED_VIEWS, {
            constructor: function (instance) {
                var bufferedViews = this;
                bufferedViews.region = instance;
                bufferedViews.els = $.createDocumentFragment();
                return bufferedViews;
            },
            reset: bufferedReset,
            ensure: bufferedEnsure,
            resetEls: bufferedElsReset
        });
    app.defineDirective(REGION_MANAGER, RegionManager[CONSTRUCTOR]);
    app.defineDirective(BUFFERED_VIEWS, BufferedViews[CONSTRUCTOR]);
    app.extend({
        addChildView: addChildView,
        removeChildView: removeChildView
    });
    // app.extend(foldl(toArray('add,remove,get'), function (memo, key) {
    //     memo[key + 'Region'] = parody(REGION_MANAGER, key);
    //     return memo;
    // }, {
    //     addChildView: addChildView,
    //     removeChildView: removeChildView
    // }));
    // just put it on the app immediately so that people can access it as a property if they want
    app.directive(REGION_MANAGER);
});