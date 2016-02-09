application.scope().module('View', function (module, app, _, factories, $) {
    var blank, appVersion = app.version,
        each = _.each,
        duff = _.duff,
        Box = factories.Box,
        Collection = factories.Collection,
        isArray = _.isArray,
        isString = _.isString,
        gapSplit = _.gapSplit,
        bind = _.bind,
        map = _.map,
        has = _.has,
        clone = _.clone,
        result = _.result,
        reduce = _.reduce,
        protoProp = _.protoProp,
        isFragment = _.isFragment,
        isInstance = _.isInstance,
        isFunction = _.isFunction,
        isArrayLike = _.isArrayLike,
        reverseParams = _.reverseParams,
        intendedObject = _.intendedObject,
        createDocumentFragment = _.createDocumentFragment,
        EMPTY = '',
        INDEX = 'index',
        LENGTH = 'length',
        RENDER = 'render',
        PARENT = 'parent',
        OPTIONS = 'options',
        CHILDREN = 'children',
        IS_RENDERED = '_isRendered',
        PARENT_NODE = 'parentNode',
        CONSTRUCTOR = 'constructor',
        ESTABLISH_REGIONS = 'establishRegions',
        ESTABLISHED_REGIONS = '_establishedRegions',
        APPEND_CHILD_ELEMENTS = '_appendChildElements',
        PROTOTYPE = 'prototype',
        REGION_MANAGER = 'regionManager',
        templates = {},
        compile = function (id, force) {
            var matches, tag, template, attrs, templates_ = templates[appVersion] = templates[appVersion] || {},
                templateFn = templates_[id];
            if (templateFn && !force) {
                return templateFn;
            }
            tag = $(id);
            template = tag.html();
            matches = template.match(/\{\{([\w\s\d]*)\}\}/mgi);
            attrs = map(matches || [], function (match) {
                return {
                    match: match,
                    attr: match.split('{{').join(EMPTY).split('}}').join(EMPTY).trim()
                };
            });
            // template = template.trim();
            templateFn = templates_[id] = function (obj) {
                var str = template,
                    cloneResult = clone(obj);
                duff(attrs, function (match) {
                    if (!cloneResult[match.attr]) {
                        cloneResult[match.attr] = EMPTY;
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
                namespace = '.' + namespace;
            } else {
                namespace = EMPTY;
            }
            var viewNamespace = 'delegateEvents' + view.cid;
            return map(gapSplit(key), function (_key) {
                var __key = _key.split('.');
                if (__key[1] !== viewNamespace) {
                    __key.splice(1, 0, viewNamespace);
                    _key = __key.join('.');
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
                var normalizedKey = Marionette.normalizeUIString(key, ui);
                memo[normalizedKey] = val;
                return memo;
            }, {});
        },
        viewGetRegionPlacer = function (place) {
            return function (key) {
                var region, view = this,
                    regionManager = view[place] = view[place] || RegionManager();
                if (regionManager) {
                    region = regionManager.get(key);
                }
                return region;
            };
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
        View = factories.Box.extend('View', {
            /**
             * @func
             * @name View # constructor
             * @description constructor for new view object
             * @param {Object | DOMM | Node} attributes - hash with non - circular data on it. Is set later with the Box constructor
             * @param {Object} secondary - options such as defining the parent object, or the element if necessary
             * @param {DOMM|Node} el - element or Node that is attached directly to the View object
             * @returns {View} instance
             */
            tagName: 'div',
            filter: BOOLEAN_TRUE,
            getRegion: viewGetRegionPlacer(CHILDREN),
            constructor: function (attributes, secondary) {
                var model = this;
                Box[CONSTRUCTOR].apply(model, arguments);
                model._ensureElement();
                model._establishRegions();
                return model;
            },
            'directive:children': function () {
                var children = RegionManager();
                children[PARENT] = this;
                return children;
            },
            $: function (selector) {
                return this.el.find(selector);
            },
            template: function (ctx) {
                return EMPTY;
            },
            _renderHTML: function () {
                var view = this,
                    innerHtml = result(view, 'template', view.toJSON());
                view.el.html(innerHtml);
            },
            _appendChildElements: function () {
                var view = this;
                view.directive(CHILDREN).eachCall(APPEND_CHILD_ELEMENTS);
                return view;
            },
            _establishRegions: function () {
                var regionsManager, view = this,
                    regions = view[ESTABLISHED_REGIONS] = view[ESTABLISHED_REGIONS] || result(view, 'regions');
                if (!view[ESTABLISHED_REGIONS]) {
                    return;
                }
                // add regions to the region manager
                view.directive(CHILDREN)[ESTABLISH_REGIONS](regions);
            },
            render: function () {
                var view = this;
                view[IS_RENDERED] = BOOLEAN_FALSE;
                // prep the object with extra members (doc frags on regionviews,
                // list of children to trigger events on)
                // view._ensureBufferedViews();
                // request extra data or something before rendering: dom is still completely intact
                view[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                view.setElement(view.el);
                // update new element's attributes
                view._setElAttributes();
                // renders the html
                view._renderHTML();
                // gathers the ui elements
                view._bindUIElements();
                // ties regions back to newly formed parent template
                view._establishRegions();
                // console.log(view.parent.parent);
                // tie the children of the region the the region's el
                view.directive(CHILDREN).eachCall(RENDER);
                // mark the view as rendered
                view[IS_RENDERED] = BOOLEAN_TRUE;
                // dispatch the render event
                view[DISPATCH_EVENT](RENDER);
                return view;
            },
            setElement: function (element) {
                var view = this,
                    previousElement = view.el;
                // detaches events with this view's namespace
                // view._unDelegateEvents();
                view._setElement(element);
                if (previousElement !== view.el) {
                    view._unDelegateEvents(previousElement);
                    view._delegateEvents();
                }
                // attaches events with this view's namespace
                return view;
            },
            // Creates the `this.el` and `this.$el` references for this view using the
            // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
            // context or an element. Subclasses can override this to utilize an
            // alternative DOM manipulation API and are only required to set the
            // `this.el` property.
            _setElement: function (el) {
                this.el = $(el);
            },
            _createElement: function (tag) {
                return $('<' + tag + '>');
            },
            // Ensure that the View has a DOM element to render into.
            // If `this.el` is a string, pass it through `$()`, take the first
            // matching element, and re-assign it to `el`. Otherwise, create
            // an element from the `id`, `className` and `tagName` properties.
            _ensureElement: function () {
                var el, view = this,
                    _elementSelector = view._elementSelector || result(view, 'el');
                if (_elementSelector) {
                    view._elementSelector = _elementSelector;
                }
                if (!isInstance(_elementSelector, factories.DOMM)) {
                    if (isString(_elementSelector)) {
                        // sets external element
                        el = _elementSelector;
                    } else {
                        // defauts back to wrapping the element
                        // creates internal element
                        el = view._createElement(result(view, 'tagName'));
                        // subclassed to expand the attributes that can be used
                    }
                    view.setElement(el);
                }
            },
            _setElAttributes: function () {
                var view = this;
                var attrs = result(view, 'elementAttributes') || {};
                if (view.className) {
                    attrs['class'] = result(view, 'className');
                }
                view._setAttributes(attrs);
            },
            // Set attributes from a hash on this view's element.  Exposed for
            // subclasses using an alternative DOM manipulation API.
            _setAttributes: function (attributes) {
                this.el.attr(attributes);
            },
            // pairs. Callbacks will be bound to the view, with `this` set properly.
            // Uses event delegation for efficiency.
            // Omitting the selector binds the event to `this.el`.
            _delegateEvents: function (el, bindings_) {
                var key, method, match,
                    view = this,
                    _elementEventBindings = view._elementEventBindings || view.elementEvents,
                    bindings = bindings_ || _elementEventBindings,
                    __events = {};
                if (_elementEventBindings) {
                    view._elementEventBindings = _elementEventBindings;
                }
                if (el) {
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
                }
                return view;
            },
            _unDelegateEvents: function (el, bindings_) {
                var key, method, match,
                    view = this,
                    _elementEventBindings = view._elementEventBindings || view.elementEvents,
                    bindings = bindings_ || _elementEventBindings,
                    __events = {};
                if (_elementEventBindings) {
                    view._elementEventBindings = _elementEventBindings;
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
        _View = factories.View,
        Region = View.extend('Region', {
            Child: _View,
            'directive:children': Collection,
            _ensureElement: function () {
                this._setElement();
            },
            constructor: function (options) {
                var view = this;
                _View[CONSTRUCTOR].call(view, {}, options);
                return view;
            },
            add: function (models_) {
                var ret, _bufferedViews, view = this;
                view._ensureBufferedViews();
                ret = Box[CONSTRUCTOR][PROTOTYPE].add.call(view, models_);
                return ret;
            },
            _add: function (view) {
                var parent = this;
                Box[CONSTRUCTOR][PROTOTYPE]._add.call(parent, view);
                // ensure the element buffer
                // append to the view list buffer
                // attached buffered element here so we don't have to loop through the list later
                view._setElement(view.el);
                parent._addBufferedView(view);
            },
            // _ensureChildren: function () {
            //     this.directive(CHILDREN) = this.directive(CHILDREN) || Collection();
            // },
            _ensureBufferedViews: function () {
                var view = this,
                    bufferedViews = isArray(view._bufferedViews) ? 1 : view._resetBufferedViews(),
                    _bufferedEls = isFragment(view._bufferedEls) ? 1 : view._resetBufferedEls();
            },
            _addBufferedView: function (view) {
                var parent = this,
                    el = view.el && view.el[INDEX](0);
                if (el) {
                    parent._bufferedEls.appendChild(el);
                    parent._bufferedViews.push(view);
                }
            },
            _resetBuffered: function () {
                this._resetBufferedEls();
                this._resetBufferedViews();
            },
            _resetBufferedViews: function () {
                this._bufferedViews = [];
            },
            _resetBufferedEls: function () {
                this._bufferedEls = createDocumentFragment();
            },
            _setElement: function () {
                var region = this,
                    selector = region.selector,
                    parent = region[PARENT];
                if (parent !== app) {
                    region.el = parent.$(selector);
                } else {
                    region.el = $($(selector)[INDEX](0));
                }
            },
            render: function () {
                var region = this;
                region[IS_RENDERED] = BOOLEAN_FALSE;
                // doc frags on regionviews, list of children to trigger events on
                region._ensureBufferedViews();
                // request extra data or something before rendering: dom is still completely intact
                region[DISPATCH_EVENT]('before:' + RENDER);
                // unbinds and rebinds element only if it changes
                region._setElement();
                // update new element's attributes
                region._setElAttributes();
                // puts children back inside parent
                region._attachBufferedViews();
                // attach region element
                // appends child elements
                region[APPEND_CHILD_ELEMENTS]();
                // mark the view as rendered
                region[IS_RENDERED] = BOOLEAN_TRUE;
                // reset buffered objects
                region._resetBuffered();
                // dispatch the render event
                region[DISPATCH_EVENT](RENDER);
                return region;
            },
            _appendChildElements: function () {
                var region = this,
                    buffered = region._bufferedEls,
                    el = region.el[INDEX](0);
                if (buffered && el) {
                    el.appendChild(buffered);
                }
            },
            _getElementFromParent: function (selector) {
                var $selected, region = this,
                    parent = region[PARENT];
                if (parent !== app) {
                    $selected = $(parent.$(selector)[INDEX](0));
                } else {
                    $selected = $($(selector)[INDEX](0));
                }
                region.el = $selected;
            },
            _attachBufferedViews: function () {
                var region = this,
                    parentView = region.parentView();
                region.directive(CHILDREN).duff(function (child) {
                    if (result(child, 'filter')) {
                        child[RENDER]();
                        region._addBufferedView(child);
                    }
                });
            }
        }, BOOLEAN_TRUE),
        RegionManager = factories.Collection.extend('RegionManager', {
            createRegion: function (where, region_) {
                var key, regionManager = this,
                    parent = regionManager[PARENT],
                    // assume that it is a region
                    region = region_;
                if (isInstance(region, Region)) {
                    return region;
                }
                region = Region({
                    id: where,
                    selector: isString(region) ? region : EMPTY,
                    parent: parent
                });
                key = REGION_MANAGER;
                if (parent !== app) {
                    key = CHILDREN;
                    parent.add(region);
                }
                parent._addToHash(region, key);
                return region;
            },
            removeRegion: function (region_) {
                var regionManager = this;
                var region = isString(region_) ? regionManager.get(region_) : region_;
                regionManager.remove(region);
                regionManager.unRegister(region.id, region);
            },
            establishRegions: function (key, value) {
                var regionManager = this,
                    parentView = regionManager[PARENT];
                intendedObject(key, value, function (key, value) {
                    var region = regionManager.get(key);
                    if (!region) {
                        region = regionManager.createRegion(key, value);
                    }
                    region._getElementFromParent();
                });
                return regionManager;
            }
        }, BOOLEAN_TRUE);
    _.exports({
        compile: compile
    });
    app.extend({
        _addToHash: Box[CONSTRUCTOR][PROTOTYPE]._addToHash,
        getRegion: viewGetRegionPlacer(REGION_MANAGER),
        addRegion: function (id, selector) {
            var app = this;
            // ensure region manager
            var blank = app.getRegion();
            var regionManager = app[REGION_MANAGER];
            regionManager[PARENT] = app;
            regionManager[ESTABLISH_REGIONS](id, selector);
            return app;
        }
    });
});