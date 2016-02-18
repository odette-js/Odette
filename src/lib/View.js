application.scope().module('View', function (module, app, _, factories, $) {
    var Box = factories.Box,
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
        ESTABLISH_REGIONS = 'establishRegions',
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements',
        ELEMENT = 'element',
        BUFFERED_VIEWS = 'bufferedViews',
        REGION_MANAGER = 'regionManager',
        makeDelegateEventKeys = function (cid, bindings, key, namespace_) {
            var viewNamespace = 'delegateEvents' + cid,
                namespace = namespace_;
            if (namespace) {
                namespace = PERIOD + namespace;
            } else {
                namespace = EMPTY_STRING;
            }
            return foldl(gapSplit(key), function (memo, _key) {
                var __key = _key.split(PERIOD);
                if (__key[0][0] === '@') {
                    memo.selector = normalizeUIString(_key, bindings);
                } else {
                    if (__key[1] !== viewNamespace) {
                        __key.splice(1, 0, viewNamespace);
                        _key = __key.join(PERIOD);
                    }
                    memo.events.push(_key + namespace);
                }
                return memo;
            }, {
                events: [],
                selector: ''
            });
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
        getRegion = function (key) {
            return this.directive(REGION_MANAGER).list.get('id', key);
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
         * @augments Box
         * @classDesc Objects that have one or more element associated with them, such as a template that needs constant updating from the data
         */
        // region views are useful if you're constructing different components
        // from a separate place and just want it to be in the attach pipeline
        // very useful for componentizing your ui
        // LeafView = factories.
        // regionConstructor = ,
        Container = factories.Container,
        Region = factories.Events.extend('Region', {
            tagName: 'div',
            toView: function () {},
            add: function (models_, options_) {
                var bufferedViewsDirective, region = this,
                    options = options_ || {},
                    unwrapped = Collection(models_).each(function (view_) {
                        var nul, view = isInstance(view_, View) ? view_ : (options.Child || region.Child || factories.View)({
                            model: isInstance(view_, Container) ? view_ : view_ = Container(view_),
                            parent: region
                        });
                        nul = bufferedViewsDirective || ((bufferedViewsDirective = region.directive(BUFFERED_VIEWS)) && bufferedViewsDirective.ensure());
                        region.setParent(view);
                        bufferedViewsDirective.views.push(view);
                    }).unwrap();
                if (region.el) {
                    region.render();
                }
                return unwrapped;
            },
            setParent: function (view) {
                // more to come
                view.parent = this;
            },
            attachElement: function (view) {
                var bufferDirective, el = view.el && view.el.unwrap();
                if (el) {
                    bufferDirective = this.directive(BUFFERED_VIEWS);
                    bufferDirective.els.appendChild(el);
                    // bufferDirective.views.push(view);
                }
            },
            setElement: function () {
                var manager, region = this,
                    selector = region.selector,
                    parent = region[PARENT][PARENT];
                if (parent !== app) {
                    manager = parent.$(selector)[INDEX](0);
                } else {
                    manager = $(selector)[INDEX](0);
                }
                if (manager) {
                    region.directive(ELEMENT).set(manager);
                }
            },
            // renderChildren: function () {
            //     var buffers = this;
            //     duff(this.views, function (child) {
            //         if (result(child, 'filter')) {
            //             child[RENDER]();
            //             buffers.region.directive(REGION_MANAGER).list.add(child);
            //         }
            //     });
            // },
            render: function () {
                var bufferDirective, elementDirective, list, region = this;
                bufferDirective = region.directive(BUFFERED_VIEWS);
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
                list = bufferDirective.attach();
                // attach region element
                // appends child elements
                elementDirective.el.append(bufferDirective.els);
                // pass the buffered views up
                region.passBuffered(list);
                // mark the view as rendered
                region[IS_RENDERED] = BOOLEAN_TRUE;
                // reset buffered objects
                bufferDirective.reset();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            },
            passBuffered: function (list) {
                var viewList, region = this,
                    parentview = region[PARENT][PARENT];
                if (isInstance(parentview, View) && !region.isAttached) {
                    viewList = parentview.directive(BUFFERED_VIEWS).views;
                    viewList.push.apply(viewList, list);
                } else {
                    duff(this.directive(BUFFERED_VIEWS).views, function (view) {
                        view.isAttached = BOOLEAN_TRUE;
                        view[DISPATCH_EVENT]('attach');
                    });
                }
            }
        }, BOOLEAN_TRUE),
        View = Region.extend('View', {
            filter: BOOLEAN_TRUE,
            getRegion: getRegion,
            constructor: function (secondary) {
                var model = this;
                factories.Events[CONSTRUCTOR].call(model, secondary);
                model.directive(ELEMENT).ensure();
                model.directive(REGION_MANAGER).establish(result(model, 'regions'));
                return model;
            },
            $: function (selector) {
                return this.el.find(selector);
            },
            template: function () {
                return EMPTY_STRING;
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
            render: function () {
                var regionsManagerDirective, element, json, bufferedDirective, template, view = this;
                if (!result(view, 'filter')) {
                    return view;
                }
                regionsManagerDirective = view.checkDirective(REGION_MANAGER);
                element = view.directive(ELEMENT);
                view[IS_RENDERED] = BOOLEAN_FALSE;
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
                template = result(view.template, RENDER, json);
                // render the template
                element.render(isFunction(template) ? template(json) : template);
                // gathers the ui elements
                // view._bindUIElements();
                // ties regions back to newly formed parent template
                // tie the children of the region the the region's el
                view.directive(REGION_MANAGER).list.eachCall(RENDER);
                // mark the view as rendered
                view[IS_RENDERED] = BOOLEAN_TRUE;
                bufferedDirective = view.checkDirective(BUFFERED_VIEWS);
                view.buffer();
                template = bufferedDirective && view.passBuffered(bufferedDirective.views);
                // pass buffered views up to region
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                return view;
            },
            buffer: function () {
                return this.parent && this.parent.attachElement(this);
            },
            passBuffered: function (list) {
                var parentBuffered = this.parent.directive(BUFFERED_VIEWS);
                parentBuffered.views = parentBuffered.views.concat(list);
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
            remove: function () {
                var el, view = this;
                Box[CONSTRUCTOR][PROTOTYPE].remove.apply(view, arguments);
                // if you were not told to select something in
                // _ensureElements then remove the view from the dom
                view.detach();
                return view;
            },
            detach: function (fragment) {
                var el, view = this;
                if (view.isDetaching) {
                    return;
                }
                view.isDetaching = BOOLEAN_TRUE;
                view[DISPATCH_EVENT]('before:detach');
                view.isDetached = BOOLEAN_TRUE;
                el = view.el && view.el[INDEX](0);
                if (el && el[PARENT_NODE]) {
                    if (fragment) {
                        fragment.appendChild(el);
                    } else {
                        el[PARENT_NODE].removeChild(el);
                    }
                }
                view[DISPATCH_EVENT]('detach');
            },
            rendered: function () {
                return this[IS_RENDERED];
            },
            destroyed: function () {
                return this.isDestroyed;
            }
        }, BOOLEAN_TRUE),
        _View = factories.View,
        ensureElement = function () {
            var el, elementDirective = this,
                view = elementDirective.view,
                selector = elementDirective.selector || result(view, 'el');
            if (selector) {
                elementDirective.selector = selector;
            }
            if (!isInstance(selector, factories.DOMM)) {
                if (isString(selector)) {
                    // sets external element
                    el = selector;
                } else {
                    // defauts back to wrapping the element
                    // creates internal element
                    el = elementDirective.create(result(view, 'tagName'));
                    // subclassed to expand the attributes that can be used
                }
                elementDirective.set(el);
            }
        },
        createElement = function (tag) {
            return $('<' + tag + '>').index(0);
        },
        setElement = function (el) {
            this.view.el = this.el = factories.DomManager.isInstance(el) ? el : $(el).index(0);
        },
        delegateElementEvents = function () {
            var key, method, match, elDir = this,
                view = elDir.view,
                el = elDir.el,
                elementBindings = elDir.elementBindings || result(view, 'elementEvents'),
                __events = [];
            if (elDir.elementBindings) {
                elDir.elementBindings = elementBindings;
            }
            if (!el) {
                return elDir;
            }
            each(elementBindings, function (method, key) {
                var object = makeDelegateEventKeys(view.cid, elDir.uiBindings, key),
                    bound = object.fn = bind(view[method] || method, view);
                el.on(object.events.join(' '), object.selector, bound);
            });
            elDir.cachedElementBindings = __events;
            return elDir;
        },
        unDelegateElementEvents = function () {
            var key, method, match, elDir = this,
                view = elDir.view,
                el = elDir.el,
                elementBindings = elDir.cachedElementBindings;
            if (!elDir.cachedElementBindings || !el) {
                return elDir;
            }
            duff(elementBindings, function (binding) {
                el.off(binding.events.join(' '), binding.selector, binding.fn);
            });
            elDir.cachedElementBindings = UNDEFINED;
            return elDir;
        },
        basicViewTrigger = function (name, e) {
            return this[DISPATCH_EVENT](name, e);
        },
        delegateElementTriggers = function () {
            var key, method, match, elDir = this,
                view = elDir.view,
                el = elDir.el,
                elementTriggers = elDir.elementTriggers || result(view, 'elementTriggers'),
                __events = [];
            if (!elDir.elementTriggers) {
                elDir.elementTriggers = elementTriggers;
            }
            if (!el) {
                return elDir;
            }
            each(elementTriggers, function (method, key) {
                var object = makeDelegateEventKeys(view.cid, elDir.uiBindings, key),
                    bound = object.fn = basicViewTrigger.bind(view, method);
                el.on(object.events.join(' '), object.selector, bound);
            });
            elDir.cachedElementTriggers = __events;
        },
        undelegateElementTriggers = function () {
            var key, method, match, elDir = this,
                view = elDir.view,
                el = elDir.el,
                elementBindings = elDir.cachedElementTriggers;
            if (!elDir.cachedElementTriggers || !el) {
                return elDir;
            }
            duff(elementBindings, function (binding) {
                el.off(binding.events.join(' '), binding.selector, binding.fn);
            });
            elDir.cachedElementTriggers = UNDEFINED;
            return elDir;
        },
        setElementAttributes = function () {
            var elDir = this,
                view = elDir.view,
                attrs = result(view, 'elementAttributes');
            if (view.className) {
                attrs = attrs || {};
                attrs[CLASS] = result(view, CLASSNAME);
            }
            if (attrs) {
                elDir.el.attr(attrs);
            }
        },
        renderElement = function (html) {
            var elementDirective = this;
            elementDirective.undelegate();
            elementDirective.undelegateTriggers();
            elementDirective.unbindUI();
            elementDirective.el.html(html || '');
            elementDirective.bindUI();
            elementDirective.delegate();
            elementDirective.delegateTriggers();
        },
        bindUI = function () {
            var elDir = this,
                uiBindings = elDir.uiBindings || result(elDir.view, 'ui'),
                ui = elDir.ui = elDir.ui || {};
            if (elDir.uiBindings) {
                return elDir;
            }
            // save it to skip the result call later
            elDir.uiBindings = uiBindings;
            elDir.ui = elDir.view.ui = map(uiBindings, elDir.el.find, elDir.el);
            return elDir;
        },
        unbindUI = function () {
            var elDir = this;
            elDir.ui = elDir.uiBindings;
        };
    app.defineDirective(ELEMENT, function (instance) {
        return {
            view: instance,
            ensure: ensureElement,
            create: createElement,
            set: setElement,
            render: renderElement,
            setAttributes: setElementAttributes,
            bindUI: bindUI,
            unbindUI: unbindUI,
            delegate: delegateElementEvents,
            undelegate: unDelegateElementEvents,
            undelegateTriggers: undelegateElementTriggers,
            delegateTriggers: delegateElementTriggers
        };
    });
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
                    $selected = parentView.$(region.selector)[INDEX](0);
                } else {
                    $selected = $(region.selector)[INDEX](0);
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
            this.els = createDocumentFragment();
        },
        bufferedViewsReset = function () {
            this.views = [];
        },
        bufferedAttach = function () {
            var buffers = this,
                attached = [];
            duff(this.views, function (child) {
                if (result(child, 'filter')) {
                    child[RENDER]();
                    buffers.region.directive(CHILDREN).push(child);
                    attached.push(child);
                }
            });
            return attached;
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
            els: createDocumentFragment(),
            views: [],
            reset: bufferedReset,
            ensure: bufferedEnsure,
            resetViews: bufferedViewsReset,
            resetEls: bufferedElsReset,
            attach: bufferedAttach
        };
    });
    app.extend({
        getRegion: getRegion,
        addRegion: addRegion,
        removeRegion: removeRegion
    });
});