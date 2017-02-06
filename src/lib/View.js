var REGION_MANAGER = 'RegionManager',
    DOCUMENT_VIEW = 'DocumentView',
    DOCUMENT_MANAGER = 'DocumentManager',
    RENDER_LOOP = 'renderLoop',
    RENDER = 'render',
    RENDERED = RENDER + 'ed',
    RENDERING = RENDER + 'ing',
    OPTIONS = 'options',
    MODEL_ID = 'modelId',
    ESTABLISHED = 'established',
    verifyOwner$ = function (instance) {
        if (instance.owner$) {
            return;
        }
        exception('object needs an owner$ function to scope itself against a ' + DOCUMENT);
    },
    View = app.block(function (app) {
        var BUFFERED_VIEWS = 'bufferedViews',
            noRegionMessage = 'that region does not exist',
            invalidRegionMessage = 'invalid key passed for region name',
            forEachCall = _.forEachCall,
            elementDoesNotExistAt = function (key) {
                return exception('an element does not exist at key: ' + key);
            },
            // region views are useful if you're constructing different components
            // from a separate place and just want it to be in the buffer pipeline
            // very useful for componentizing your ui
            Parent = factories.Parent,
            makesView = function (region, view_) {
                var isModel, child, Child, isView, model = view_,
                    children = region.directive(CHILDREN);
                if ((isView = View.isInstance(view_))) {
                    if ((child = children.get(MODEL_ID, view_.model.id))) {
                        return child;
                    } else {
                        return view_;
                    }
                }
                if ((isModel = Model.isInstance(model))) {
                    if ((child = children.get(MODEL_ID, model.id))) {
                        return child;
                    }
                } else {
                    Child = region.childConstructor();
                    return Child({
                        model: Child.fn.Model(view_)
                    });
                }
            },
            /**
             * @class Region
             * @augments Parent
             * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
             */
            Region = factories.Region = Parent.extend('Region',
                /**
                 * @lends Region.prototype
                 */
                {
                    /**
                     * Returns the attributes of the view element that will be diffed and applied on each render.
                     * @method
                     * @returns {Object} key value pairs of attributes and respective values.
                     */
                    attributes: returns(BOOLEAN_FALSE),
                    /**
                     * Returns the constructor of the default view that will be placed in the Region when it is asked to make a child. This is often when add is called usually from the previous view's addChildView.
                     * @return {Function} The default child View's constructor. The default is the containing view's Child member
                     * @example
                     * region.childConstructor(); // factories.View
                     */
                    childConstructor: function () {
                        var region = this;
                        return region.Child === BOOLEAN_TRUE ? region.parentView().childConstructor() : region.Child;
                    },
                    /**
                     * Gets the parent that this region is housed under. The direct parent is the RegionManager
                     * @return {View} Closest parent view of the region calling the method
                     * @example
                     * region.parentView(); // View
                     */
                    parentView: function () {
                        return this[PARENT][PARENT];
                    },
                    constructor: function (secondary) {
                        var model = this;
                        Parent.constructor.call(model, secondary);
                        verifyOwner$(model);
                        model.directive(CHILDREN);
                        model.setElement();
                        return model;
                    },
                    /**
                     * Add new views to this region
                     * @param {Model|Array|Collection} models singular or list of models. Will be normalized through Collection constructor and adopted as necessary.
                     * @param {Object} options dictionary of key value pairs to be passed as the second argument
                     * @param {[type]} renderer [description]
                     */
                    add: function (models_, renderer) {
                        var bufferedViewsDirective, region = this,
                            unwrapped = Collection(models_).reduce(function (memo, item) {
                                var adoption;
                                if ((adoption = region.adopt(item))) {
                                    memo.push(adoption);
                                }
                            }, []);
                        if (region.el) {
                            region.render(renderer);
                        }
                        return unwrapped;
                    },
                    /**
                     * Removes a view that is passed to it. Internally uses its super's remove method then iterates through each one and disowns it.
                     * @param  {View} view view to remove
                     * @return {Collection} Collection of views that were removed.
                     */
                    remove: function (view_) {
                        var region = this,
                            removed = region.super.fn.remove.call(region, view_);
                        return removed.forEach(function (item) {
                            region.disown(item[PARENT] || region, item);
                        });
                    },
                    /**
                     * Do all of the necessary steps in order to tie the view under this region. That is, disown it from it's previous owner, register various id's with the region's children
                     * @param  {View|Object} view View or object to be turned into a view and then adopted
                     * @return {View} View that was adopted
                     */
                    adopt: function (view_) {
                        var model, registry, view, children, region = this;
                        if (!view_) {
                            return BOOLEAN_FALSE;
                        }
                        view = makesView(region, view_);
                        if (view[PARENT]) {
                            if (view[PARENT] === region) {
                                return BOOLEAN_FALSE;
                            } else {
                                region.disown(view[PARENT], view);
                            }
                        }
                        children = region.directive(CHILDREN);
                        view[PARENT] = region;
                        children.attach(view);
                        model = view.model;
                        registry = children.directive(REGISTRY);
                        registry.keep('viewCid', view.cid, view);
                        registry.keep('modelCid', model.cid, view);
                        registry.keep(MODEL_ID, model.id, view);
                        return view;
                    },
                    /**
                     * Detaches a view from the children registry and array and drops the respective cid's that belong to the view and model.
                     * @param  {Parent} currentParent A parent object that the view belongs to.
                     * @param  {View} view child view
                     * @return {Region} the region that this method was called on.
                     */
                    disown: function (currentParent, view) {
                        var model, registry, region = this,
                            children = (currentParent || view[PARENT])[CHILDREN];
                        view[PARENT] = NULL;
                        model = view.model;
                        children.remove(view);
                        registry = children.directive(REGISTRY);
                        registry.drop('viewCid', view.cid);
                        registry.drop('modelCid', model.cid);
                        registry.drop(MODEL_ID, model.id);
                        return region;
                    },
                    /**
                     * Buffers view element to a fragment.
                     * @param  {View} view Buffer the element of this view.
                     * @return {Region} Region that the view's element was buffered against.
                     */
                    buffer: function (view) {
                        var currentParentNode, bufferDirective, region = this,
                            viewEl = view.el && view.el.element(),
                            regionElement = region.el.element(),
                            viewParentElement = view.parentElement(region);
                        if (!viewEl) {
                            return region;
                        }
                        currentParentNode = viewEl.parentNode;
                        if (!currentParentNode || currentParentNode !== viewParentElement) {
                            if (viewParentElement === regionElement) {
                                bufferDirective = region.directive(BUFFERED_VIEWS);
                                bufferDirective.els.append(viewEl);
                            } else {
                                region.owner$(viewParentElement).append(viewEl);
                            }
                        }
                        return region;
                    },
                    /**
                     * Sets the element based on the selector on the region.
                     * @retuns {Region} the this
                     */
                    setElement: function () {
                        var region = this,
                            selector = region[SELECTOR],
                            parent = region[PARENT][PARENT],
                            manager = parent[PARENT] && parent[PARENT][PARENT] === app ? parent.$(selector).item(0) : parent.owner$.returnsManager(parent.directive(CAPITAL_ELEMENT).hashed[selector]);
                        if (!manager) {
                            return elementDoesNotExistAt(selector);
                        }
                        region.directive(CAPITAL_ELEMENT).set(manager);
                        return region;
                    },
                    /**
                     * Renders the element based on input from the view, which holds the template that the element will be rendered with along with the tag name, and attributes.
                     * @param  {Function} preventChain_ [description]
                     * @return {[type]} [description]
                     */
                    render: function (preventChain_) {
                        var children, region = this,
                            bufferDirective = region.directive(BUFFERED_VIEWS),
                            elementDirective = region.directive(CAPITAL_ELEMENT),
                            preventChain = preventChain_ || noop;
                        region.unmark(RENDERED);
                        // doc frags on regionviews, list of children to trigger events on
                        bufferDirective.ensure();
                        // request extra data or something before rendering: dom is still completely intact
                        region[DISPATCH_EVENT](BEFORE_COLON + RENDER);
                        // unbinds and rebinds element only if it changes
                        region.setElement();
                        // update new element's attributes
                        // elementDirective.setAttributes();
                        // puts children back inside parent
                        if ((children = region[CHILDREN])) {
                            if (preventChain(region)) {
                                // stop rendering child views, just buffer them
                                children.each(bindTo(region.buffer, region));
                            } else {
                                children.forEachCall(RENDER, preventChain);
                            }
                        }
                        // buffer region element
                        // appends child elements
                        elementDirective.el.append(bufferDirective.els);
                        region[DISPATCH_EVENT]('buffered');
                        // pass the buffered views up
                        // mark the view as rendered
                        region.mark(RENDERED);
                        // reset buffered objects
                        bufferDirective.reset();
                        // dispatch the render event
                        region[DISPATCH_EVENT](RENDER);
                        return region;
                    },
                    destroy: function () {
                        var children, region = this;
                        if ((children = region[CHILDREN])) {
                            children.slice().forEachCall(DESTROY);
                        }
                        return this;
                    }
                }),
            establishRegions = function (view, force) {
                var regionManager = view.directive(REGION_MANAGER);
                if (!force && regionManager.is(ESTABLISHED)) {
                    return;
                }
                var element = view.directive(CAPITAL_ELEMENT);
                regionManager.mark(ESTABLISHED);
                element.renderEl();
                element.diff();
                element.renderTemplate();
                return view;
            },
            addChildView = intendedApi(function (regionKey, views) {
                var added, region, view = this,
                    regionManager = view.directive(REGION_MANAGER);
                establishRegions(view);
                var result = (region = regionManager.get(regionKey)) ? (added = region.add(views)) : exception(noRegionMessage);
                if (added && added.length) {
                    view[DISPATCH_EVENT](regionKey + ':children:added', null, {
                        children: factories.Collection(added)
                    });
                }
                return result;
            }),
            removeChildView = intendedApi(function (regionKey, views) {
                var removed, region, view = this,
                    regionManager = view.directive(REGION_MANAGER);
                var result = regionManager.is(ESTABLISHED) && ((region = regionManager.get(regionKey)) ? (removed = region.remove(views)) : exception(noRegionMessage));
                if (removed && removed.length()) {
                    view[DISPATCH_EVENT](regionKey + ':children:removed', null, {
                        children: factories.Collection(removed)
                    });
                }
                return result;
            }),
            addRegion = parody(REGION_MANAGER, 'add'),
            getRegion = parody(REGION_MANAGER, 'get'),
            removeRegion = parody(REGION_MANAGER, 'remove'),
            // view needs to be pitted against a document
            /**
             * @class View
             * @augments Parent
             * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
             */
            View = factories.View = Model.extend('View', {
                Model: Model,
                modifiers: noop,
                getRegion: getRegion,
                addRegion: addRegion,
                removeRegion: removeRegion,
                addChildView: addChildView,
                removeChildView: removeChildView,
                selector: returns('div'),
                template: returns(BOOLEAN_FALSE),
                canRenderAsync: returns(BOOLEAN_FALSE),
                getChildViews: function (key) {
                    return this.getRegion(key).directive(CHILDREN);
                },
                getChildView: function (region, category, key) {
                    return this.getChildViews(region).directive('Registry').get(category, key);
                },
                parentElement: function (region) {
                    return region.el.element();
                },
                parentView: function () {
                    var found, view = this,
                        parent = view[PARENT];
                    while (!found && parent) {
                        parent = parent[PARENT];
                        if (View.isInstance(parent)) {
                            found = parent;
                        }
                    }
                    return found;
                },
                bindModel: function (m) {
                    var view = this,
                        modelEvents = result(view, 'modelEvents'),
                        model = Model.isInstance(m) ? m : view.Model(m);
                    view.model = model;
                    // view.directive(REGISTRY).keep(INSTANCES, MODEL, model);
                    view.listenTo(view.model, modelEvents);
                    if (view.autoRenders()) {
                        view.listenTo(view.model, CHANGE, view.render);
                    }
                },
                // model: function () {
                //     return this.directive(REGISTRY).get(INSTANCES, MODEL);
                // },
                autoRenders: returns(BOOLEAN_TRUE),
                constructor: function (secondary_) {
                    var view = this;
                    var secondary = secondary_ || {};
                    view.id = app.counter();
                    view.bindModel(secondary.model);
                    delete secondary.model;
                    Model[CONSTRUCTOR].call(view, NULL, secondary);
                    view.directive(CAPITAL_ELEMENT).ensure();
                    return view;
                },
                // mostly sorting purposes
                valueOf: function () {
                    return this.model.valueOf();
                },
                destroy: function (handler) {
                    var el, view = this;
                    if (view.is(DESTROYING)) {
                        return view;
                    } else {
                        view[DISPATCH_EVENT](BEFORE_DESTROY);
                    }
                    view.mark(DESTROYING);
                    view.directiveDestruction(REGION_MANAGER);
                    // el = view.el;
                    // if (el && el.destroy) {
                    //     el.destroy(handler);
                    // }
                    view.directiveDestruction(CAPITAL_ELEMENT);
                    Model[CONSTRUCTOR].fn.destroy.call(view);
                    if (view.parent) {
                        view.parent.remove(view);
                    }
                    return view;
                },
                render: function (preventChain) {
                    var newelementisDifferent, element, json, html, renderResult, bufferedDirective, template, settingElement, view = this;
                    // you might be able to do this a better way
                    view.mark(RENDERING);
                    element = view.directive(CAPITAL_ELEMENT);
                    // prep the object with extra members (doc frags on regionviews,
                    // list of children to trigger events on)
                    // request extra data or something before rendering: dom is still completely intact
                    view[DISPATCH_EVENT](BEFORE_COLON + RENDER);
                    // renders the html
                    // mark the view as rendered
                    // pass buffered views up to region
                    if (view[REGION_MANAGER]) {
                        view[REGION_MANAGER].list.forEachCall(RENDER, isFunction(preventChain) ? preventChain : returnsTrue);
                    }
                    establishRegions(view, BOOLEAN_TRUE);
                    element = view[PARENT] && view[PARENT].buffer(view);
                    return view;
                }
            }),
            _View = factories.View,
            bufferedEnsure = function () {
                var buffers = this,
                    _bufferedEls = buffers.els && buffers.els.is(FRAGMENT) ? 1 : buffers.resetEls();
            },
            bufferedReset = function () {
                var cached = this.views;
                this.resetEls();
                return cached;
            },
            bufferedElsReset = function () {
                this.els = this.region.owner$.fragment();
            },
            RegionManager = factories[REGION_MANAGER] = factories.Directive.extend(REGION_MANAGER, {
                constructor: function (instance) {
                    var regionManager = this;
                    regionManager.parent = instance;
                    regionManager.list = Collection();
                    return regionManager;
                },
                create: function (where, region_) {
                    var key, regionManagerDirective = this,
                        parent = regionManagerDirective[PARENT],
                        // assume that it is a region
                        selector = region_,
                        region = region_;
                    if (isInstance(region, Region)) {
                        return region;
                    }
                    region = Region(extend([{
                        selector: selector || EMPTY_STRING,
                        owner$: parent.owner$
                    }, isObject(region) ? region : {}, {
                        id: where,
                        key: region_,
                        parent: regionManagerDirective
                    }]));
                    // regionManagerDirective.list.push(region);
                    regionManagerDirective.list.keep(ID, where, region);
                    return region;
                },
                establish: intendedApi(function (key, selector) {
                    if (!key) {
                        exception(invalidRegionMessage);
                    }
                    var $selected, element, regionManagerDirective = this,
                        parentView = regionManagerDirective[PARENT],
                        region = regionManagerDirective.list.get(ID, key),
                        documentManager = parentView[PARENT];
                    if (!region) {
                        region = regionManagerDirective.create(key, selector);
                    }
                    if (documentManager && documentManager[PARENT] === app) {
                        // come at it from the top
                        $selected = parentView.el.$(selector)[ITEM](0);
                        if (!$selected) {
                            elementDoesNotExistAt(selector);
                        }
                    } else {
                        // i should already have this one
                        // from the
                        element = parentView.directive(CAPITAL_ELEMENT);
                        element = element.hashed[region[SELECTOR]];
                        if (!element) {
                            elementDoesNotExistAt(selector);
                        }
                        $selected = parentView.owner$.returnsManager(element);
                    }
                    if (!region.el) {
                        region.el = $selected;
                    }
                }),
                destroy: function () {},
                remove: function (region_) {
                    var regionManager = this;
                    var region = isString(region_) ? regionManager.get(region_) : region_;
                    regionManager.remove(region);
                    regionManager.drop(region.id, region);
                },
                add: intendedApi(function (key, selector) {
                    var regionManagerDirective = this;
                    var region = regionManagerDirective.list.get(ID, key);
                    if (!region) {
                        regionManagerDirective.establish(key, selector);
                    }
                }),
                get: function (key) {
                    return this.list.get(ID, key);
                }
            }),
            BufferedViews = factories[BUFFERED_VIEWS] = factories.Directive.extend(BUFFERED_VIEWS, {
                constructor: function (instance) {
                    var bufferedViews = this;
                    bufferedViews.region = instance;
                    this.resetEls();
                    return bufferedViews;
                },
                reset: bufferedReset,
                ensure: bufferedEnsure,
                resetEls: bufferedElsReset
            }),
            DocumentView = factories[DOCUMENT_VIEW] = factories.Model.extend(DOCUMENT_VIEW, {
                regions: noop,
                addRegion: addRegion,
                getRegion: getRegion,
                removeRegion: removeRegion,
                removeChildView: removeChildView,
                addChildView: intendedApi(function (key, view_) {
                    var regionManager = this.directive(REGION_MANAGER);
                    var region = regionManager.get(key);
                    view_.render();
                    region.add(view_, returnsTrue);
                }),
                childConstructor: function () {
                    return this.$.View;
                },
                render: function (preventChain) {
                    var view = this;
                    view.directive(REGION_MANAGER).list.forEachCall(RENDER, preventChain);
                    return view;
                },
                constructor: function (options) {
                    var documentView = this;
                    merge(documentView, options);
                    return documentView;
                },
                chunk: function (id, fn) {
                    var docViewManager = this.parent,
                        modifications = docViewManager.modifications,
                        alreadyQueued = modifications.get(ID, id),
                        chunk = alreadyQueued || {
                            id: id,
                            fn: fn,
                            counter: 0
                        };
                    if (alreadyQueued) {
                        alreadyQueued.counter += 1;
                    }
                    modifications.keep(ID, id, chunk);
                    // modifications.push(chunk);
                    docViewManager.checkRenderLoop();
                }
            }),
            DocumentManager = factories[DOCUMENT_MANAGER] = factories.Model.extend(DOCUMENT_MANAGER, {
                checkRenderLoop: function () {
                    if (!this.get(RENDER_LOOP)) {
                        this.modify();
                    }
                },
                dependency: function () {
                    var docViewManager = this;
                    docViewManager.set(RENDER_LOOP, docViewManager.get(RENDER_LOOP) + 1);
                    return function () {
                        docViewManager.set(RENDER_LOOP, docViewManager.get(RENDER_LOOP) - 1);
                        docViewManager.checkRenderLoop();
                    };
                },
                modify: function () {
                    var finisher, documentView = this,
                        modifications = documentView.modifications;
                    if (!modifications.length()) {
                        return;
                    }
                    modifications = modifications.slice(0);
                    documentView.modifications = Collection();
                    // silently set write
                    finisher = documentView.dependency();
                    documentView.mark('writing');
                    modifications.forEachCallTry('fn');
                    // let everyone know when
                    // you're done writing
                    documentView.unmark('writing');
                    finisher();
                },
                constructor: function (app) {
                    // all managed and connected externally. no api
                    var documentManager = this;
                    documentManager.parent = app;
                    documentManager.documents = Collection();
                    documentManager.modifications = Collection();
                    this['constructor:Model']();
                    return documentManager;
                },
                getByDocument: function (doc) {
                    return this.documents.find(function (documentViews) {
                        return documentViews.el.element() === doc;
                    });
                },
                defaults: function () {
                    return {
                        renderLoop: 0
                    };
                }
            });
        var CAPITAL_ELEMENT = capitalize(ELEMENT);
        var basicViewTrigger = function (name, e) {
                return this[DISPATCH_EVENT](name, e.data(), {
                    instigator: e
                });
            },
            makeDelegateEventKeys = function (cid, bindings, key) {
                var viewNamespace = 'delegateEvents' + cid,
                    indexOfAt = indexOf(key, '@'),
                    hasAt = indexOfAt !== -1;
                return {
                    selector: hasAt ? normalizeUIString(key.slice(indexOfAt + 1), bindings) : EMPTY_STRING,
                    group: viewNamespace,
                    events: hasAt ? key.slice(0, indexOfAt).trim() : key
                };
            },
            normalizeUIString = function (uiString, ui) {
                return _.map(uiString.split(','), function (_split) {
                    var split = _split.trim();
                    return ui[split] || split;
                }).join(',');
            },
            // allows for the use of the @ui. syntax within
            // a given key for triggers and events
            // swaps the @ui with the associated selector.
            // Returns a new, non-mutated, parsed events hash.
            normalizeUIKeys = function (hash, ui) {
                return reduce(hash, function (memo, val, key) {
                    memo[normalizeUIString(key, ui)] = val;
                }, {});
            },
            Element = factories.Directive.extend(CAPITAL_ELEMENT, {
                constructor: function (view) {
                    this.view = view;
                    return this;
                },
                ensure: function () {
                    var el, element = this,
                        view = element.view,
                        selector = element[SELECTOR] || result(view, 'el');
                    if (selector) {
                        element[SELECTOR] = selector;
                    }
                    if (factories.DOMA.isInstance(selector)) {
                        return;
                    }
                    if (isString(selector)) {
                        // sets external element
                        el = selector;
                    } else {
                        // defauts back to wrapping the element
                        // creates internal element
                        if (element.el) {
                            el = element.el;
                        } else {
                            selector = parseSelector(view.selector());
                            el = element.create(selector.tag, selector.attrs);
                        }
                        // subclassed to expand the attributes that can be used
                    }
                    element.set(el);
                },
                create: function (tag) {
                    return this.view.owner$.createElement(tag);
                },
                unset: function () {
                    var element = this;
                    delete element.view.el;
                    delete element.el;
                },
                set: function (el) {
                    var directive = this;
                    directive.view.el = directive.el = el;
                },
                diff: function () {
                    var element = this,
                        manager = element.el,
                        view = element.view,
                        el = manager.element(),
                        model = view.model,
                        json = (model && model.toJSON()) || {},
                        // try to generate template
                        virtual = element.virtual = [view.selector(), element.attributes(), view.template(json, result(view, 'helpers') || {})],
                        comparison = view.owner$.nodeComparison(el, virtual, element.hashed, bindTo(element.comparisonFilter, element)),
                        keys = element.hashed = merge(element.hashed || {}, comparison.keys),
                        mutate = element.mutate = comparison.mutate,
                        modifiers = element.modifiers = merge({
                            // remove: noop,
                            update: noop,
                            swap: noop
                        }, isFunction(modifiers = view.modifiers()) ? {
                            swap: modifiers
                        } : modifiers);
                },
                comparisonFilter: function (node) {
                    // node is a virtual node, so json
                    var regionManager = this.view.directive(REGION_MANAGER),
                        // get the 3rd index, where all the data is stored
                        id = node[3] || {},
                        key = id.key;
                    // if you don't have an identifying key, and are not registered as a region, then go ahead
                    return !key || !regionManager.get(ID, key);
                },
                delta: function () {
                    var result, element = this,
                        view = element.view,
                        mutate = element.mutate,
                        modifiers = element.modifiers,
                        memo = BOOLEAN_FALSE;
                    if (element.mutate) {
                        delete element.mutate;
                        delete element.modifiers;
                        // if it's a function, then do it last
                        result = mutate.swap() || memo;
                        result = modifiers.swap() || result;
                        result = mutate.update() || result;
                        result = modifiers.update() || result;
                    }
                    return result;
                },
                renderEl: function () {
                    var replacing, elementsSwapped, element = this,
                        view = element.view,
                        settingElement = view.el,
                        newelementisDifferent = settingElement !== element.el;
                    if (newelementisDifferent) {
                        element.unset();
                    }
                    if (!newelementisDifferent && view.is(RENDERED)) {
                        return;
                    }
                    // turns ui into a hash
                    element.degenerateUIBindings();
                    element.undelegateEvents();
                    element.undelegateTriggers();
                    element.set(settingElement);
                    // these may change with a delta'd render
                    element.generateUIBindings();
                    element.delegateEvents();
                    element.delegateTriggers();
                },
                setState: function () {
                    var elementsSwapped, regions, regionsResult, element = this,
                        view = element.view;
                    view.unmark('asyncRendering');
                    // prevent future from triggering
                    view.owner$.documentView.chunk(view.cid, noop);
                    // if ((elementsSwapped = element.delta())) {
                    // ui objects changed. need to update groups
                    element.delta();
                    element.bindUI();
                    // }
                    view.unmark(RENDERING);
                    view.mark(RENDERED);
                    regions = result(view, 'regions');
                    regionsResult = keys(regions)[LENGTH] && view.RegionManager.establish(regions);
                    // dispatch the render event
                    view[DISPATCH_EVENT](RENDER);
                    return element;
                },
                renderTemplate: function () {
                    var element = this,
                        view = element.view;
                    // if it is attached and the documentview is not writing already, then queue it up
                    if (view.el.is('attached') && view.canRenderAsync()) {
                        view.mark('asyncRendering');
                        view.owner$.documentView.chunk(view.cid, bindTo(element.setState, element));
                    } else {
                        element.setState();
                    }
                    return element;
                },
                degenerateUIBindings: function () {
                    var directive = this;
                    if (!directive.ui) {
                        return NULL;
                    }
                    directive.ui = directive.view.ui = directive.uiBindings;
                    delete directive.uiBindings;
                },
                generateUIBindings: function () {
                    var directive = this,
                        uiBindings = directive.uiBindings || result(directive.view, 'ui'),
                        ui = directive.ui = directive.ui || {};
                    if (directive.uiBindings) {
                        return directive;
                    }
                    // save it to skip the result call later
                    directive.uiBindings = uiBindings;
                    return directive;
                },
                delegateEvents: function () {
                    var key, method, match, directive = this,
                        view = directive.view,
                        el_ = directive.el,
                        elementBindings = directive.elementBindings || result(view, 'elementEvents'),
                        __events = [];
                    if (directive.elementBindings) {
                        directive.elementBindings = elementBindings;
                    }
                    if (!el_) {
                        return directive;
                    }
                    directive.cachedElementBindings = mapValues(elementBindings, function (method, key) {
                        var el = el_,
                            object = makeDelegateEventKeys(view.cid, directive.uiBindings, key),
                            bound = object.fn = bindTo(isString(method) ? view[method] : method, view);
                        __events.push(object);
                        el.on(object.events, object[SELECTOR] || NULL, bound, object.capture, object.group);
                    });
                    directive.cachedElementBindings = __events;
                    return directive;
                },
                undelegateEvents: function () {
                    var key, method, match, directive = this,
                        view = directive.view,
                        el = directive.el,
                        elementBindings = directive.cachedElementBindings;
                    if (!elementBindings || !el) {
                        return directive;
                    }
                    forOwn(elementBindings, function (binding) {
                        el.off(binding.events, binding[SELECTOR] || NULL, binding.fn);
                    });
                    directive.cachedElementBindings = UNDEFINED;
                    return directive;
                },
                delegateTriggers: function () {
                    var key, method, match, directive = this,
                        view = directive.view,
                        el = directive.el,
                        elementTriggers = directive.elementTriggers || result(view, 'elementTriggers'),
                        __events = [];
                    if (!directive.elementTriggers) {
                        directive.elementTriggers = elementTriggers;
                    }
                    if (!el) {
                        return directive;
                    }
                    forOwn(elementTriggers, function (method, key) {
                        var object = makeDelegateEventKeys(view.cid, directive.uiBindings, key),
                            bound = object.fn = bindWith(basicViewTrigger, [view, method]);
                        el.on(object.events, object[SELECTOR], bound, object.capture, object.group);
                    });
                    directive.cachedElementTriggers = __events;
                    return directive;
                },
                undelegateTriggers: function () {
                    var key, method, match, directive = this,
                        view = directive.view,
                        el = directive.el,
                        elementBindings = directive.cachedElementTriggers;
                    if (!directive.cachedElementTriggers || !el) {
                        return directive;
                    }
                    forOwn(elementBindings, function (binding) {
                        el.off(binding.events.join(SPACE), binding[SELECTOR], binding.fn);
                    });
                    directive.cachedElementTriggers = UNDEFINED;
                    return directive;
                },
                attributes: function () {
                    return result(this.view, 'attributes');
                },
                bindUI: function () {
                    var directive = this,
                        uiBindings = directive.uiBindings;
                    directive.ui = directive.view.ui = uiBindings ? mapValues(uiBindings, bindTo(directive.el.$, directive.el)) : {};
                    return directive;
                }
            });
        app.defineDirective(DOCUMENT_MANAGER, DocumentManager);
        app.defineDirective(REGION_MANAGER, RegionManager, function (directive, target, name) {
            if (directive.is(DESTROYING)) {
                return;
            }
            directive.mark(DESTROYING);
            directive.list.slice().forEachCall(DESTROY);
            delete directive.parent;
        });
        app.defineDirective(BUFFERED_VIEWS, BufferedViews);
        app.defineDirective(CAPITAL_ELEMENT, Element, function (directive, instance) {
            directive.el.destroy();
            directive.unset();
            var ui = directive.ui;
            directive.degenerateUIBindings();
            forEachCall(ui, 'destroy');
        });
        app.undefine(function (app, windo, opts) {
            var doc = windo[DOCUMENT];
            if (!doc) {
                return;
            }
            var documentManager = app.directive(DOCUMENT_MANAGER),
                documents = documentManager.documents,
                documentView = documents.get(ID, doc[__ELID__]);
            if (documentView) {
                exception('document has already been setup');
            }
            var $ = merge(opts.$, {
                Region: Region.extend({
                    owner$: opts.$
                }),
                View: View.extend({
                    owner$: opts.$
                })
            });
            documentView = DocumentView({
                $: $,
                owner$: $,
                id: doc[__ELID__],
                el: $.returnsManager(doc),
                parent: documentManager
            });
            $.documentView = documentView;
            documents.keep(ID, documentView.id, documentView);
        });
        return View;
    });