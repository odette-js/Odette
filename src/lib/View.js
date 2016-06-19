var REGION_MANAGER = 'RegionManager',
    DOCUMENT_VIEW = 'DocumentView',
    DOCUMENT_MANAGER = 'DocumentManager',
    verifyOwner$ = function (instance) {
        if (!instance.owner$) {
            exception({
                message: 'object needs an owner$ function to scope itself against a document'
            });
        }
    };
app.scope(function (app) {
    var protoProp = _.protoProp,
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
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements';
    // getRegion = ,
    // addRegion = ,
    var noRegionMessage = {
            message: 'that region does not exist'
        },
        invalidRegionMessage = {
            message: 'invalid key passed for region name'
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
            elementAttributes: returns(BOOLEAN_FALSE),
            className: returns(BOOLEAN_FALSE),
            childConstructor: function () {
                return this.Child === BOOLEAN_TRUE ? this[PARENT][PARENT].childConstructor() : this.Child;
            },
            constructor: function (secondary) {
                var model = this;
                Parent[CONSTRUCTOR].call(model, secondary);
                verifyOwner$(model);
                model.directive(CHILDREN);
                model.setElement();
                return model;
            },
            add: function (models_, options_) {
                var bufferedViewsDirective, region = this,
                    options = options_ || {},
                    unwrapped = Collection(models_).foldl(function (memo, item) {
                        var adoption;
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
            buffer: function (view) {
                var parentNode, bufferDirective, region = this,
                    el = view.el && view.el.element();
                if (!el) {
                    return region;
                }
                parentNode = el.parentNode;
                if (!parentNode || parentNode !== region.el.element()) {
                    bufferDirective = region.directive(BUFFERED_VIEWS);
                    bufferDirective.els.append(el);
                }
                return region;
            },
            // this needs to be modified for shared windows
            setElement: function () {
                var region = this,
                    selector = region[SELECTOR],
                    parent = region[PARENT][PARENT],
                    manager = parent.el.$(selector)[ITEM](0);
                if (!manager) {
                    return region;
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
                elementDirective.setAttributes();
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
            if (!force && regionManager.is('established')) {
                return;
            }
            var regions = result(view, 'regions');
            var element = view.directive(CAPITAL_ELEMENT);
            regionManager.mark('established');
            element.render(regions);
            view.mark(RENDERED);
            var regionsResult = keys(regions)[LENGTH] && regionManager.establish(regions);
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
            return regionManager.is('established') && ((region = regionManager.get(regionKey)) ? region.remove(views) : exception(noRegionMessage));
        }),
        addRegion = parody(REGION_MANAGER, 'add'),
        getRegion = parody(REGION_MANAGER, 'get'),
        removeRegion = parody(REGION_MANAGER, 'remove'),
        // view needs to be pitted against a document
        View = factories.View = Region.extend('View', {
            Model: Model,
            modifiers: noop,
            Child: BOOLEAN_TRUE,
            childConstructor: Parent.fn.childConstructor,
            getRegion: getRegion,
            addRegion: addRegion,
            removeRegion: removeRegion,
            addChildView: addChildView,
            removeChildView: removeChildView,
            tagName: returns('div'),
            filter: returns(BOOLEAN_TRUE),
            template: returns(EMPTY_STRING),
            getChildren: function (key) {
                return this.directive(REGION_MANAGER).get(key).directive(CHILDREN);
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
            bindModel: function (model) {
                var view = this;
                view.model = Model.isInstance(model) ? model : view.Model(model);
                view.listenTo(view.model, result(view, 'modelEvents'));
                view.listenTo(view.model, CHANGE, view.render);
            },
            constructor: function (secondary_) {
                var view = this;
                var secondary = secondary_ || {};
                view.bindModel(secondary.model);
                delete secondary.model;
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
            watchList: function () {
                return parse(stringify(this.template.interpolators));
            },
            render: function (preventChain) {
                var newelementisDifferent, element, json, html, renderResult, bufferedDirective, template, settingElement, view = this;
                // you might be able to do this a better way
                if (!view.filter()) {
                    return view;
                }
                view.mark('rendering');
                element = view.directive(CAPITAL_ELEMENT);
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT](BEFORE_COLON + RENDER);
                // renders the html
                // mark the view as rendered
                establishRegions(view, BOOLEAN_TRUE);
                view.unmark('rendering');
                // pass buffered views up to region
                if (view[REGION_MANAGER]) {
                    view[REGION_MANAGER].list.eachCall(RENDER, isFunction(preventChain) ? preventChain : returnsTrue);
                }
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
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
                var $selected, regionManagerDirective = this,
                    parentView = regionManagerDirective[PARENT],
                    region = regionManagerDirective.list.get(ID, key);
                if (!region) {
                    region = regionManagerDirective.create(key, selector);
                }
                $selected = parentView.el.$(region[SELECTOR])[ITEM](0);
                if (!$selected) {
                    exception({
                        message: 'an element does not exist at ' + selector
                    });
                }
                region.el = $selected;
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
        DocumentView = factories[DOCUMENT_VIEW] = factories.Directive.extend(DOCUMENT_VIEW, {
            regions: noop,
            addChildView: intendedApi(function (key, view_) {
                var regionManager = this.directive(REGION_MANAGER);
                var region = regionManager.get(key);
                region.add(view_);
            }),
            addRegion: addRegion,
            getRegion: getRegion,
            removeRegion: removeRegion,
            removeChildView: removeChildView,
            render: function (preventChain) {
                var view = this;
                view.directive(REGION_MANAGER).list.eachCall(RENDER, preventChain);
            },
            constructor: function (options) {
                var documentView = this;
                extend(documentView, options);
                return documentView;
            }
        }),
        DocumentManager = factories[DOCUMENT_MANAGER] = factories.Directive.extend(DOCUMENT_MANAGER, {
            constructor: function (app) {
                var documentManager = this;
                documentManager.parent = app;
                documentManager.documents = Collection();
                return documentManager;
            }
        });
    var CAPITAL_ELEMENT = capitalize(ELEMENT);
    var basicViewTrigger = function (name, e) {
            return this[DISPATCH_EVENT](name, e);
        },
        makeDelegateEventKeys = function (cid, bindings, key) {
            var viewNamespace = 'delegateEvents' + cid,
                indexOfAt = indexOf(key, '@'),
                hasAt = indexOfAt !== -1;
            return {
                selector: hasAt ? normalizeUIString(key.slice(indexOfAt), bindings) : EMPTY_STRING,
                group: viewNamespace,
                events: hasAt ? key.slice(0, indexOfAt) : key
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
                var normalizedKey = normalizeUIString(key, ui);
                memo[normalizedKey] = val;
                return memo;
            }, {});
        },
        canBeSaved = function (element, tagName, attributes) {
            var manager = element.el;
            if (manager.tagName !== tagName) {
                return BOOLEAN_FALSE;
            }
            var value = manager.attr('key');
        },
        createVirtual = function (element, el) {
            //
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
                if (isInstance(selector, factories.DOMA)) {
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
                var view = directive.view;
                view.el = directive.el = el;
                directive.setAttributes();
            },
            virtualize: function () {
                var directive = this;
                var el = directive.el;
                directive.virtual = (directive.virtual && directive.virtual.tagName === el.tagName) ? directive.virtual : directive.view.owner$.document.target.createElement(el.tagName);
                el.attributes(bind(attributeApi.write, NULL, directive.virtual));
            },
            diff: function () {
                var element = this,
                    manager = element.el,
                    view = element.view,
                    el = manager.element(),
                    virtual = element.virtual,
                    json = (view.model && view.model.toJSON()) || {},
                    regionManager = view.directive(REGION_MANAGER),
                    // try to generate template
                    appendedResult = virtual.innerHTML = view.template(json).trim(),
                    snapshot = nodeComparison(el, virtual, function (node) {
                        return !regionManager.list.find(function (region) {
                            return matchesSelctor(node, region.selector);
                        });
                    }),
                    thereAreNodeSwaps = BOOLEAN_FALSE;
                duff(snapshot.concat(view.modifiers() || []), function (fn) {
                    thereAreNodeSwaps = fn(view) || thereAreNodeSwaps;
                });
                return thereAreNodeSwaps;
            },
            render: function (termination) {
                var rerendering, replaced, element = this,
                    view = element.view,
                    settingElement = view.el,
                    newelementisDifferent = settingElement !== element.el;
                if (newelementisDifferent) {
                    element.unset();
                }
                rerendering = newelementisDifferent || !view.is(RENDERED);
                if (rerendering) {
                    // turns ui into a hash
                    element.degenerateUIBindings();
                    element.set(settingElement);
                    element.virtualize();
                }
                replaced = element.diff();
                if (rerendering) {
                    // these may change with a delta'd render
                    element.generateUIBindings();
                }
                if (replaced) {
                    element.bindUI();
                }
                // there's a different element, or we have never rendered before
                if (rerendering) {
                    element.undelegateEvents();
                    element.undelegateTriggers();
                    element.delegateEvents();
                    element.delegateTriggers();
                }
                // update new element's attributes
                // element.setAttributes();
            },
            degenerateUIBindings: function () {
                var directive = this;
                if (!directive.ui) {
                    return;
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
                        bound = object.fn = bindWith(basicViewTrigger, view, method);
                    el.on(object.events, object[SELECTOR], bound, object.capture, object.group);
                });
                directive.cachedElementTriggers = __events;
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
            createAttributes: function () {
                var directive = this,
                    view = directive.view,
                    attrs = view.elementAttributes(),
                    className = view[CLASSNAME]();
                if (className) {
                    attrs = attrs || {};
                    attrs[CLASS] = className;
                }
                return attrs;
            },
            setAttributes: function () {
                var attrs, directive = this;
                if (directive.createAttributes && (attrs = directive.createAttributes())) {
                    directive.el.attr(attrs);
                }
                return directive;
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
        var doc = windo[DOCUMENT];
        var documentManager = app.directive(DOCUMENT_MANAGER);
        var documents = documentManager.documents;
        var documentView = documents.get(ID, doc[__ELID__]);
        if (documentView) {
            exception({
                message: 'document has already been setup'
            });
        }
        documentView = DocumentView({
            $: $,
            owner$: $,
            id: doc[__ELID__],
            el: $.returnsManager(doc),
            parent: documentManager,
            factories: scopedFactories
        });
        documents.push(documentView);
        documents.keep(ID, documentView.id, documentView);
    });
});