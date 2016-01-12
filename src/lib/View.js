application.scope().module('View', function (module, app, _, $) {
    var blank, each = _.each,
        isFn = _.isFn,
        duff = _.duff,
        factories = _.factories,
        Box = factories.Box,
        extendFrom = _.extendFrom,
        isString = _.isString,
        gapSplit = _.gapSplit,
        isArray = _.isArray,
        bind = _.bind,
        has = _.has,
        protoProp = _.protoProp,
        lengthString = 'length',
        optionsString = 'options',
        templates = {},
        compile = function (id, force) {
            var matches, tag, template, attrs, templateFn = templates[id];
            if (!templateFn || force) {
                tag = $(id);
                template = tag.html();
                matches = template.match(/\{\{([\w\s\d]*)\}\}/mgi);
                attrs = _.map(matches, function (match) {
                    return {
                        match: match,
                        attr: match.split('{{').join('').split('}}').join('').trim()
                    };
                });
                template = template.trim();
                templateFn = templates[id] = function (obj) {
                    var str = template,
                        clone = _.clone(obj);
                    duff(attrs, function (idx, match) {
                        if (!clone[match.attr]) {
                            clone[match.attr] = '';
                        }
                        str = str.replace(match.match, clone[match.attr]);
                    });
                    return str;
                };
            }
            return templateFn;
        },
        scrapeData = function (model, el, attributes) {
            var val, value, str = model.dataScrape;
            if (str) {
                value = el.data(str);
                if (isString(value)) {
                    val = {};
                    val[_.camelCase(str)] = value;
                    value = val;
                }
                _.extend(attributes, value);
            }
        },
        ensureUIObj = function (fn) {
            return function () {
                var ui, view = this,
                    viewEl = view.el;
                if (!_.has(view, 'ui')) {
                    ui = view.ui || {};
                    view.ui = {};
                    each(ui, function (domm, key) {
                        view.ui[key] = $();
                        viewEl.find(domm).duff(function (el) {
                            view.attachUIElement(key, el);
                        });
                    });
                }
                return fn.apply(view, arguments);
            };
        },
        makeDelegateEventKey = function (view, name) {
            return name + '.delegateEvents' + view.cid;
        },
        makeDelegateEventKeys = function (view, key, namespace) {
            if (namespace) {
                namespace = '.' + namespace;
            } else {
                namespace = '';
            }
            var viewNamespace = 'delegateEvents' + view.cid;
            return _.map(gapSplit(key), function (_key) {
                var __key = _key.split('.');
                if (__key[1] !== viewNamespace) {
                    __key.splice(1, 0, viewNamespace);
                    _key = __key.join('.');
                }
                return _key += namespace;
            }).join(' ');
        },
        normalizeUIString = function(uiString, ui) {
            return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function (r) {
                return ui[r.slice(4)];
            });
        },
        // allows for the use of the @ui. syntax within
        // a given key for triggers and events
        // swaps the @ui with the associated selector.
        // Returns a new, non-mutated, parsed events hash.
        normalizeUIKeys = function(hash, ui) {
            return _.reduce(hash, function (memo, val, key) {
                var normalizedKey = Marionette.normalizeUIString(key, ui);
                memo[normalizedKey] = val;
                return memo;
            }, {});
        },
        viewGetRegion = function (key) {
            var region, view = this,
                regionManager = view.regionManager;
            if (regionManager) {
                region = regionManager.get(key);
            }
            return region;
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
        viewplucks = ['el', 'regionViews'],
        pluckviews = function (from, to, props) {
            duff(props, function (idx, prop) {
                if (has(from, prop)) {
                    to[prop] = from[prop];
                    from[prop] = void 0;
                }
            });
        },
        View = extendFrom.Box('View', {
            /**
             * @func
             * @name View#constructor
             * @description constructor for new view object
             * @param {Object|DOMM|Node} attributes - hash with non-circular data on it. Is set later with the Box constructor
             * @param {Object} secondary - options such as defining the parent object, or the element if necessary
             * @param {DOMM|Node} el - element or Node that is attached directly to the View object
             * @returns {View} instance
             */
            tagName: 'div',
            getRegion: viewGetRegion,
            constructor: function (attributes, secondary) {
                var model = this;
                pluckviews(secondary, model, viewplucks);
                model._ensureElement();
                Box.apply(model, arguments);
                return model;
            },
            childViewContainer: function () {
                return this.el;
            },
            $: function (selector) {
                return this.el.find(selector);
            },
            template: function (ctx) {
                return '';
            },
            _renderHTML: function () {
                var view = this,
                    innerHtml = view.template(view.toJSON());
                view.el.html(innerHtml);
            },
            _ensureRegionManager: function () {
                var view = this;
                // weak association
                var regionManager = view.regionsManager = view.regionsManager || new RegionManager({}, {
                    parent: view
                });
                return regionsManager;
            },
            _appendChildElements: function () {
                var view = this,
                    // scoped under view because it always has to be inside of view
                    el = view.$(_.result(view, 'childViewContainer'));
                // view.children.eachCall('render');
                view.children.each(function (idx, child) {
                    if (_.result(child, 'filter')) {
                        child.render();
                    }
                });
                if (view.parent && !view.parent.rendered()) {
                    view._passBufferedViews();
                }
                // if any were rendered
                el.append(view._bufferedEls);
            },
            _establishRegions: function () {
                var regionsManager, view = this,
                    regions = view._establishedRegions || _.result(view, 'regions');
                if (regions) {
                    view._establishedRegions = regions;
                }
                if (view._establishedRegions) {
                    // hold off making the region manager as long as possible
                    view._ensureRegionManager();
                    // add regions to the region manager
                    view.regionManager.establishRegions(regions);
                }
            },
            render: function () {
                var frag = _.createDocFrag(),
                    view = this;
                view.isRendered = !1;
                view._ensureBufferedViews();
                // detach this element so we don't cause more reflows than necessary
                // view._detachElement();
                // remove the child elements
                // request extra data or something before rendering: is still intact
                view.dispatchEvent('before:render');
                // set render flat
                view.isRendered = !1;
                // unbinds and rebinds element only if it changes
                view.setElement(view.el);
                view._setElAttributes();
                // renders the html
                view._renderHTML();
                // gathers the ui elements
                view._bindUIElements();
                // ties regions back to newly formed parent template
                view._establishRegions();
                // puts children back inside parent
                view._appendChildElements();
                view._attachBufferedViews();
                view.isRendered = !0;
                view.dispatchEvent('render');
                return view;
            },
            filter: function () {
                return true;
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
                    _elementSelector = view._elementSelector || _.result(view, 'el');
                if (_elementSelector) {
                    view._elementSelector = _elementSelector;
                }
                if (!_.isInstance(_elementSelector, _.DOMM)) {
                    if (_.isString(_elementSelector)) {
                        // sets external element
                        el = _elementSelector;
                    } else {
                        // defauts back to wrapping the element
                        // creates internal element
                        el = view._createElement(_.result(view, 'tagName'));
                        // subclassed to expand the attributes that can be used
                    }
                    view.setElement(el);
                }
            },
            _setElAttributes: function () {
                var view = this;
                var attrs = _.result(view, 'elementAttributes') || {};
                if (view.className) {
                    attrs['class'] = _.result(view, 'className');
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
                        __events[makeDelegateEventKeys(view, key)] = _.map(methods, function (idx, method) {
                            return _.bind(view[method] || method, view);
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
                if (el) {
                    each(bindings, function (key, methods_) {
                        // assumes is array
                        var methods = gapSplit(methods_);
                        if (isFunction(methods_)) {
                            methods = [methods_];
                        }
                        __events[makeDelegateEventKeys(view, key)] = _.map(methods, function (idx, method) {
                            return _.bind(view[method] || method, view);
                        });
                    });
                    el.on(__events);
                }
                return view;
            },
            parentView: function () {
                var found, view = this,
                    parent = view.parent;
                while (found && parent && !_.isInstance(parent, View)) {
                    parent = parent.parent;
                    if (_.isInstance(parent, View)) {
                        found = parent;
                    }
                }
                return found;
            },
            _bindUIElements: function () {
                var view = this,
                    _uiBindings = view._uiBindings || _.result(view, 'ui');
                view.ui = view.ui || {};
                if (_uiBindings) {
                    // save it to skip the result call later
                    view._uiBindings = _uiBindings;
                    view.ui = _.hashMap(_uiBindings, function (key, selector) {
                        return view.$(selector);
                    });
                }
                return view;
            },
            _unBindUIElements: function () {
                var view = this;
                view.ui = view._uiBindings;
            },
            remove: function () {
                var el, view = this;
                Box.prototype.remove.apply(view, arguments);
                // if you were not told to select something in
                // _ensureElements then remove the view from the dom
                view.detach();
                return view;
            },
            _detachElement: function () {
                var view = this,
                    el = view.el && view.el.get(0);
                if (el && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            },
            _ensureBufferedViews: function () {
                var bufferedViews = isArray(this._bufferedViews) ? 1 : this._resetBufferedViews();
                var _bufferedEls = _.isFrag(this._bufferedEls) ? 1 : this._resetBufferedEls();
            },
            _resetBuffered: function () {
                this._resetBufferedEls();
                this._resetBufferedViews();
            },
            _addBufferedView: function (view) {
                var parent = this;
                parent._bufferedEls.appendChild(view.el.get(0));
                parent._bufferedViews.push(view);
            },
            _removeViewElement: function (el, frag) {
                var parent = this;
                if (frag) {
                    frag.appendChild(el);
                } else {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el);
                    }
                }
            },
            _add: function (view) {
                var parent = this;
                Box.prototype._add.call(parent, view);
                // ensure the element buffer
                // append to the view list buffer
                // attached buffered element here so we don't have to loop through the list later
                parent._addBufferedView(view);
            },
            add: function (models_) {
                var ret, _bufferedViews, view = this;
                view._ensureBufferedViews();
                ret = Box.prototype.add.call(view, _.isArrayLike(models_) ? models_ : [models_]);
                _.duff(ret, function (view) {
                    view._attemptAttach();
                });
                return ret;
            },
            _attemptAttach: function () {
                var view = this,
                    parent = view.parent;
                if (view.attached() || parent && parent.attached()) {
                    view.attach(view.parent);
                }
            },
            _passBufferedViews: function () {
                var child = this,
                    parent = child.parent;
                if (parent && child._bufferedViews) {
                    parent._ensureBufferedViews();
                    parent._bufferedEls.appendChild(child.el.get(0));
                    parent._bufferedViews.push.apply(parent._bufferedViews, child._bufferedViews);
                    child._resetBufferedViews();
                }
            },
            _resetBufferedViews: function () {
                this._bufferedViews = [];
            },
            _resetBufferedEls: function () {
                this._bufferedEls = _.createDocFrag();
            },
            _attachBufferedChildren: function () {
                var childView, idx = 0,
                    view = this,
                    el = view.$(_.result(view, 'childViewContainer'));
                if (view._bufferedEls) {
                    el.append(view._bufferedEls);
                }
                while (view._bufferedViews && view._bufferedViews[lengthString] && view._bufferedViews[idx]) {
                    childView = view._bufferedViews[idx];
                    idx++;
                    // appends children to parent el
                    childView.attach(childView.parent);
                }
                if (!view.attached()) {
                    view._passBufferedViews();
                }
            },
            _attachBufferedViews: function () {
                var parent = this;
                parent.el.append(parent._bufferedEls);
                _.duff(parent._bufferedViews, function (idx, buffered) {
                    buffered.isAttached = true;
                    buffered.dispatchEvent('attach');
                });
            },
            // _attachTrigger: function () {
            //     var parent = this;
            //     // only has to happen once
            //     parent._attachBufferedViews();
            //     parent._resetBuffered();
            // },
            attach: function (parent_) {
                var view = this;
                if (view.attached()) {
                    if (parent_ && view.parent && parent_ !== view.parent) {
                        view.detach();
                        view.attach(parent_);
                    }
                    view._attachBufferedChildren();
                } else {
                    // resets the html
                    // queue children for attachment
                    view.dispatchEvent('before:attach');
                    // render / attach children to self
                    view._attachBufferedChildren();
                    if (parent_.attached() && !view.attached()) {
                        view.render();
                        // parent_._attachTrigger();
                        parent_._attachBufferedViews();
                        parent_._resetBuffered();
                    }
                }
            },
            // _conditionallyDispachAttached: function () {
            //     var view = this,
            //         parent = view.parent;
            //     if (!view.attached() && parent && parent.attached()) {
            //         view.isAttached = true;
            //         parent.el.append(view.el);
            //         view.dispatchEvent('attach');
            //     }
            // },
            detach: function () {
                var view = this;
                view.dispatchEvent('before:detach');
                view._detachElement();
            },
            /**
             * @func
             * @name View#destroy
             * @description removes dom elemenets as well as all elements on the ui
             * @returns {View} instance
             */
            destroy: function (opts) {
                var view = this;
                view.isRendered = false;
                // done here for redundancy when using iframes
                view.detach();
                // remove all events
                // should internally call remove
                Box.prototype.destroy.call(view);
                return view;
            },
            rendered: function () {
                return this.isRendered;
            },
            destroyed: function () {
                return this.isDestroyed;
            },
            attached: function () {
                return this.isAttached;
            }
        }, !0),
        Region = factories.View.extend('Region', {
            Model: View,
            _delegateEvents: _.noop,
            _unDelegateEvents: _.noop,
            fill: function (newView) {
                var region = this,
                    currentView = region.currentView;
                if (!newView) {
                    return;
                }
                if (currentView !== newView) {
                    region.empty();
                    region.add(newView);
                    region.currentView = newView;
                    newView.attach(region);
                }
                return currentView;
            },
            empty: function () {
                var region = this,
                    currentView = region.currentView;
                if (currentView) {
                    currentView.detach();
                }
            }
        }, true),
        RegionManager = factories.Collection.extend('RegionManager', {
            Model: Region,
            createRegion: function (where, region_) {
                var scope, regionManager = this,
                    // assume that it is a region
                    region = region_;
                if (!(region instanceof regionManager.Model)){
                    region = new regionManager.Model({
                        id: where
                    }, {
                        el: regionManager._getElementFromDom(region)
                    });
                }
                regionManager.add(region);
                regionManager.register(region.get('id'), region);
            },
            _getElementFromDom: function (selector) {
                var regionManager = this;
                var $ = regionManager.getElementContext();
                var $selected = $(selector);
                return $selected;
            },
            removeRegion: function (region_) {
                var regionManager = this;
                var region = _.isString(region_) ? regionManager.get(region_) : region_;
                regionManager.remove(region);
                regionManager.unregister(region.get('id'), region);
            },
            _setElementContext: function ($) {
                this.$ = $;
            },
            _resetElementContext: function () {
                this.$ = void 0;
            },
            defaultContext: function () {
                return $;
            },
            getElementContext: function () {
                var regionManager = this;
                var parent = regionManager.parent;
                var _$ = _.has(regionManager, '$') ? regionManager.$ : $;
                if (parent && parent.$ && !regionManager.$) {
                    regionManager.$ = _.bind(parent.$, parent);
                    _$ = regionManager.$;
                }
                return _$;
            },
            establishRegion: function (key, value) {
                var regionManager = this;
                var region = regionManager.get(key);
                if (!region) {
                    regionManager.createRegion(key, value);
                }
            },
            establishRegions: function (regions) {
                var regionManager = this;
                var reversed = _.reverseParams(_.bind(regionManager.establishRegion, regionManager));
                _.each(regions, reversed, regionManager);
                return regionManager;
            }
        }, true);
    _.exports({
        htmlCompile: compile
    });
    app.regionManager = new RegionManager();
    app.extend({
        addRegion: function (where, selector) {
            var app = this;
            var regionManager = app.regionManager;
            _.intendedObject(where, selector, function (key, value) {
                var region;
                regionManager.establishRegion(key, value);
                region = regionManager.get(key);
                region.isAttached = true;
            });
            return app;
        },
        getRegion: viewGetRegion,
        addRegions: function (obj) {
            var app = this;
            app.addRegion(obj);
            return app;
        }
    });
});