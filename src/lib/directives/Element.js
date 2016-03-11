app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        basicViewTrigger = function (name, e) {
            return this[DISPATCH_EVENT](name, e);
        },
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
                    memo[SELECTOR] = normalizeUIString(_key, bindings);
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
        Element = factories.Directive.extend('Element', {
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
                if (isInstance(selector, factories.DOMM)) {
                    return;
                }
                if (isString(selector)) {
                    // sets external element
                    el = selector;
                } else {
                    // defauts back to wrapping the element
                    // creates internal element
                    el = element.create(result(view, 'tagName'));
                    // subclassed to expand the attributes that can be used
                }
                element.set(el, BOOLEAN_FALSE);
            },
            create: function (tag) {
                return $.createElement(tag);
            },
            unset: function () {
                var element = this;
                // element.undelegateEvents();
                // element.undelegateTriggers();
                delete element.view.el;
                delete element.el;
            },
            set: function (el, render) {
                var directive = this;
                directive.view.el = directive.el = el;
                // directive.degenerateUIBindings();
                // if (render !== BOOLEAN_FALSE) {
                //     directive.render(render);
                //     directive.generateUIBindings();
                //     directive.bindUI();
                //     if (newelementisDifferent) {
                //         directive.delegateEvents();
                //         directive.delegateTriggers();
                //     }
                // }
            },
            render: function (html) {
                var element = this;
                element.el.html(html || '');
                return element;
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
                each(elementBindings, function (method, key) {
                    var object = makeDelegateEventKeys(view.cid, directive.uiBindings, key),
                        bound = object.fn = bind(view[method] || method, view);
                    __events.push(object);
                    el.on(object.events.join(SPACE), object[SELECTOR], bound);
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
                    el.off(binding.events.join(SPACE), binding[SELECTOR], binding.fn);
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
                        bound = object.fn = basicViewTrigger.bind(view, method);
                    el.on(object.events.join(SPACE), object[SELECTOR], bound);
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
            setAttributes: function () {
                var directive = this,
                    view = directive.view,
                    attrs = result(view, 'elementAttributes');
                if (view[CLASSNAME]) {
                    attrs = attrs || {};
                    attrs[CLASS] = result(view, CLASSNAME);
                }
                if (attrs) {
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
    app.defineDirective(ELEMENT, Element[CONSTRUCTOR], function (directive, instance) {
        directive.el.destroy();
        directive.unset();
        var ui = directive.ui;
        directive.degenerateUIBindings();
        _.eachCall(ui, 'destroy');
    });
});