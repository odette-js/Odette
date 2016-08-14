var REGION_MANAGER = 'RegionManager',
    DOCUMENT_VIEW = 'DocumentView',
    DOCUMENT_MANAGER = 'DocumentManager',
    RENDER_LOOP = 'renderLoop',
    verifyOwner$ = function (instance) {
        if (instance.owner$) {
            return;
        }
        exception('object needs an owner$ function to scope itself against a ' + DOCUMENT);
    };
app.scope(function (app) {
    var protoProp = _.protoProp,
        isFragment = _.isFragment,
        isInstance = _.isInstance,
        isFunction = _.isFunction,
        isArrayLike = _.isArrayLike,
        intendedObject = _.intendedObject,
        RENDER = 'render',
        RENDERING = RENDER + 'ing',
        RENDERED = RENDER + 'ed',
        OPTIONS = 'options',
        MODEL_ID = 'modelId',
        ESTABLISHED = 'established',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        BUFFERED_VIEWS = 'bufferedViews',
        noRegionMessage = 'that region does not exist',
        invalidRegionMessage = 'invalid key passed for region name',
        elementDoesNotExistAt = function (key) {
            return exception('an element does not exist at ' + key);
        },
        /**
         * @class View
         * @augments Model
         * @augments Model
         * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
         */
        // region views are useful if you're constructing different components
        // from a separate place and just want it to be in the buffer pipeline
        // very useful for componentizing your ui
        Parent = factories.Parent,
        Model = factories.Model,
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
                    model: Child[CONSTRUCTOR][PROTOTYPE].Model(view_)
                });
            }
        },
        disown = function (currentParent, view, region) {
            var model, children = currentParent[CHILDREN];
            view[PARENT] = NULL;
            children.remove(view);
            model = view.model;
            children.drop('viewCid', view.cid);
            children.drop('modelCid', model.cid);
            children.drop(MODEL_ID, model.id);
            return region;
        },
        Region = factories.Region = Parent.extend('Region', {
            attributes: returns(BOOLEAN_FALSE),
            childConstructor: function () {
                var region = this;
                return region.Child === BOOLEAN_TRUE ? region[PARENT][PARENT].childConstructor() : region.Child;
            },
            constructor: function (secondary) {
                var model = this;
                model.super.call(model, secondary);
                verifyOwner$(model);
                model.directive(CHILDREN);
                model.setElement();
                return model;
            },
            add: function (models_, options_, renderer) {
                var bufferedViewsDirective, region = this,
                    options = options_ || {},
                    unwrapped = Collection(models_).foldl(function (memo, item) {
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
            adopt: function (view_) {
                var model, view, region = this,
                    children = region[CHILDREN];
                if (!view_) {
                    return BOOLEAN_FALSE;
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
                children.attach(view);
                model = view.model;
                children.keep('viewCid', view.cid, view);
                children.keep('modelCid', model.cid, view);
                children.keep(MODEL_ID, model.id, view);
                return view;
            },
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
                        $(viewParentElement).append(viewEl);
                    }
                }
                return region;
            },
            // this needs to be modified for shared windows
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
            render: function (preventChain_) {
                var region = this,
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
                if (preventChain(region)) {
                    // stop rendering child views, just buffer them
                    region[CHILDREN].each(region.buffer, region);
                } else {
                    region[CHILDREN].eachCall(RENDER, preventChain);
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
            }
        }),
        establishRegions = function (view, force) {
            var regionManager = view.directive(REGION_MANAGER);
            if (!force && regionManager.is(ESTABLISHED)) {
                return;
            }
            // var regions = result(view, 'regions');
            var element = view.directive(CAPITAL_ELEMENT);
            regionManager.mark(ESTABLISHED);
            element.renderEl();
            element.diff();
            element.renderTemplate();
            // var regionsResult = keys(regions)[LENGTH] && regionManager.establish(regions);
            return view;
        },
        addChildView = intendedApi(function (regionKey, views) {
            var region, view = this,
                regionManager = view.directive(REGION_MANAGER);
            establishRegions(view);
            return (region = regionManager.get(regionKey)) ? region.add(views) : exception(noRegionMessage);
        }),
        removeChildView = intendedApi(function (regionKey, views) {
            var region, regionManager = this.directive(REGION_MANAGER);
            return regionManager.is(ESTABLISHED) && ((region = regionManager.get(regionKey)) ? region.remove(views) : exception(noRegionMessage));
        }),
        addRegion = parody(REGION_MANAGER, 'add'),
        getRegion = parody(REGION_MANAGER, 'get'),
        removeRegion = parody(REGION_MANAGER, 'remove'),
        // view needs to be pitted against a document
        View = factories.View = Parent.extend('View', {
            Model: Model,
            modifiers: noop,
            getRegion: getRegion,
            addRegion: addRegion,
            removeRegion: removeRegion,
            addChildView: addChildView,
            removeChildView: removeChildView,
            tagName: returns('div'),
            template: returns(BOOLEAN_FALSE),
            getChildViews: function (key) {
                return this.getRegion(key).directive(CHILDREN);
            },
            getChildView: function (region, category, key) {
                return this.getChildViews(region).directive('Registry').get(category, key);
            },
            parentElement: function (region) {
                return region.el.element();
            },
            childrenOf: function (key) {
                return this.directive(REGION_MANAGER).get(key).directive(CHILDREN);
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
            bindModel: function (model) {
                var view = this,
                    modelEvents = result(view, 'modelEvents');
                view.model = Model.isInstance(model) ? model : view.Model(model);
                view.listenTo(view.model, modelEvents);
                view.listenTo(view.model, CHANGE, view.render);
            },
            constructor: function (secondary_) {
                var view = this;
                var secondary = secondary_ || {};
                view.id = app.counter(BOOLEAN_FALSE, BOOLEAN_TRUE);
                view.bindModel(secondary.model);
                delete secondary.model;
                Parent[CONSTRUCTOR].call(view, secondary);
                view.directive(CAPITAL_ELEMENT).ensure();
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
                    view[REGION_MANAGER].list.eachCall(RENDER, isFunction(preventChain) ? preventChain : returnsTrue);
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
                region = Region(extend({
                    selector: selector || EMPTY_STRING,
                    owner$: parent.owner$
                }, isObject(region) ? region : {}, {
                    id: where,
                    key: region_,
                    parent: regionManagerDirective
                }));
                regionManagerDirective.list.push(region);
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
            remove: function (region_) {
                // var regionManager = this;
                // var region = isString(region_) ? regionManager.get(region_) : region_;
                // regionManager.remove(region);
                // regionManager.drop(region.id, region);
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
                region.add(view_, NULL, returnsTrue);
            }),
            render: function (preventChain) {
                var view = this;
                view.directive(REGION_MANAGER).list.eachCall(RENDER, preventChain);
                return view;
            },
            constructor: function (options) {
                var documentView = this;
                extend(documentView, options);
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
                modifications.push(chunk);
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
                modifications.eachCallTry('fn');
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
                factories.Model[CONSTRUCTOR].apply(this, arguments);
                return documentManager;
            },
            getByDocument: function (doc) {
                return this.documents.find(function (documentViews) {
                    return documentViews.el.element() === doc;
                });
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
                selector: hasAt ? normalizeUIString(key.slice(indexOfAt), bindings) : EMPTY_STRING,
                group: viewNamespace,
                events: hasAt ? key.slice(0, indexOfAt).trim() : key
            };
        },
        normalizeUIString = function (uiString, ui) {
            return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function (r) {
                return ui[r.slice(4)];
            });
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
                    el = element.create(view.tagName());
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
                    json = (view.model && view.model.toJSON()) || {},
                    // try to generate template
                    virtual = element.virtual = [view.tagName(), element.attributes(), view.template(json, result(view, 'helpers') || {})],
                    comparison = view.owner$.nodeComparison(el, virtual, element.hashed, bindTo(element.comparisonFilter, element)),
                    keys = element.hashed = comparison.keys,
                    mutations = element.mutations = comparison.mutations,
                    modifiers = element.modifiers = extend({
                        remove: noop,
                        update: noop,
                        insert: noop
                    }, isFunction(modifiers = view.modifiers()) ? {
                        insert: modifiers
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
                    mutations = element.mutations,
                    modifiers = element.modifiers,
                    memo = BOOLEAN_FALSE;
                if (!element.mutations) {
                    return BOOLEAN_FALSE;
                }
                delete element.mutations;
                delete element.modifiers;
                // if it's a function, then do it last
                result = mutations.remove() || memo;
                result = modifiers.remove() || result;
                result = mutations.update() || result;
                result = modifiers.update() || result;
                result = mutations.insert() || result;
                return modifiers.insert() || result;
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
                if ((elementsSwapped = element.delta())) {
                    // ui objects changed. need to update groups
                    element.bindUI();
                }
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
                if (view.el.is('attached')) {
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
                    el = directive.el,
                    elementBindings = directive.elementBindings || result(view, 'elementEvents'),
                    __events = [];
                if (directive.elementBindings) {
                    directive.elementBindings = elementBindings;
                }
                if (!el) {
                    return directive;
                }
                directive.cachedElementBindings = map(elementBindings, function (method, key) {
                    var object = makeDelegateEventKeys(view.cid, directive.uiBindings, key),
                        bound = object.fn = bindTo(isString(method) ? view[method] : method, view);
                    __events.push(object);
                    el.on(object.events, object[SELECTOR], bound, object.capture, object.group);
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
                duff(elementBindings, function (binding) {
                    el.off(binding.events, binding[SELECTOR], binding.fn);
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
                each(elementTriggers, function (method, key) {
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
                duff(elementBindings, function (binding) {
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
                directive.ui = directive.view.ui = map(uiBindings, directive.el.$, directive.el);
                return directive;
            }
        });
    app.defineDirective(DOCUMENT_MANAGER, DocumentManager[CONSTRUCTOR]);
    app.defineDirective(REGION_MANAGER, RegionManager[CONSTRUCTOR]);
    app.defineDirective(BUFFERED_VIEWS, BufferedViews[CONSTRUCTOR]);
    app.defineDirective(CAPITAL_ELEMENT, Element, function (directive, instance) {
        directive.el.destroy();
        directive.unset();
        var ui = directive.ui;
        directive.degenerateUIBindings();
        eachCall(ui, 'destroy');
    });
    app.undefine(function (app, windo, opts) {
        var doc = windo[DOCUMENT];
        var documentManager = app.directive(DOCUMENT_MANAGER);
        var documents = documentManager.documents;
        var documentView = documents.get(ID, doc[__ELID__]);
        if (documentView) {
            exception('document has already been setup');
        }
        var $ = opts.$,
            owner = $.document,
            ExtendedRegion = Region.extend({
                owner$: $
            }),
            ExtendedView = View.extend({
                owner$: $
            }),
            scopedFactories = opts.scopedFactories = {
                Region: ExtendedRegion,
                View: ExtendedView
            };
        documentView = DocumentView({
            $: $,
            owner$: $,
            id: doc[__ELID__],
            el: $.returnsManager(doc),
            parent: documentManager,
            factories: scopedFactories
        });
        $.documentView = documentView;
        documents.push(documentView);
        documents.keep(ID, documentView.id, documentView);
    });
});