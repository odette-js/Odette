application.scope().module('Element', function (module, app, _, factories) {
    var basicViewTrigger = function (name, e) {
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
                if (!isInstance(selector, factories.DOMM)) {
                    if (isString(selector)) {
                        // sets external element
                        el = selector;
                    } else {
                        // defauts back to wrapping the element
                        // creates internal element
                        el = element.create(result(view, 'tagName'));
                        // subclassed to expand the attributes that can be used
                    }
                    element.set(el);
                }
            },
            create: function (tag) {
                return $($.createElement(tag)).index(0);
            },
            set: function (el) {
                this.view.el = this.el = factories.DomManager.isInstance(el) ? el : $(el).index(0);
            },
            delegate: function () {
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
                    __events.push(object);
                    el.on(object.events.join(SPACE), object[SELECTOR], bound);
                });
                elDir.cachedElementBindings = __events;
                return elDir;
            },
            undelegate: function () {
                var key, method, match, elDir = this,
                    view = elDir.view,
                    el = elDir.el,
                    elementBindings = elDir.cachedElementBindings;
                if (!elementBindings || !el) {
                    return elDir;
                }
                duff(elementBindings, function (binding) {
                    el.off(binding.events.join(SPACE), binding[SELECTOR], binding.fn);
                });
                elDir.cachedElementBindings = UNDEFINED;
                return elDir;
            },
            delegateTriggers: function () {
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
                    el.on(object.events.join(SPACE), object[SELECTOR], bound);
                });
                elDir.cachedElementTriggers = __events;
            },
            undelegateTriggers: function () {
                var key, method, match, elDir = this,
                    view = elDir.view,
                    el = elDir.el,
                    elementBindings = elDir.cachedElementTriggers;
                if (!elDir.cachedElementTriggers || !el) {
                    return elDir;
                }
                duff(elementBindings, function (binding) {
                    el.off(binding.events.join(SPACE), binding[SELECTOR], binding.fn);
                });
                elDir.cachedElementTriggers = UNDEFINED;
                return elDir;
            },
            setAttributes: function () {
                var elDir = this,
                    view = elDir.view,
                    attrs = result(view, 'elementAttributes');
                if (view[CLASSNAME]) {
                    attrs = attrs || {};
                    attrs[CLASS] = result(view, CLASSNAME);
                }
                if (attrs) {
                    elDir.el.attr(attrs);
                }
            },
            render: function (html) {
                var element = this;
                element.undelegate();
                element.undelegateTriggers();
                element.unbindUI();
                element.el.html(html || '');
                element.bindUI();
                element.delegate();
                element.delegateTriggers();
            },
            bindUI: function () {
                var elDir = this,
                    uiBindings = elDir.uiBindings || result(elDir.view, 'ui'),
                    ui = elDir.ui = elDir.ui || {};
                if (elDir.uiBindings) {
                    return elDir;
                }
                // save it to skip the result call later
                elDir.uiBindings = uiBindings;
                elDir.ui = elDir.view.ui = map(uiBindings, elDir.el.$, elDir.el);
                return elDir;
            },
            unbindUI: function () {
                var elDir = this;
                if (elDir.ui) {
                    elDir.ui = elDir.uiBindings = UNDEFINED;
                    delete elDir.view.ui;
                }
            }
        });
    app.defineDirective(ELEMENT, Element[CONSTRUCTOR]);
});