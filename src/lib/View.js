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
        IS_RENDERED = '_isRendered',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        ESTABLISH_REGIONS = 'establishRegions',
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements',
        ELEMENT = 'element',
        REGION_MANAGER = 'regionManager',
        templates = {},
        compile = function (id, force) {
            var matches, tag, template, attrs,
                templateFn = templates[id];
            if (templateFn && !force) {
                return templateFn;
            }
            tag = $(id);
            template = tag.html();
            matches = template.match(/\{\{([\w\s\d]*)\}\}/mgi);
            attrs = map(matches || [], function (match) {
                return {
                    match: match,
                    attr: match.split('{{').join(EMPTY_STRING).split('}}').join(EMPTY_STRING).trim()
                };
            });
            // template = template.trim();
            templateFn = templates[id] = function (obj) {
                var str = template,
                    cloneResult = clone(obj);
                duff(attrs, function (match) {
                    if (!cloneResult[match.attr]) {
                        cloneResult[match.attr] = EMPTY_STRING;
                    }
                    str = str.replace(match.match, cloneResult[match.attr]);
                });
                return str;
            };
            return templateFn;
        },
        makeDelegateEventKey = function (view, name) {
            return name + '.delegateEvents' + view.cid;
        },
        makeDelegateEventKeys = function (view, key, namespace) {
            if (namespace) {
                namespace = PERIOD + namespace;
            } else {
                namespace = EMPTY_STRING;
            }
            var viewNamespace = 'delegateEvents' + view.cid;
            return map(gapSplit(key), function (_key) {
                var __key = _key.split(PERIOD);
                if (__key[1] !== viewNamespace) {
                    __key.splice(1, 0, viewNamespace);
                    _key = __key.join(PERIOD);
                }
                return _key += namespace;
            }).join(' ');
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
        Region = factories.Events.extend('Region', {
            tagName: 'div',
            // constructor: function (secondary) {
            //     var model = this;
            //     factories.Events[CONSTRUCTOR].call(model, secondary);
            //     //
            //     return model;
            // },
            // 'directive:creation:regionManager': function () {
            //     return NULL;
            // },
            // _ensureElement: function () {
            //     this._setElement();
            // },
            // constructor: function (options) {
            //     var view = this;
            //     _View[CONSTRUCTOR].call(view, options);
            //     return view;
            // },
            add: function (models_) {
                var ret, _bufferedViews, region = this,
                    bufferedViewsDirective = region.directive('bufferedViews');
                bufferedViewsDirective.ensure();
                Collection(models_).each(region.bufferView, region);
                return ret;
            },
            // _add: function (view) {
            //     // var parent = this,
            //     //     regionManagerDirective = view.directive(REGION_MANAGER);
            //     // Box[CONSTRUCTOR][PROTOTYPE]._add.call(parent, view);
            //     // ensure the element buffer
            //     // append to the view list buffer
            //     // attached buffered element here so we don't have to loop through the list later
            //     // view._setElement(view.el);
            //     // parent.bufferView(view);
            // },
            bufferView: function (view) {
                var bufferDirective = this.directive('bufferedViews'),
                    el = view.el && view.el.unwrap();
                if (el) {
                    bufferDirective.els.appendChild(el);
                    bufferDirective.views.push(view);
                }
            },
            setElement: function () {
                var manager, region = this,
                    selector = region.selector,
                    parent = region[PARENT][PARENT];
                if (parent !== app) {
                    manager = parent.$(selector);
                } else {
                    manager = $(selector)[INDEX](0);
                }
                region.directive(ELEMENT).set(manager);
            },
            renderChildren: function () {
                var buffers = this;
                duff(this.views, function (child) {
                    if (result(child, 'filter')) {
                        child[RENDER]();
                        buffers.region.directive(REGION_MANAGER).list.add(child);
                    }
                });
            },
            render: function () {
                var region = this,
                    bufferDirective = region.directive('bufferedViews'),
                    elementDirective = region.directive(ELEMENT);
                region[IS_RENDERED] = BOOLEAN_FALSE;
                // doc frags on regionviews, list of children to trigger events on
                bufferDirective.ensure();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                // region._setElement();
                // update new element's attributes
                region.setElement();
                // attrs = view.attributes();
                elementDirective.setAttributes();
                // puts children back inside parent
                bufferDirective.attach();
                // attach region element
                // appends child elements
                elementDirective.el.append(bufferDirective.els);
                // mark the view as rendered
                region[IS_RENDERED] = BOOLEAN_TRUE;
                // reset buffered objects
                bufferDirective.reset();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
                // },
                // _appendChildElements: function () {
                //     var region = this,
                //         buffered = region.directive('bufferedViews');
                //     if (buffered && region.el) {
                //         region.el.appendChild(buffered.els);
                //     }
            }
        }, BOOLEAN_TRUE),
        View = Region.extend('View', {
            /**
             * @func
             * @name View # constructor
             * @description constructor for new view object
             * @param {Object | DOMM | Node} attributes - hash with non - circular data on it. Is set later with the Box constructor
             * @param {Object} secondary - options such as defining the parent object, or the element if necessary
             * @param {DOMM|Node} el - element or Node that is attached directly to the View object
             * @returns {View} instance
             */
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
                var ret, view = this,
                    regionsManagerDirective = view.checkDirective(REGION_MANAGER),
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
                element.render(result(view, 'template', view.model && view.model.toJSON()));
                // gathers the ui elements
                view._bindUIElements();
                // ties regions back to newly formed parent template
                ret = regionsManagerDirective && regionsManagerDirective.establish();
                // tie the children of the region the the region's el
                view.directive(REGION_MANAGER).list.eachCall(RENDER);
                // mark the view as rendered
                view[IS_RENDERED] = BOOLEAN_TRUE;
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                return view;
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
            _bindUIElements: function () {
                var view = this,
                    _uiBindings = view._uiBindings || result(view, 'ui');
                view.ui = view.ui || {};
                if (_uiBindings) {
                    return view;
                }
                // save it to skip the result call later
                view._uiBindings = _uiBindings;
                view.ui = map(_uiBindings, function (key, selector) {
                    return view.$(selector);
                });
                return view;
            },
            _unBindUIElements: function () {
                var view = this;
                view.ui = view._uiBindings;
            },
            remove: function () {
                var el, view = this;
                Box[CONSTRUCTOR][PROTOTYPE].remove.apply(view, arguments);
                // if you were not told to select something in
                // _ensureElements then remove the view from the dom
                view.detach();
                return view;
            },
            _detachElement: function () {
                var view = this,
                    el = view.el && view.el[INDEX](0);
                if (el && el[PARENT_NODE]) {
                    el[PARENT_NODE].removeChild(el);
                }
            },
            _removeViewElement: function (el, frag) {
                var parent = this;
                if (frag) {
                    frag.appendChild(el);
                } else {
                    if (el[PARENT_NODE]) {
                        el[PARENT_NODE].removeChild(el);
                    }
                }
            },
            detach: function () {
                var view = this;
                if (view.isDetaching) {
                    return;
                }
                view.isDetaching = BOOLEAN_TRUE;
                view[DISPATCH_EVENT]('before:detach');
                view.isDetached = BOOLEAN_TRUE;
                view._detachElement();
            },
            destroy: function (opts) {
                var view = this;
                view[IS_RENDERED] = BOOLEAN_FALSE;
                view.detach();
                // remove all events
                // should internally call remove
                Box[CONSTRUCTOR][PROTOTYPE].destroy.call(view);
                return view;
            },
            rendered: function () {
                return this[IS_RENDERED];
            },
            destroyed: function () {
                return this.isDestroyed;
            }
        }, BOOLEAN_TRUE),
        // ElementDirective = app.defineDirective('element', function (target) {
        //     //
        // }),
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
        delegateElementEvents = function (bindings_) {
            var key, method, match,
                elementDirective = this,
                view = elementDirective.view,
                eventBindings = view.eventBindings || result(view, 'elementEvents'),
                // bindings = bindings_ || eventBindings,
                __events = {};
            if (eventBindings) {
                elementDirective.eventBindings = eventBindings;
            }
            if (!el) {
                return elementDirective;
            }
            each(bindings, function (key, methods_) {
                // assumes is array
                var methods = gapSplit(methods_);
                if (isFunction(methods_)) {
                    methods = [methods_];
                }
                __events[makeDelegateEventKeys(view, key)] = map(methods, function (method, idx) {
                    return bind(view[method] || method, view);
                });
            });
            el.on(__events);
            return elementDirective;
        },
        unDelegateElementEvents = function (el, bindings_) {
            var key, method, match, elementDirective = this,
                view = elementDirective.view,
                eventBindings = elementDirective.eventBindings || result(view, 'elementEvents'),
                // bindings = bindings_ || eventBindings,
                __events = {};
            if (eventBindings) {
                elementDirective.eventBindings = eventBindings;
            }
            if (!el) {
                return view;
            }
            each(bindings, function (key, methods_) {
                var method = bind(isString(methods_) ? view[methods_] : methods_, view);
                __events[makeDelegateEventKeys(view, key)] = method;
            });
            el.on(__events);
            return view;
        },
        setElementAttributes = function () {
            var elementDirective = this,
                view = elementDirective.view,
                attrs = result(view, 'elementAttributes');
            if (view.className) {
                attrs = attrs || {};
                attrs['class'] = result(view, 'className');
            }
            if (attrs) {
                elementDirective.el.attr(attrs);
            }
        },
        renderElement = function (html) {
            this.el.html(html || '');
        };
    app.defineDirective(ELEMENT, function (instance) {
        return {
            view: instance,
            ensure: ensureElement,
            create: createElement,
            set: setElement,
            render: renderElement,
            setAttributes: setElementAttributes,
            delegate: delegateElementEvents,
            undelegate: unDelegateElementEvents
        };
    });
    var establishRegion = function (key, selector) {
            var regionManagerDirective = this,
                parentView = regionManagerDirective[PARENT];
            if (key) {
                intendedObject(key, selector, function (key, selector) {
                    var $selected, region = regionManagerDirective.list.get(key);
                    if (!region) {
                        region = regionManagerDirective.create(key, selector);
                    }
                    // region = this;
                    if (parentView !== app) {
                        $selected = parentView.$(selector)[INDEX](0);
                    } else {
                        $selected = $(selector)[INDEX](0);
                    }
                    if ($selected) {
                        region.el = $selected;
                    }
                });
            }
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
                region = region_;
            if (isInstance(region, Region)) {
                return region;
            }
            region = Region({
                id: where,
                selector: isString(region) ? region : EMPTY_STRING,
                parent: regionManagerDirective
            });
            key = REGION_MANAGER;
            // if (parent !== app) {
            //     // key = CHILDREN;
            //     parent.add(region);
            // }
            regionManagerDirective.list.push(region);
            regionManagerDirective.list.register('id', where, region);
            return region;
        },
        bufferedEnsure = function () {
            var buffers = this,
                _bufferedViews = isArray(buffers.views) ? 1 : buffers.resetViews(),
                _bufferedEls = isFragment(buffers.els) ? 1 : buffers.resetEls();
        },
        bufferedReset = function () {
            this.resetEls();
            this.resetViews();
        },
        bufferedElsReset = function () {
            this.els = createDocumentFragment();
        },
        bufferedViewsReset = function () {
            this.views = [];
        },
        bufferedAttach = function () {
            var buffers = this;
            duff(this.views, function (child) {
                if (result(child, 'filter')) {
                    child[RENDER]();
                    buffers.region.directive(REGION_MANAGER).list.add(child);
                }
            });
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
    app.defineDirective('bufferedViews', function (instance) {
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
    _.exports({
        compile: compile
    });
    app.extend({
        _addToHash: Box[CONSTRUCTOR][PROTOTYPE]._addToHash,
        // getRegion: viewGetRegionPlacer(REGION_MANAGER),
        getRegion: getRegion,
        addRegion: addRegion
        // addRegion: function (id, selector) {
        //     var app = this;
        //     // ensure region manager
        //     // var blank = app.getRegion();
        //     this.directive(REGION_MANAGER).establish(id, selector);
        //     // var regionManager = app[REGION_MANAGER];
        //     // regionManager[PARENT] = app;
        //     // regionManager[ESTABLISH_REGIONS](id, selector);
        //     return app;
        // }
    });
});