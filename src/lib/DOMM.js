app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        posit = _.posit,
        Collection = factories.Collection,
        globalAssociator = factories.Associator(),
        ensure = function (el, owner) {
            var data;
            if (owner === BOOLEAN_TRUE) {
                data = globalAssociator.get(el);
            } else {
                data = owner.data.get(el);
            }
            if (!data[DOM_MANAGER_STRING]) {
                data[DOM_MANAGER_STRING] = DomManager(el, data, owner);
            }
            return data[DOM_MANAGER_STRING];
        },
        DOM_MANAGER_STRING = 'DomManager',
        NODE_TYPE = 'nodeType',
        LOCAL_NAME = 'localName',
        APPEND_CHILD = 'appendChild',
        REMOVE_CHILD = 'removeChild',
        PARENT_NODE = 'parentNode',
        ITEMS = '_items',
        INNER_HTML = 'innerHTML',
        INNER_TEXT = 'innerText',
        DELEGATE_COUNT = '__delegateCount',
        REMOVE_QUEUE = 'removeQueue',
        IS_ATTACHED = 'isAttached',
        ADD_QUEUE = 'addQueue',
        CUSTOM_KEY = 'data-custom',
        CUSTOM_ATTRIBUTE = '[' + CUSTOM_KEY + ']',
        CLASS__NAME = (CLASS + HYPHEN + NAME),
        FONT_SIZE = 'fontSize',
        DEFAULT_VIEW = 'defaultView',
        DIV = 'div',
        IFRAME = 'iframe',
        devicePixelRatio = (win.devicePixelRatio || 1),
        // By default, Underscore uses ERB-style template delimiters, change the
        // following template settings to use alternative delimiters.
        // When customizing `templateSettings`, if you don't want to define an
        // interpolation, evaluation or escaping regex, we need one that is
        // guaranteed not to match.
        noMatch = /(.)^/,
        // Certain characters need to be escaped so that they can be put into a
        // string literal.
        escapes = {
            "'": "'",
            '\\': '\\',
            '\r': 'r',
            '\n': 'n',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        },
        escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g,
        escapeChar = function (match) {
            return '\\' + escapes[match];
        },
        // List of HTML entities for escaping,
        escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        },
        unescapeMap = invert(escapeMap),
        // Functions for escaping and unescaping strings to/from HTML interpolation,
        createEscaper = function (map) {
            var escaper = function (match) {
                return map[match];
            };
            // Regexes for identifying a key that needs to be escaped.
            var source = '(?:' + keys(map).join('|') + ')';
            var testRegexp = RegExp(source);
            var replaceRegexp = RegExp(source, 'g');
            return function (string) {
                string = string == NULL ? EMPTY_STRING : EMPTY_STRING + string;
                return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
            };
        },
        escape = createEscaper(escapeMap),
        unescape = createEscaper(unescapeMap),
        // JavaScript micro-templating, similar to John Resig's implementation.
        // Underscore templating handles arbitrary delimiters, preserves whitespace,
        // and correctly escapes quotes within interpolated code.
        // NB: `oldSettings` only exists for backwards compatibility.
        templateGenerator = function (text, templateSettings) {
            var settings = extend({}, templateSettings);
            // Combine delimiters into one regular expression via alternation.
            var matcher = RegExp([
                (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');
            // Compile the template source, escaping string literals appropriately.
            var index = 0;
            var source = "__p+='";
            text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
                index = offset + match.length;
                if (escape) {
                    source += "'+\n((__t=(this." + escape + "))==null?'':_.escape(__t))+\n'";
                } else if (interpolate) {
                    source += "'+\n((__t=(this." + interpolate + "))==null?'':__t)+\n'";
                } else if (evaluate) {
                    source += "';\n" + evaluate + "\n__p+='";
                }
                // Adobe VMs need the match returned to produce the correct offset.
                return match;
            });
            source += "';\n";
            // If a variable is not specified, place data values in local scope.
            // if (!settings.variable) source = 'with(this||{}){\n' + source + '}\n';
            source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n';
            var render;
            try {
                render = new Function.constructor(settings.variable || '_', source);
            } catch (e) {
                e.source = source;
                throw e;
            }
            var template = function (data) {
                return render.call(data || {}, _);
            };
            // Provide the compiled source as a convenience for precompilation.
            var argument = settings.variable || 'obj';
            template.source = 'function(' + argument + '){\n' + source + '}';
            return template;
        },
        compile = function (id, template_, context) {
            var template, templates = context.templates = context.templates || Collection(),
                templateHandler = templates.get(ID, id);
            if (templateHandler) {
                return templateHandler;
            }
            template = template_ || context.$('#' + id).html();
            templateHandler = templateGenerator(template, context.templateSettings);
            templateHandler.id = id;
            templates.push(templateHandler);
            templates.register(ID, id, templateHandler);
            return templateHandler;
        },
        isElement = function (object) {
            return !!(object && isNumber(object[NODE_TYPE]) && object[NODE_TYPE] === object.ELEMENT_NODE);
        },
        /**
         * @private
         * @func
         */
        isWindow = function (obj) {
            return obj && obj === obj[WINDOW];
        },
        /**
         * @private
         * @func
         */
        isDocument = function (obj) {
            return obj && isNumber(obj[NODE_TYPE]) && obj[NODE_TYPE] === obj.DOCUMENT_NODE;
        },
        isFragment = function (frag) {
            return frag && frag[NODE_TYPE] === doc.DOCUMENT_FRAGMENT_NODE;
        },
        getClosestWindow = function (windo_) {
            var windo = windo_ || win;
            return isWindow(windo) ? windo : (windo && windo[DEFAULT_VIEW] ? windo[DEFAULT_VIEW] : (windo.ownerGlobal ? windo.ownerGlobal : DOMM(windo).parent(WINDOW)[INDEX](0) || win));
        },
        getComputed = function (el, ctx) {
            var ret = getClosestWindow(ctx).getComputedStyle(el);
            return ret ? ret : getClosestWindow(el).getComputedStyle(el) || clone(el[STYLE]) || {};
        },
        allStyles = getComputed(doc[BODY], win),
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        motionMorph = /^device/,
        rforceEvent = /^webkitmouseforce/,
        hasWebP = (function () {
            var countdown = 4,
                result = BOOLEAN_TRUE,
                queue = [],
                emptyqueue = function (fn) {
                    return function () {
                        countdown--;
                        fn();
                        if (!countdown) {
                            duff(queue, function (item) {
                                item(result);
                            });
                            queue = [];
                        }
                    };
                };
            duff(["UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==", "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"], function (val) {
                var img = new Image();
                img.onload = emptyqueue(noop);
                img.onerror = emptyqueue(function () {
                    result = BOOLEAN_FALSE;
                });
                img.src = "data:image/webp;base64," + val;
            });
            return function (cb) {
                if (!countdown || !result) {
                    cb(result);
                } else {
                    queue.push(cb);
                }
            };
        }()),
        writeAttribute = function (el, key, val_) {
            el.setAttribute(key, (val_ === BOOLEAN_TRUE ? EMPTY_STRING : stringify(val_)) + EMPTY_STRING);
        },
        readAttribute = function (el, key) {
            var coerced, val = el.getAttribute(key);
            if (val === EMPTY_STRING) {
                val = BOOLEAN_TRUE;
            } else {
                if (val == NULL) {
                    val = BOOLEAN_FALSE;
                } else {
                    coerced = +val;
                    val = coerced === coerced ? coerced : val;
                }
            }
            return val;
        },
        /**
         * @private
         * @func
         */
        removeAttribute = function (el, key) {
            el.removeAttribute(key);
        },
        attributeApi = {
            preventUnCamel: BOOLEAN_FALSE,
            read: readAttribute,
            write: writeAttribute,
            remove: removeAttribute
        },
        addRemoveAttributes = function (value_, stringManager) {
            // handle complex adding and removing
            var value = value_,
                isArrayResult = isArray(value);
            if (isObject(value) && !isArrayResult) {
                // toggles add remove value
                each(value, function (value, key) {
                    stringManager.add(key).toggle(!!value);
                });
            } else {
                if (!isArrayResult) {
                    value += EMPTY_STRING;
                }
                stringManager.refill(gapSplit(value));
            }
            return stringManager;
        },
        // trackedAttributeInterface = function (el, key, val, isProp, manager) {
        //     // set or remove if not undefined
        //     // undefined fills in the gap by returning some value, which is never undefined
        //     var isArrayResult, cameledKey = camelCase(key),
        //         el_interface = isProp ? propertyApi : attributeApi,
        //         stringManager = !isProp && (manager || returnsManager(el)).get(cameledKey),
        //         readAttribute = el_interface.read(el, key);
        //     if (!isProp && isString(readAttribute)) {
        //         stringManager.ensure(readAttribute);
        //     }
        //     if (val == NULL) {
        //         return readAttribute;
        //     }
        //     if (!val && val !== 0) {
        //         el_interface.remove(el, key);
        //     } else {
        //         el_interface.write(el, key, isProp ? val : addRemoveAttributes(val, stringManager).generate(SPACE));
        //     }
        //     if (manager.isCustom && readAttribute !== el_interface.read(el, key)) {
        //         manager.dispatchEvent('change:' + key);
        //     }
        // },
        DO_NOT_TRUST = BOOLEAN_FALSE,
        cannotTrust = function (fn) {
            return function () {
                var ret, cachedTrust = DO_NOT_TRUST;
                DO_NOT_TRUST = BOOLEAN_TRUE;
                ret = fn.apply(this, arguments);
                DO_NOT_TRUST = cachedTrust;
                return ret;
            };
        },
        makeEachTrigger = function (attr, api) {
            var whichever = api || attr;
            return cannotTrust(function (manager) {
                var el = manager.element();
                if (ALL_EVENTS_HASH[whichever] && isFunction(el[whichever])) {
                    el[whichever]();
                } else {
                    manager[DISPATCH_EVENT](whichever);
                }
            });
        },
        triggerEventWrapper = function (attr_, api) {
            var attr = attr_ || api,
                eachHandler = makeEachTrigger(attr, api);
            return function (fn, fn2, capturing) {
                var domm = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    domm.on(attr, fn, fn2, capturing);
                } else {
                    domm.duff(eachHandler);
                }
                return domm;
            };
        },
        triggerEventWrapperManager = function (attr_, api) {
            var attr = attr_ || api,
                eachHandler = makeEachTrigger(attr, api);
            return function (fn, fn2, capturing) {
                var manager = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    manager.on(attr, fn, fn2, capturing);
                } else {
                    eachHandler(manager);
                }
                return manager;
            };
        },
        Events = gapSplit('abort afterprint beforeprint blocked cached canplay canplaythrough change chargingchange chargingtimechange checking close complete dischargingtimechange DOMContentLoaded downloading durationchange emptied ended error fullscreenchange fullscreenerror input invalid languagechange levelchange loadeddata loadedmetadata message noupdate obsolete offline online open pagehide pageshow paste pause pointerlockchange pointerlockerror play playing ratechange reset seeked seeking stalled storage submit success suspend timeupdate updateready upgradeneeded versionchange visibilitychange'),
        SVGEvent = gapSplit('SVGAbort SVGError SVGLoad SVGResize SVGScroll SVGUnload SVGZoom volumechange waiting'),
        KeyboardEvent = gapSplit('keydown keypress keyup'),
        GamePadEvent = gapSplit('gamepadconnected gamepadisconnected'),
        CompositionEvent = gapSplit('compositionend compositionstart compositionupdate drag dragend dragenter dragleave dragover dragstart drop'),
        MouseEvents = gapSplit('click contextmenu dblclick mousedown mouseenter mouseleave mousemove mouseout mouseover mouseup show wheel'),
        TouchEvents = gapSplit('touchcancel touchend touchenter touchleave touchmove touchstart'),
        DeviceEvents = gapSplit('devicemotion deviceorientation deviceproximity devicelight'),
        FocusEvent = gapSplit('blur focus'),
        TimeEvent = gapSplit('beginEvent endEvent repeatEvent'),
        AnimationEvent = gapSplit('animationend animationiteration animationstart transitionend'),
        AudioProcessingEvent = gapSplit('audioprocess complete'),
        UIEvents = gapSplit('abort error hashchange load orientationchange readystatechange resize scroll select unload beforeunload'),
        ProgressEvent = gapSplit('abort error load loadend loadstart popstate progress timeout'),
        AllEvents = _.concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvent, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvent, TimeEvent, AnimationEvent, AudioProcessingEvent, UIEvents, ProgressEvent),
        knownPrefixes = gapSplit('-o- -ms- -moz- -webkit- mso- -xv- -atsc- -wap- -khtml- -apple- prince- -ah- -hp- -ro- -rim- -tc-'),
        trustedEvents = gapSplit('load scroll resize orientationchange click dblclick mousedown mouseup mouseover mouseout mouseenter mouseleave mousemove change contextmenu hashchange load mousewheel wheel readystatechange'),
        validTagNames = gapSplit('a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del dfn div dl dt em embed fieldset figcaption figure footer form h1 - h6 head header hr html i iframe img input ins kbd keygen label legend li link main map mark meta meter nav noscript object ol optgroup option output p param pre progress q rb rp rt rtc ruby s samp script section select small source span strong style sub sup table tbody td template textarea tfoot th thead time title tr track u ul var video wbr'),
        validTagsNamesHash = wrap(validTagNames, BOOLEAN_TRUE),
        ALL_EVENTS_HASH = wrap(AllEvents, BOOLEAN_TRUE),
        knownPrefixesHash = wrap(knownPrefixes, BOOLEAN_TRUE),
        StringManager = factories.StringManager,
        readProperty = function (el, property) {
            return el[property];
        },
        writeProperty = function (el, property, value) {
            el[property] = value;
        },
        removeProperty = function (el, property) {
            el[property] = NULL;
        },
        propertyApi = {
            preventUnCamel: BOOLEAN_TRUE,
            read: readProperty,
            write: writeProperty,
            remove: removeProperty
        },
        ensureManager = function (manager, attribute, currentValue) {
            var _attributeManager = manager.get(attribute);
            return _attributeManager.ensure(currentValue === BOOLEAN_TRUE ? EMPTY_STRING : currentValue, SPACE);
        },
        // queueAttributes = function (attribute, first_, second_, api, merge, after) {
        //     var first = gapSplit(first_),
        //         second = gapSplit(second_);
        //     return function (manager) {
        //         var el = manager.unwrap();
        //         var result = merge(ensureManager(manager, attribute, api.read(el, attribute)), first, second);
        //         return after && api[after] && api[after](el, attribute, result.generate(SPACE));
        //     };
        // },
        // DOMQueueAttributes = function (list, attribute, first_, second_, api, merge, after) {
        //     duff(list, queueAttributes(attribute, first_, second_, api, merge, after));
        // },
        // ManagerQueueAttributes = function (manager, attribute, first_, second_, api, merge, after) {
        //     queueAttributes(attribute, first_, second_, api, merge, after)(manager);
        // },
        // globalQueueAttributes = function (merge, multipleOrNot) {
        //     return function (attribute, api, insides) {
        //         return function (list, first, second, attribute_, insides_) {
        //             var inside = insides_ === UNDEFINED ? insides : insides_;
        //             return multipleOrNot(list, attribute_ || attribute, first, second, api, merge, inside);
        //         };
        //     };
        // },
        // _addAttributeValues = function (attributeManager, add) {
        //     duff(add, attributeManager.add, attributeManager);
        //     return attributeManager;
        // },
        // _removeAttributeValues = function (attributeManager, remove) {
        //     duff(remove, attributeManager.remove, attributeManager);
        //     return attributeManager;
        // },
        // _toggleAttributeValues = function (attributeManager, togglers) {
        //     duff(togglers, attributeManager.toggle, attributeManager);
        //     return attributeManager;
        // },
        // _changeAttributeValues = function (attributeManager, remove, add) {
        //     return _addAttributeValues(_removeAttributeValues(attributeManager, remove), add);
        // },
        // _booleanAttributeValues = function (attributeManager, addremove, follows) {
        //     // rework this
        //     return (addremove ? _addAttributeValues : _removeAttributeValues)(attributeManager, follows);
        // },
        // // global attribute manager handlers
        // addAttributeValues = globalQueueAttributes(_addAttributeValues, DOMQueueAttributes),
        // removeAttributeValues = globalQueueAttributes(_removeAttributeValues, DOMQueueAttributes),
        // toggleAttributeValues = globalQueueAttributes(_toggleAttributeValues, DOMQueueAttributes),
        // changeAttributeValues = globalQueueAttributes(_changeAttributeValues, DOMQueueAttributes),
        // booleanAttributeValues = globalQueueAttributes(_booleanAttributeValues, DOMQueueAttributes),
        // scoped to class
        // classNameApi = {
        //     read: getClassName,
        //     write: setClassName,
        //     remove: removeAttribute
        // },
        // addClass = addAttributeValues(CLASSNAME, classNameApi),
        // removeClass = removeAttributeValues(CLASSNAME, classNameApi),
        // toggleClass = toggleAttributeValues(CLASSNAME, classNameApi),
        // changeClass = changeAttributeValues(CLASSNAME, classNameApi),
        // booleanClass = booleanAttributeValues(CLASSNAME, classNameApi),
        DOMIterator = function (fn, key, applies) {
            return function (one, two) {
                return fn(this.unwrap(), one, two, key, applies);
            };
        },
        DomManagerIterator = function (fn, key, applies) {
            return function (one, two) {
                return fn([this], one, two, key, applies);
            };
        },
        // containsClass = function (classes_) {
        //     var classes = gapSplit(classes_);
        //     return !!(classes[LENGTH] && this[LENGTH]() && !find(this.unwrap(), managerContainsClass(classes)));
        // },
        /**
         * @private
         * @func
         */
        // returns the flow of the element passed on relative to the element's bounding window
        flow = function (el, ctx) {
            var clientRect = el.getBoundingClientRect(),
                computedStyle = getComputed(el, ctx),
                marginTop = unitRemoval(computedStyle.marginTop),
                marginLeft = unitRemoval(computedStyle.marginLeft),
                marginRight = unitRemoval(computedStyle.marginRight),
                marginBottom = unitRemoval(computedStyle.marginBottom);
            return {
                height: clientRect[HEIGHT],
                width: clientRect[WIDTH],
                top: clientRect[TOP] - marginTop,
                left: clientRect[LEFT] - marginLeft,
                right: clientRect[LEFT] - marginLeft + clientRect[WIDTH] - marginRight,
                bottom: clientRect[TOP] - marginTop + clientRect[HEIGHT] - marginBottom
            };
        },
        numberBasedCss = {
            columnCount: BOOLEAN_TRUE,
            columns: BOOLEAN_TRUE,
            fontWeight: BOOLEAN_TRUE,
            lineHeight: BOOLEAN_TRUE,
            opacity: BOOLEAN_TRUE,
            zIndex: BOOLEAN_TRUE,
            zoom: BOOLEAN_TRUE,
            animationIterationCount: BOOLEAN_TRUE,
            boxFlex: BOOLEAN_TRUE,
            boxFlexGroup: BOOLEAN_TRUE,
            boxOrdinalGroup: BOOLEAN_TRUE,
            flex: BOOLEAN_TRUE,
            flexGrow: BOOLEAN_TRUE,
            flexPositive: BOOLEAN_TRUE,
            flexShrink: BOOLEAN_TRUE,
            flexNegative: BOOLEAN_TRUE,
            flexOrder: BOOLEAN_TRUE,
            lineClamp: BOOLEAN_TRUE,
            order: BOOLEAN_TRUE,
            orphans: BOOLEAN_TRUE,
            tabSize: BOOLEAN_TRUE,
            widows: BOOLEAN_TRUE,
            // SVG-related properties
            fillOpacity: BOOLEAN_TRUE,
            stopOpacity: BOOLEAN_TRUE,
            strokeDashoffset: BOOLEAN_TRUE,
            strokeOpacity: BOOLEAN_TRUE,
            strokeWidth: BOOLEAN_TRUE
        },
        timeBasedCss = {
            transitionDuration: BOOLEAN_TRUE,
            animationDuration: BOOLEAN_TRUE,
            transitionDelay: BOOLEAN_TRUE,
            animationDelay: BOOLEAN_TRUE
        },
        /**
         * @private
         * @func
         */
        // prefixedStyles,
        prefixedStyles = (function () {
            var i, j, n, found, prefixIndex, __prefix, styleName, currentCheck, deprefixed, currentLen,
                validCssNames = [],
                prefixed = {},
                len = 0,
                addPrefix = function (list, prefix) {
                    if (!posit(list, __prefix)) {
                        list.push(__prefix);
                    }
                };
            for (i = 0; i < knownPrefixes[LENGTH]; i++) {
                currentLen = knownPrefixes[i][LENGTH];
                if (len < currentLen) {
                    len = currentLen;
                }
            }
            for (n in allStyles) {
                found = 0;
                currentCheck = EMPTY_STRING;
                __prefix = EMPTY_STRING;
                if (isNumber(+n)) {
                    styleName = allStyles[n];
                } else {
                    styleName = unCamelCase(n);
                }
                deprefixed = styleName;
                for (j = 0; j < len && styleName[j] && !found; j++) {
                    currentCheck += styleName[j];
                    prefixIndex = indexOf(knownPrefixes, currentCheck);
                    if (prefixIndex !== -1) {
                        __prefix = knownPrefixes[prefixIndex];
                        deprefixed = styleName.split(__prefix).join(EMPTY_STRING);
                        found = 1;
                    }
                    prefixIndex = indexOf(knownPrefixes, HYPHEN + currentCheck);
                    if (prefixIndex !== -1) {
                        __prefix = knownPrefixes[prefixIndex];
                        deprefixed = styleName.split(currentCheck).join(EMPTY_STRING);
                        found = 1;
                    }
                }
                deprefixed = camelCase(deprefixed);
                validCssNames.push(deprefixed);
                if (!prefixed[deprefixed]) {
                    prefixed[deprefixed] = [];
                }
                addPrefix(prefixed[deprefixed], __prefix);
            }
            return prefixed;
            // return function (el, key, value) {
            //     var n, m, j, firstEl, lastKey, prefixes, unCameled, computed, _ret, retObj, finalProp, i = 0,
            //         ret = {},
            //         count = 0,
            //         nuCss = {};
            //     if (!isObject(el)) {
            //         return;
            //     }
            //     if (isBoolean(key)) {
            //         key = el;
            //         retObj = 1;
            //     }
            //     firstEl = el[0];
            //     intendedObject(key, value, function (key, value) {
            //         if (value != NULL) {
            //             count++;
            //             prefixes = [EMPTY_STRING];
            //             if (prefixed[m]) {
            //                 prefixes = prefixed[m].concat(prefixes);
            //             }
            //             for (j = 0; j < prefixes[LENGTH]; j++) {
            //                 finalProp = camelCase(prefixes[j] + m);
            //                 nuCss[finalProp] = modifyFinalProp(finalProp, value);
            //             }
            //         } else {
            //             ret[m] = value;
            //         }
            //     });
            //     if (retObj) {
            //         return nuCss;
            //     }
            //     if (isElement(el)) {
            //         el = [el];
            //     }
            //     if (!count) {
            //         if (isElement(firstEl)) {
            //             _ret = {};
            //             computed = getComputed(firstEl);
            //             count--;
            //             each(ret, function (val_, key, obj) {
            //                 _ret[key] = convertStyleValue(key, computed[key]);
            //                 count++;
            //                 lastKey = key;
            //             });
            //             if (count + 1) {
            //                 if (count) {
            //                     return _ret;
            //                 } else {
            //                     return _ret[lastKey];
            //                 }
            //             }
            //         }
            //     } else {
            //         style(el, nuCss);
            //     }
            // };
        }()),
        convertStyleValue = function (key, value) {
            return +value !== +value ? value : (timeBasedCss[key] ? value + 'ms' : (!numberBasedCss[key] ? value + PIXELS : value));
        },
        /**
         * @private
         * @func
         */
        style = function (els, key, value) {
            if (!els[LENGTH]) {
                return;
            }
            // var bound = bind(styleIteration, this);
            intendedObject(key, value, function (key, value_) {
                bound(key, convertStyleValue(value_));
            });
        },
        // prefixer = function (obj) {
        //     var rez = css(obj, BOOLEAN_TRUE);
        //     return rez;
        // },
        // jsToCss = function (obj) {
        //     var nuObj = {};
        //     each(obj, function (key, val) {
        //         var deCameled = unCamelCase(key),
        //             split = deCameled.split(HYPHEN),
        //             starter = split[0];
        //         if (knownPrefixesHash[HYPHEN + starter + HYPHEN]) {
        //             split[0] = HYPHEN + starter;
        //         }
        //         nuObj[split.join(HYPHEN)] = val;
        //     });
        //     return nuObj;
        // },
        /**
         * @private
         * @func
         */
        box = function (el, ctx) {
            var clientrect, computed, ret = {};
            if (!isElement(el)) {
                return ret;
            }
            computed = getComputed(el, ctx);
            clientrect = clientRect(el, ctx);
            return {
                borderBottom: +computed.borderBottomWidth || 0,
                borderRight: +computed.borderRightWidth || 0,
                borderLeft: +computed.borderLeftWidth || 0,
                borderTop: +computed.borderTopWidth || 0,
                paddingBottom: +computed.paddingBottom || 0,
                paddingRight: +computed.paddingRight || 0,
                paddingLeft: +computed.paddingLeft || 0,
                paddingTop: +computed.paddingTop || 0,
                marginBottom: +computed.marginBottom || 0,
                marginRight: +computed.marginRight || 0,
                marginLeft: +computed.marginLeft || 0,
                marginTop: +computed.marginTop || 0,
                computedBottom: +computed[BOTTOM] || 0,
                computedRight: +computed[RIGHT] || 0,
                computedLeft: +computed[LEFT] || 0,
                computedTop: +computed[TOP] || 0,
                top: clientrect[TOP] || 0,
                left: clientrect[LEFT] || 0,
                right: clientrect[RIGHT] || 0,
                bottom: clientrect[BOTTOM] || 0,
                width: clientrect[WIDTH] || 0,
                height: clientrect[HEIGHT] || 0
            };
        },
        clientRect = function (item) {
            var ret = isElement(item) ? item.getBoundingClientRect() : {};
            return {
                top: ret[TOP] || 0,
                left: ret[LEFT] || 0,
                right: ret[RIGHT] || 0,
                bottom: ret[BOTTOM] || 0,
                width: ret[WIDTH] || 0,
                height: ret[HEIGHT] || 0
            };
        },
        /**
         * @private
         * @func
         */
        unitRemoval = function (str, unit) {
            return +(str.split(unit || 'px').join(EMPTY_STRING).trim()) || 0;
        },
        /**
         * @private
         * @func
         */
        getStyleSize = function (el, attr, win) {
            var val, elStyle, num = el;
            if (isObject(el)) {
                if (isElement(el)) {
                    elStyle = getComputed(el, win);
                } else {
                    elStyle = el;
                }
                val = elStyle[attr];
            } else {
                val = el;
            }
            if (isString(val)) {
                val = unitRemoval(val);
            }
            return val;
        },
        /**
         * @private
         * @func
         */
        filterExpressions = {
            ':even': function (el, idx) {
                return (idx % 2);
            },
            ':odd': function (el, idx) {
                return ((idx + 1) % 2);
            }
        },
        // always in pixels
        numberToUnit = {
            'in': function (val, el, win, styleAttr) {
                return val / 96;
            },
            vh: function (val, el, win, styleAttr) {
                return (val / win[INNER_HEIGHT]) * 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val / 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return (val / win[INNER_WIDTH]) * 100;
            },
            em: function (val, el, win, styleAttr) {
                return val / getStyleSize(el, FONT_SIZE, win);
            },
            mm: function (val, el, win, styleAttr) {
                return val / 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                var mult = Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]);
                return (val / mult) * 100;
            },
            rem: function (val, el, win, styleAttr) {
                return val / getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], FONT_SIZE, win);
            },
            pt: function (val, el, win, styleAttr) {
                return val / 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                var mult = Math.max(win[INNER_HEIGHT], win[INNER_WIDTH]);
                return (val / mult) * 100;
            },
            '%': function (val, el, win, styleAttr) {
                var parent = isElement(el) ? el[PARENT_NODE] : el,
                    _val = getStyleSize(parent, styleAttr, win);
                return (val / _val) * 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val / 16;
            }
        },
        numToUnits = function (num, unit, el, winTop, styleAttr, returnNum) {
            var number = num;
            if (num) {
                number = numberToUnit[unit](num, el, winTop, styleAttr);
            }
            number = (number || 0);
            if (!returnNum) {
                number += unit;
            }
            return number;
        },
        /**
         * @private
         * @func
         */
        unitToNumber = {
            'in': function (val, el, win, styleAttr) {
                return val * 96;
            },
            vh: function (val, el, win, styleAttr) {
                return win[INNER_HEIGHT] * val / 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val * 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return win[INNER_WIDTH] * val / 100;
            },
            em: function (val, el, win, styleAttr) {
                return getStyleSize(el, FONT_SIZE) * val;
            },
            mm: function (val, el, win, styleAttr) {
                return val * 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                return ((Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]) || 1) * val / 100);
            },
            rem: function (val, el, win, styleAttr) {
                return getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], FONT_SIZE) * val;
            },
            pt: function (val, el, win, styleAttr) {
                return val * 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                return ((Math.max(win[INNER_HEIGHT], win[INNER_WIDTH]) || 1) * val / 100);
            },
            '%': function (val, el, win, styleAttr) {
                var parent = isElement(el) ? el[PARENT_NODE] : el,
                    _val = getStyleSize(parent, styleAttr);
                return (val * _val) / 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val * 16;
            }
        },
        unitsToNum = function (str, el, winTop, styleAttr) {
            var ret, number, unit = units(str);
            if (!unit) {
                return str;
            }
            number = unitRemoval(str, unit);
            if (unitToNumber[unit]) {
                number = unitToNumber[unit](number, el, winTop, styleAttr) || 0;
            }
            return number;
        },
        /**
         * @private
         * @func
         */
        tag = function (el, str) {
            var tagName;
            if (!el || !isElement(el)) {
                return BOOLEAN_FALSE;
            }
            tagName = el[LOCAL_NAME].toLowerCase();
            return str ? tagName === str.toLowerCase() : tagName;
        },
        /**
         * @private
         * @func
         */
        createElement = function (str, manager) {
            var newManager, element = manager && manager.element(),
                registeredElements = manager && manager.registeredElements,
                foundElement = registeredElements && registeredElements[str],
                elementName = foundElement === BOOLEAN_TRUE ? str : foundElement,
                // native create
                newElement = elementName ? element.createElement(elementName) : exception({
                    message: 'tag name must be registered'
                });
            if (foundElement && foundElement !== BOOLEAN_TRUE) {
                // registeredElements
                attributeApi.write(newElement, CUSTOM_KEY, str);
            }
            return manager.returnsManager(newElement);
        },
        makeTree = function (str, manager) {
            var div = createElement(DIV, manager);
            // collect custom element
            div.html(str);
            return DOMM(div).children().remove().unwrap();
        },
        /**
         * @private
         * @func
         */
        matches = function (element, selector) {
            var match, parent, matchesSelector;
            if (!selector || !element || element[NODE_TYPE] !== 1) {
                return BOOLEAN_FALSE;
            }
            matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) {
                return matchesSelector.call(element, selector);
            }
            // fall back to performing a selector:
            parent = element[PARENT_NODE];
            if (!parent) {
                parent = createElement(DIV, ensure(element.ownerDocument, BOOLEAN_TRUE));
                parent[APPEND_CHILD](element);
            }
            return !!posit(query(selector, parent), element);
        },
        createDocumentFragment = function (nulled, context) {
            return context.element().createDocumentFragment();
        },
        /**
         * @private
         * @func
         */
        createElements = function (tagName, context) {
            return DOMM(foldl(gapSplit(tagName), function (memo, name) {
                memo.push(createElement(name, context));
                return memo;
            }, []), NULL, NULL, NULL, context);
        },
        fragment = function (els_, context) {
            var frag, els = els_;
            if (isFragment(els)) {
                frag = els;
            } else {
                if (DOMM.isInstance(els)) {
                    els = els.unwrap();
                }
                if (!isArray(els)) {
                    els = [els];
                }
                frag = context.createDocumentFragment();
                duff(els, function (manager_) {
                    var parentNode, manager = context.returnsManager(manager_),
                        el = manager.element();
                    if (!isElement(el) || isFragment(el)) {
                        return;
                    }
                    parentNode = el[PARENT_NODE];
                    if (parentNode && !isFragment(parentNode)) {
                        dispatchDetached([el], context);
                    }
                    frag[APPEND_CHILD](el);
                });
            }
            return frag;
        },
        htmlTextManipulator = function (attr) {
            return function (string) {
                var dom = this;
                return isString(string) ? dom.eachCall(attr, string) && dom : dom.map(getInnard.bind(NULL, attr)).join(EMPTY_STRING);
            };
        },
        horizontalTraverser = function (_idxChange) {
            return attachPrevious(function (idxChange_) {
                var domm = this,
                    collected = [],
                    list = domm.unwrap(),
                    idxChange = _idxChange || idxChange_;
                if (idxChange) {
                    duff(list, function (el) {
                        var parent = el[PARENT_NODE],
                            idx = (indexOf(parent.children, el) + idxChange),
                            item = parent.children[idx];
                        if (item && !posit(list, item)) {
                            add(collected, item);
                        }
                    });
                } else {
                    // didn't traverse anywhere
                    collected = list;
                }
                return collected;
            });
        },
        discernClassProperty = function (isProp) {
            return isProp ? CLASSNAME : CLASS;
        },
        makeDataKey = function (_key) {
            var dataString = 'data-',
                key = unCamelCase(_key),
                sliced = _key.slice(0, 5);
            if (dataString !== sliced) {
                key = dataString + _key;
            }
            return key;
        },
        // dataAttributeManipulator = function (el, _key, val, isProp, data) {
        //     return trackedAttributeInterface(el, makeDataKey(_key), val, isProp, data);
        // },
        styleAttributeManipulator = function (manager, key, value) {
            var element = manager.element();
            if (manager.isElement) {
                if (value === BOOLEAN_TRUE) {
                    return element[STYLE][key];
                } else {
                    element[STYLE][key] = value;
                }
            }
        },
        styleValueModifiers = {
            '-webkit-transform': function (val) {
                return val;
            }
        },
        modifyFinalStyle = function (prop, val) {
            if (styleValueModifiers[prop]) {
                val = styleValueModifiers[prop](val);
            }
            return val;
        },
        styleAttributeMeat = function (manager, key, value, list, hash, handler, isProperty) {
            var finalProp, j, prefixes, cameledKey = camelCase(key),
                element = manager.element();
            list.push(cameledKey);
            if (value != NULL) {
                prefixes = [EMPTY_STRING] || prefixedStyles[cameledKey];
                for (j = 0; j < prefixes[LENGTH]; j++) {
                    finalProp = camelCase(prefixes[j] + cameledKey);
                    handler(manager, finalProp, modifyFinalStyle(finalProp, value));
                }
            } else {
                hash[key] = getComputed(firstEl)[cameledKey];
            }
        },
        // domAttributeMeat = function (manager, key, value, list, hash, handler, isProperty) {
        //     var unCameledKey = unCamelCase(key),
        //         element = manager.unwrap();
        //     if (unCameledKey === CLASS__NAME) {
        //         isProperty = isString(element[CLASSNAME]);
        //         unCameledKey = discernClassProperty(isProperty);
        //     }
        //     value = handler(element, unCameledKey, value, isProperty, manager);
        //     list.push(key);
        //     if (value !== UNDEFINED) {
        //         hash[key] = value;
        //     }
        // },
        DomManagerRunsInstances = function (handler, key, value, list, hash, diffHandler, isProperty) {
            return function (manager) {
                return handler(manager, key, value, list, hash, diffHandler, isProperty);
            };
        },
        ManagerProducesKeyValues = function (context, list, hash, totalHandler, handler, isProperty) {
            return function (key, value) {
                DomManagerRunsInstances(totalHandler, key, value, list, hash, handler, isProperty)(context);
            };
        },
        DOMproducesKeyValues = function (context, list, hash, totalHandler, handler, isProperty) {
            return function (key, value) {
                context.duff(DomManagerRunsInstances(totalHandler, key, value, list, hash, handler, isProperty));
            };
        },
        domAttributeManipulator = function (totalHandler, innerHandler, isProperty) {
            return function (understandsContext) {
                return function (key, value) {
                    var context = this,
                        hash = {},
                        list = [];
                    intendedObject(key, value, understandsContext(context, list, hash, totalHandler, innerHandler, isProperty));
                    return list[LENGTH] === 1 ? hash[list[0]] : context;
                };
            };
        },
        attachPrevious = function (fn) {
            return function () {
                var prev = this,
                    // ensures it's still a dom object
                    result = fn.apply(this, arguments),
                    // don't know if we went up or down, so use null as context
                    obj = new DOMM[CONSTRUCTOR](result, NULL, BOOLEAN_TRUE, NULL, prev.context.owner);
                obj._previous = prev;
                return obj;
            };
        },
        // coordinates
        covers = function (element, coords) {
            var _clientRect = clientRect(element),
                bottom = _clientRect[BOTTOM],
                right = _clientRect[RIGHT],
                left = _clientRect[LEFT],
                tippytop = _clientRect[TOP],
                x = coords.x,
                y = coords.y,
                ret = BOOLEAN_FALSE;
            if (x > left && x < right && y > tippytop && y < bottom) {
                ret = BOOLEAN_TRUE;
            }
            return ret;
        },
        center = function (clientRect) {
            return {
                x: clientRect[LEFT] + (clientRect[WIDTH] / 2),
                y: clientRect[TOP] + (clientRect[HEIGHT] / 2)
            };
        },
        distance = function (a, b) {
            var xdiff = a.x - b.x,
                ydiff = a.y - b.y;
            return Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
        },
        closer = function (center, current, challenger) {
            return distance(center, current) < distance(center, challenger);
        },
        createSelector = function (domm, args, fn) {
            var fun, selector, name = args.shift();
            if (isString(args[0]) || args[0] == NULL) {
                selector = args.shift();
            }
            if (isFunction(args[0])) {
                fn = bind(fn, domm);
                fun = args[0];
                duff(gapSplit(name), function (nme) {
                    var split = eventToNamespace(nme),
                        captures = BOOLEAN_FALSE,
                        namespaceSplit = nme.split(PERIOD),
                        nm = namespaceSplit.shift(),
                        namespace = namespaceSplit.join(PERIOD);
                    if (nm[0] === '_') {
                        nm = nm.slice(1);
                        captures = BOOLEAN_TRUE;
                    }
                    fn(nm, namespace, selector, fun, captures);
                });
            }
            return this;
        },
        expandEventListenerArguments = function (fn) {
            return function () {
                var selector, domm = this,
                    // if there's nothing selected, then do nothing
                    args = toArray(arguments),
                    nameOrObject = args.shift();
                if (isObject(nameOrObject)) {
                    if (isString(args[0])) {
                        selector = args.shift();
                    }
                    each(nameOrObject, function (handler, key) {
                        createSelector(domm, [key, selector, handler].concat(args), fn);
                    });
                    return domm;
                } else {
                    args.unshift(nameOrObject);
                    return createSelector(domm, args, fn);
                }
            };
        },
        validateEvent = function (evnt, el, name_) {
            return !isObject(evnt) ? {
                type: evnt || name_,
                bubbles: BOOLEAN_FALSE,
                eventPhase: 2,
                cancelable: BOOLEAN_FALSE,
                defaultPrevented: BOOLEAN_FALSE,
                data: EMPTY_STRING,
                isTrusted: BOOLEAN_FALSE,
                timeStamp: now(),
                target: el
            } : evnt;
        },
        isCapturing = function (evnt) {
            var capturing = BOOLEAN_FALSE,
                eventPhase = evnt.eventPhase;
            if (eventPhase === 1) {
                capturing = BOOLEAN_TRUE;
            }
            return capturing;
        },
        findMatch = function (el, target, selector) {
            var parent, found = NULL;
            if (selector && isString(selector)) {
                parent = target;
                while (parent && !found && isElement(parent) && parent !== el) {
                    if (matches(parent, selector)) {
                        found = parent;
                    }
                    parent = parent[PARENT_NODE];
                }
            }
            return found;
        },
        _eventExpander = wrap({
            ready: 'DOMContentLoaded',
            deviceorientation: 'deviceorientation mozOrientation',
            fullscreenalter: 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
            hover: 'mouseenter mouseleave',
            forcewillbegin: 'mouseforcewillbegin webkitmouseforcewillbegin',
            forcechange: 'mouseforcechange webkitmouseforcechange',
            forcedown: 'mouseforcedown webkitmouseforcedown',
            forceup: 'mouseforceup webkitmouseforceup',
            force: 'mouseforcewillbegin webkitmouseforcewillbegin mouseforcechange webkitmouseforcechange mouseforcedown webkitmouseforcedown mouseforceup webkitmouseforceup'
        }, gapSplit),
        distilledEventName = foldl(_eventExpander, function (memo, arr, key) {
            duff(arr, function (item) {
                memo[item] = key;
            });
            return memo;
        }, {}),
        eventExpander = function (fn_) {
            return function (nme) {
                var fn = bind(fn_, this);
                duff(gapSplit(_eventExpander[nme] || nme), function (name) {
                    fn(name, nme);
                });
            };
        },
        addEventListener = expandEventListenerArguments(function (name, namespace, selector, callback, capture) {
            var manager = this;
            return isFunction(callback) ? _addEventListener(manager, name, namespace, selector, callback, capture) : manager;
        }),
        addEventListenerOnce = expandEventListenerArguments(function (types, namespace, selector, callback, capture) {
            var _callback, manager = this;
            return isFunction(callback) && _addEventListener(manager, types, namespace, selector, (_callback = once(function () {
                _removeEventListener(manager, types, namespace, selector, _callback, capture);
                return callback.apply(this, arguments);
            })), capture);
        }),
        removeEventListener = expandEventListenerArguments(function (name, namespace, selector, handler, capture) {
            var manager = this;
            return isFunction(handler) ? _removeEventListener(manager, name, namespace, selector, handler, capture) : manager;
        }),
        _addEventListener = function (manager, types, namespace, selector, fn_, capture) {
            var handleObj, eventHandler, el = manager.element(),
                events = manager.directive(EVENTS),
                elementHandlers = events.elementHandlers = events.elementHandlers || {},
                fn = bind(fn_, manager),
                wasCustom = manager.isCustom;
            duff(gapSplit(types), eventExpander(function (name, passedName) {
                var foundDuplicate, handlerKey = capture + COLON + name,
                    handlers = events[HANDLERS][handlerKey] = events[HANDLERS][handlerKey] || SortedCollection(),
                    mainHandler = elementHandlers[handlerKey];
                if (!mainHandler) {
                    eventHandler = function (e) {
                        return eventDispatcher(manager, e.type, e, capture);
                    };
                    if (el.addEventListener) {
                        el.addEventListener(name, eventHandler, capture);
                    } else {
                        if (capture) {
                            return;
                        }
                        el.attachEvent(name, eventHandler);
                    }
                    mainHandler = elementHandlers[handlerKey] = {
                        fn: eventHandler,
                        __delegateCount: 0,
                        events: events,
                        currentEvent: NULL,
                        capturing: capture
                    };
                }
                foundDuplicate = handlers.find(function (obj) {
                    return fn_ === obj.handler && obj.namespace === namespace && selector === obj.selector;
                });
                if (foundDuplicate) {
                    return;
                }
                if (!ALL_EVENTS_HASH[name]) {
                    manager.customListeners = BOOLEAN_TRUE;
                }
                addEventQueue({
                    id: ++eventIdIncrementor,
                    valueOf: returnsId,
                    fn: fn,
                    handler: fn_,
                    disabled: BOOLEAN_FALSE,
                    list: handlers,
                    name: name,
                    namespace: namespace,
                    mainHandler: mainHandler,
                    selector: selector,
                    passedName: passedName
                });
            }));
            if (!wasCustom && manager.customListeners) {
                markCustom(manager, BOOLEAN_TRUE);
                manager.isAttached = isAttached(manager.element(), manager.owner);
            }
            return manager;
        },
        eventToNamespace = function (evnt) {
            if (!isString(evnt)) {
                evnt = evnt.type;
            }
            evnt = evnt.split(PERIOD);
            var evntName = evnt.shift();
            return [evntName, evnt.sort().join(PERIOD)];
        },
        SortedCollection = factories.SortedCollection,
        eventIdIncrementor = 0,
        returnsId = function () {
            return this.id;
        },
        appendChild = function (el) {
            return this.insertAt(el, NULL);
        },
        attributeParody = function (method) {
            return function (one, two) {
                return attributeApi[method](this.element(), one, two);
            };
        },
        getInnard = function (attribute, manager) {
            var windo, win, doc, parentElement, returnValue = EMPTY_STRING;
            if (manager.isIframe) {
                testIframe(manager);
                windo = manager.window();
                if (windo.isAccessable) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    returnValue = doc.body ? doc.body[PARENT_NODE].outerHTML : EMPTY_STRING;
                }
            } else {
                if (manager.isElement) {
                    parentElement = manager.element();
                    returnValue = parentElement[attribute];
                }
            }
            return returnValue;
        },
        setInnard = function (attribute, manager, value) {
            var win, doc, windo, parentElement;
            if (manager.isIframe) {
                windo = manager.window();
                testIframe(manager);
                if (windo.isAccessable) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    doc.open();
                    doc.write(value);
                    doc.close();
                }
            } else {
                if (manager.isElement) {
                    parentElement = manager.element();
                    parentElement[attribute] = value || EMPTY_STRING;
                    duff(query(CUSTOM_ATTRIBUTE, parentElement), manager.owner.returnsManager, manager.owner);
                }
            }
        },
        innardManipulator = function (attribute) {
            return function (value) {
                var manager = this,
                    returnValue = manager;
                if (value === UNDEFINED) {
                    returnValue = getInnard(attribute, manager);
                } else {
                    setInnard(attribute, manager, value);
                }
                return returnValue;
            };
        },
        /**
         * @func
         */
        testIframe = function (manager) {
            var contentWindow, contentWindowManager, element = manager.element();
            manager.isIframe = manager.tagName === IFRAME;
            if (!manager.isIframe) {
                return;
            }
            contentWindow = element.contentWindow;
            manager.windowReady = !!contentWindow;
            if (manager.windowReady) {
                contentWindowManager = manager.owner.returnsManager(contentWindow);
                contentWindowManager.iframe = manager;
                markGlobal(contentWindowManager);
            }
        },
        eventDispatcher = function (manager, name, e, capturing_) {
            var capturing = !!capturing_,
                fullName = capturing + COLON + name;
            return factories.Events[CONSTRUCTOR][PROTOTYPE][DISPATCH_EVENT].call(manager, fullName, validateEvent(e, manager.element(), name), capturing);
        },
        directAttributes = {
            id: BOOLEAN_FALSE,
            src: BOOLEAN_FALSE,
            checked: BOOLEAN_FALSE,
            disabled: BOOLEAN_FALSE,
            classes: CLASSNAME
        },
        videoDirectEvents = {
            play: 'playing',
            pause: 'paused'
        },
        directEvents = gapSplit('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'),
        // collected here so DOMM can do what it wants
        allDirectMethods = directEvents.concat(_.keys(videoDirectEvents), _.keys(directAttributes)),
        isAttached = function (element_, owner) {
            var parent, potential, manager = owner.returnsManager(element_),
                element = manager.element();
            if (manager[IS_ATTACHED]) {
                return manager[IS_ATTACHED];
            }
            if (manager.isWindow) {
                return BOOLEAN_TRUE;
            }
            while (!parent && element[PARENT_NODE]) {
                potential = element[PARENT_NODE];
                if (isFragment(potential)) {
                    return BOOLEAN_FALSE;
                }
                if (!isElement(potential)) {
                    return BOOLEAN_TRUE;
                }
                if (potential[__ELID__]) {
                    manager[IS_ATTACHED] = isAttached(potential, owner);
                    return manager[IS_ATTACHED];
                }
                element = potential;
            }
            return BOOLEAN_FALSE;
        },
        dispatchDomEvent = function (evnt, mark) {
            return function (list, owner) {
                var managers = [];
                // mark all managers first
                duff(list, function (element) {
                    var manager = owner.returnsManager(element);
                    var original = manager.isAttached;
                    manager.isAttached = mark;
                    if (mark !== original && manager.isElement && manager.customListeners) {
                        managers.push(manager);
                    }
                });
                _.eachCall(managers, DISPATCH_EVENT, evnt);
            };
        },
        dispatchDetached = dispatchDomEvent('detach', BOOLEAN_FALSE),
        dispatchAttached = dispatchDomEvent('attach', BOOLEAN_TRUE),
        applyStyle = function (key, value, manager) {
            var cached, element = manager.element();
            if (manager.isElement && element[STYLE][key] !== value) {
                cached = attributeApi.read(element, STYLE);
                element[STYLE][key] = convertStyleValue(key, value);
                return attributeApi.read(element, STYLE) !== cached;
            }
            return BOOLEAN_FALSE;
        },
        attributeValuesHash = {
            set: function (attributeManager, set, nulled, read) {
                attributeManager.refill(set === BOOLEAN_TRUE ? [] : set);
                if (set === BOOLEAN_FALSE) {
                    attributeManager.isRemoving = BOOLEAN_TRUE;
                }
                return attributeManager;
            },
            add: function (attributeManager, add) {
                duff(add, attributeManager.add, attributeManager);
                return attributeManager;
            },
            remove: function (attributeManager, remove) {
                duff(remove, attributeManager.remove, attributeManager);
                return attributeManager;
            },
            toggle: function (attributeManager, togglers, direction) {
                duff(togglers, function (toggler) {
                    attributeManager.toggle(toggler, direction);
                });
                return attributeManager;
            },
            change: function (attributeManager, remove, add_) {
                var add = gapSplit(add_);
                return this.add(this.remove(attributeManager, remove), add);
            }
        },
        unmarkChange = function (fn) {
            return function (manager, idx) {
                var returnValue = fn(manager, idx);
                if (manager.attributesChanging) {
                    manager[DISPATCH_EVENT]('attributeChange');
                }
                return returnValue;
            };
        },
        queueAttributeValues = function (attribute_, second_, third_, api, domHappy_, merge, passedTrigger_) {
            var attribute = attribute_ === CLASS ? CLASSNAME : attribute_,
                domHappy = domHappy_ || unCamelCase,
                unCamelCased = api.preventUnCamel ? attribute : domHappy(attribute),
                withClass = unCamelCased === CLASSNAME || unCamelCased === CLASS__NAME,
                trigger = (withClass ? (api = propertyApi) && (unCamelCased = CLASSNAME) && CLASSNAME : passedTrigger_) || unCamelCased;
            return function (manager, idx) {
                var generated, el = manager.element(),
                    read = api.read(el, unCamelCased),
                    returnValue = manager,
                    attributeManager = ensureManager(manager, unCamelCased, read);
                if (merge === 'get') {
                    if (!idx) {
                        returnValue = read;
                    }
                    return returnValue;
                }
                attributeManager.api = api;
                intendedObject(second_, third_, function (second, third) {
                    var currentMerge = merge || (third === BOOLEAN_TRUE ? 'add' : (third === BOOLEAN_FALSE ? 'remove' : 'toggle'));
                    attributeValuesHash[currentMerge](attributeManager, gapSplit(second), third, read);
                });
                if (attributeManager._changeCounter) {
                    if (attributeManager.isRemoving) {
                        attributeManager.isRemoving = BOOLEAN_FALSE;
                        api.remove(el, unCamelCased);
                    } else {
                        generated = attributeManager.generate(SPACE);
                        api.write(el, unCamelCased, generated);
                    }
                }
                if (generated !== read && manager.customListeners) {
                    manager.attributesChanging = BOOLEAN_TRUE;
                    manager[DISPATCH_EVENT]('attributeChange:' + trigger, {
                        previous: read,
                        current: generated
                    });
                }
            };
        },
        domAttributeManipulatorExtended = function (proc, innerHandler, api) {
            return function (normalize) {
                return function (first, second, third, alternateApi, domHappy, trigger) {
                    return normalize(proc(first, second, third, alternateApi || api, domHappy, innerHandler, trigger), this);
                };
            };
        },
        hasAttributeValue = function (property, values_, third, api) {
            var values = gapSplit(values_);
            return function (manager) {
                var el = manager.element(),
                    attributeManager = manager.get(property),
                    read = api.read(el, property);
                attributeManager.ensure(read, SPACE);
                return find(values, function (value) {
                    var stringInstance = attributeManager.get(ID, value);
                    return stringInstance ? !stringInstance.isValid() : BOOLEAN_TRUE;
                });
            };
        },
        setValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'set', attributeApi)),
        addValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'add', attributeApi)),
        removeValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'remove', attributeApi)),
        toggleValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'toggle', attributeApi)),
        changeValue = unmarkChange(domAttributeManipulatorExtended(queueAttributeValues, 'change', attributeApi)),
        getValue = domAttributeManipulatorExtended(queueAttributeValues, 'get', attributeApi),
        hasValue = domAttributeManipulatorExtended(hasAttributeValue, 'has', attributeApi),
        getSetter = function (proc, givenApi, keyprocess) {
            return function (understandsContext) {
                return function (first, second_, api_) {
                    var reverseCache, context = this,
                        firstIsString = isString(first),
                        api = firstIsString ? api_ : second_,
                        second = firstIsString ? second_ : NULL,
                        usingApi = givenApi || api;
                    if (firstIsString && second === UNDEFINED) {
                        context = context.index(0);
                        return usingApi.read(context.element(), keyprocess(first));
                    } else {
                        reverseCache = {};
                        context.each(unmarkChange(intendedIteration(first, second, function (first, second, manager, idx) {
                            var processor = reverseCache[first] = reverseCache[first] || proc(first, second, NULL, usingApi, keyprocess, isObject(second) ? NULL : 'set');
                            processor(manager, idx);
                        })));
                        return context;
                    }
                };
            };
        },
        attrApi = getSetter(queueAttributeValues, attributeApi, unCamelCase),
        dataApi = getSetter(queueAttributeValues, attributeApi, makeDataKey),
        propApi = getSetter(queueAttributeValues, propertyApi, unCamelCase),
        domFirst = function (handler, context) {
            var first = context.index(0);
            return first && handler(first, 0);
        },
        domIterates = function (handler, context) {
            context.each(handler);
            return context;
        },
        returnsFirst = function (fn, context) {
            return fn(context.index(), 0);
        },
        domContextFind = function (fn, context) {
            return !context.find(fn);
        },
        makeValueTarget = function (target, passed_, api, domHappy) {
            var passed = passed_ || target;
            return _.foldl(gapSplit('add remove toggle change has set'), function (memo, method_) {
                var method = method_ + 'Value';
                memo[method_ + upCase(target)] = function (one, two) {
                    return this[method](passed, one, two, api, domHappy, target);
                };
                return memo;
            }, {});
        },
        markCustom = function (manager, forceCustom) {
            var isCustomValue = readAttribute(manager.element(), CUSTOM_KEY),
                isCustom = manager.isCustom = forceCustom || !!isCustomValue;
            (isCustom ? writeAttribute : removeAttribute)(manager.element(), CUSTOM_KEY, isCustomValue || BOOLEAN_TRUE);
            if (isCustomValue) {
                manager.registeredAs = isCustomValue;
            }
        },
        markElement = function (manager) {
            var element;
            manager.isElement = BOOLEAN_FALSE;
            manager.isIframe = BOOLEAN_FALSE;
            manager.tagName = BOOLEAN_FALSE;
            if (manager.isWindow) {
                // manager.windowReady = BOOLEAN_TRUE;
                return;
            }
            element = manager.element();
            if ((manager.isElement = isElement(element))) {
                manager.tagName = tag(element);
                testIframe(manager);
                markCustom(manager);
            }
        },
        markGlobal = function (manager) {
            var element = manager.element();
            manager.isWindow = isWindow(element);
            if (!manager.isWindow || !manager.owner) {
                return;
            }
            manager.isAccessable = !!wraptry(function () {
                return element[DOCUMENT];
            });
            manager.isTop = !!(window && element === window.top);
            manager.setAddress();
            if (!manager.isAccessable) {
                return;
            }
            if (manager.isTop) {
                // tests do not fail on top window
                return;
            }
            // more accessable tests
            manager.isAccessable = manager.sameOrigin();
        },
        test = function (manager, owner) {
            var el = manager.element();
            markGlobal(manager);
            markElement(manager);
            manager.isDocument = BOOLEAN_FALSE;
            manager.isFragment = BOOLEAN_FALSE;
            manager[IS_ATTACHED] = BOOLEAN_TRUE;
            if (manager.isWindow) {
                return;
            }
            manager.isDocument = isDocument(el);
            manager.isFragment = isFragment(el);
            if (manager.isDocument || manager.isFragment) {
                return;
            }
            manager[IS_ATTACHED] = isAttached(manager, owner);
        },
        registeredElementName = function (name, manager) {
            return ELEMENT + HYPHEN + manager.documentId + HYPHEN + name;
        },
        query = function (str, ctx) {
            return toArray((ctx || doc_).querySelectorAll(str));
        },
        DOMM_SETUP = factories.DOMM_SETUP = function (doc_) {
            var registeredElements, setup, query, wrapped, manager = returnsManager(doc_, BOOLEAN_TRUE);
            if (manager.documentId) {
                return manager.query;
            }
            registeredElements = clone(validTagsNamesHash);
            setup = function (e) {
                manager.DOMContentLoadedEvent = e;
                manager.isReady = BOOLEAN_TRUE;
            };
            query = function (sel, ctx) {
                var context = ctx || manager;
                return DOMM(sel, context, BOOLEAN_FALSE, manager === context, manager);
            };
            manager.documentId = uniqueId('doc');
            wrapped = extend(wrap({
                makeTree: makeTree,
                createElement: createElement,
                createElements: createElements,
                createDocumentFragment: createDocumentFragment,
                registeredElementName: registeredElementName,
                fragment: fragment,
                query: query,
                $: query,
                returnsManager: returnsManager
            }, function (handler) {
                return function (one) {
                    return handler(one, manager);
                };
            }), {
                data: factories.Associator(),
                documentId: manager.documentId,
                manager: manager,
                constructor: DOMM[CONSTRUCTOR],
                registeredElements: registeredElements,
                templateSettings: {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                },
                compile: function (id, string) {
                    return compile(id, string, manager);
                },
                collectTemplates: function () {
                    query('script[id]').each(function (script) {
                        compile(script.element().id, script.html(), manager);
                        script.remove();
                    });
                },
                registerElement: function (name, options_) {
                    var generatedTagName, wasDefined, options = options_ || {},
                        lastKey = [],
                        prototype = options.prototype,
                        creation = options.onCreate || noop,
                        destruction = options.onDestroy,
                        newName = manager.registeredElementName(name),
                        directiveCreation = function (instance, name, directive) {
                            var extendResult = prototype && extend(instance, prototype);
                            var newDirective = directive || {};
                            var createResult = creation(instance, newDirective);
                            if (destruction) {
                                instance.on('destroy', destruction);
                            }
                            return newDirective;
                        },
                        directiveDestruction = function (instance, name, directive) {
                            each(prototype, function (value, key) {
                                if (instance[key] === value) {
                                    delete instance[key];
                                }
                            });
                            if (destruction) {
                                instance.dispatchEvent('destroy');
                                instance.off('destroy', destruction);
                            }
                        };
                    if (validTagsNamesHash[name]) {
                        exception({
                            message: 'element names must not be used natively by browsers'
                        });
                    } else {
                        wasDefined = (options.extends && !validTagsNamesHash[options.extends] ? app.extendDirective(manager.registeredElementName(options.extends), newName, directiveCreation, directiveDestruction) : app.defineDirective(newName, directiveCreation, directiveDestruction)) || exception({
                            message: 'element names can only be registered once per document'
                        });
                        registeredElements[name] = options.extends ? registeredElements[options.extends] : DIV;
                    }
                }
            });
            extend(manager, wrapped);
            extend(query, wrapped);
            if (manager.isReady === UNDEFINED) {
                manager.isReady = BOOLEAN_FALSE;
                if (manager.element().readyState === 'complete') {
                    setup({});
                } else {
                    manager.on('DOMContentLoaded', setup);
                }
            }
            return query;
        },
        styleManipulator = function (one, two) {
            var manager, styles;
            if (isString(one) && two === UNDEFINED) {
                return (manager = this.index(0)) && (styles = manager.getStyle()) && (prefix = _.find(prefixes[camelCase(one)], function (prefix) {
                    return styles[prefix + unCameled] !== UNDEFINED;
                })) && styles[prefix + unCameled];
            } else {
                if (this.length()) {
                    this.each(unmarkChange(intendedIteration(one, two, applyStyle)));
                }
                return this;
            }
        },
        getValueCurried = getValue(returnsFirst),
        setValueCurried = setValue(domIterates),
        classApi = makeValueTarget('class', 'className', propertyApi),
        manager_query = function (selector) {
            var target = this.element();
            return $(query(selector, target), target);
        },
        isAppendable = function (els) {
            return isElement(els) || isFragment(els) || els.isValidDomManager;
        },
        iframeChangeHandler = function () {
            testIframe(this);
        },
        DomManager = factories.Events.extend(DOM_MANAGER_STRING, extend(classApi, {
            constructor: function (el, hash, owner_) {
                var owner = owner_,
                    manager = this;
                manager[TARGET] = el;
                test(manager, owner);
                if (manager.isElement || manager.isFragment) {
                    hash[DOM_MANAGER_STRING] = manager;
                    owner = ensure(el.ownerDocument, BOOLEAN_TRUE);
                } else {
                    if (manager.isDocument) {
                        owner = manager;
                    } else {
                        hash[DOM_MANAGER_STRING] = manager;
                    }
                }
                manager.owner = owner || BOOLEAN_FALSE;
                if (manager.isIframe) {
                    manager.on('attributeChange:src detach attach', iframeChangeHandler);
                }
                if (manager.isWindow) {
                    markGlobal(manager);
                }
                manager.registerAs(manager.registeredAs);
                return manager;
            },
            sameOrigin: function () {
                var parsedReference, manager = this,
                    element = manager.element(),
                    windo = manager.owner.window(),
                    windoElement = windo.element();
                if (windo === manager) {
                    return BOOLEAN_TRUE;
                }
                if (manager.isAccessable) {
                    parsedReference = reference(element.location.href);
                    if (!parsedReference && manager.iframe) {
                        parsedReference = reference(manager.iframe.src());
                    }
                    return !parsedReference || parsedReference === reference(windoElement.location.href);
                }
                return BOOLEAN_FALSE;
                // return !!(windo === this || (this.isAccessable && (parsedReference = reference(element.location.href) || reference(windoElement.location.href)) && parsedReference === reference(windoElement.location.href)));
            },
            $: manager_query,
            query: manager_query,
            getValue: getValueCurried,
            setValue: setValueCurried,
            hasValue: hasValue(domContextFind),
            addValue: addValue(domIterates),
            removeValue: removeValue(domIterates),
            toggleValue: toggleValue(domIterates),
            changeValue: changeValue(domIterates),
            on: addEventListener,
            addEventListener: addEventListener,
            once: addEventListenerOnce,
            off: removeEventListener,
            removeEventListener: removeEventListener,
            isValidDomManager: BOOLEAN_TRUE,
            appendChild: appendChild,
            append: appendChild,
            getAttribute: getValueCurried,
            setAttribute: setValueCurried,
            removeAttribute: attributeParody('remove'),
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            html: innardManipulator(INNER_HTML),
            text: innardManipulator(INNER_TEXT),
            style: styleManipulator,
            css: styleManipulator,
            parent: (function () {
                var finder = function (manager, fn, original) {
                        var parentElement, rets, found, parentManager = manager,
                            next = original;
                        while (parentManager && parentManager.element() && !found) {
                            parentElement = parentManager.element();
                            rets = fn(parentManager, original, next);
                            parentManager = rets[0] && parentManager.owner.returnsManager(rets[0]);
                            found = rets[1];
                            next = rets[2];
                        }
                        return parentManager;
                    },
                    number = function (parent, original, next) {
                        next -= 1;
                        if (next < 0 || !isFinite(next) || isNaN(next)) {
                            next = 0;
                        }
                        return [parent, !next, next];
                    },
                    string = function (parent, original, next) {
                        return [parent, matches(parent, original)];
                    },
                    speshal = {
                        document: function (parent_, original, next) {
                            if (parent_.isDocument) {
                                return [parent_, BOOLEAN_TRUE];
                            } else {
                                if (parent_.isElement || parent_.isFragment) {
                                    return [parent.element()[PARENT_NODE], BOOLEAN_FALSE];
                                } else {
                                    return [parent.owner.element(), BOOLEAN_TRUE];
                                }
                            }
                        },
                        window: function (parent_, original, next) {
                            var element = parent_.element();
                            var parent = element[DEFAULT_VIEW] || element[PARENT_NODE];
                            return [element, isWindow(element)];
                        },
                        iframe: function (parent_, original, next) {
                            var found, element, parent = parent_;
                            if (parent.isWindow) {
                                if (parent.isTop) {
                                    return [NULL, BOOLEAN_TRUE];
                                } else {
                                    if (parent.iframe) {
                                        return [parent.iframe, BOOLEAN_TRUE];
                                    } else {
                                        found = wraptry(function () {
                                            var element = win.frameElement;
                                            if (element) {
                                                return BOOLEAN_TRUE;
                                            }
                                            return BOOLEAN_FALSE;
                                        }, function () {
                                            return BOOLEAN_FALSE;
                                        });
                                    }
                                }
                            } else {
                                element = parent.element();
                                element = element[DEFAULT_VIEW] || element[PARENT_NODE];
                            }
                            return [element, found];
                        }
                    };
                return function (original) {
                    var iterator, manager = this,
                        data = [],
                        doDefault = BOOLEAN_FALSE;
                    if (isNumber(original)) {
                        iterator = number;
                    } else {
                        if (isString(original)) {
                            iterator = speshal[original] || string;
                        } else {
                            doDefault = original ? BOOLEAN_TRUE : doDefault;
                        }
                    }
                    if (doDefault) {
                        return finder(manager, function (el) {
                            return [el, original(el)];
                        });
                    } else {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        return finder(manager, iterator, original);
                    }
                };
            }()),
            setAddress: function (address) {
                var manager = this;
                address = manager.address = address || manager.address || uuid();
                return address;
            },
            emit: function (message, referrer_, handler) {
                var windo = this.window(),
                    element = windo.element();
                if (windo.isAccessable) {
                    handler({
                        data: message,
                        srcElement: element,
                        timeStamp: _.now()
                    });
                } else {
                    wraptry(function () {
                        if (!referrer_) {
                            throw new Error('missing referrer: ' + windo.address);
                        }
                        element.postMessage(message, referrer_);
                    }, console.error);
                }
            },
            insertAt: function (els, index) {
                var manager = this,
                    owner = manager.owner,
                    // normalize into a fragment
                    fragmentManager = isAppendable(els) ? owner.returnsManager(els) : DOMM(els).fragment(),
                    fragment = fragmentManager.element(),
                    children = index == NULL ? NULL : manager.children(),
                    child = children && children.index(index) || NULL,
                    element = child && child.element() || NULL,
                    managerElement = manager && manager.element(),
                    fragmentChildren = (fragmentManager.isElement && fragmentManager.customListeners ? [fragment] : []).concat(query(CUSTOM_ATTRIBUTE, fragment)),
                    detachNotify = dispatchDetached(fragmentChildren, owner),
                    returnValue = managerElement && managerElement.insertBefore(fragment, element),
                    notify = isAttached(managerElement, owner) && dispatchAttached(fragmentChildren, owner);
                return returnValue;
            },
            window: function () {
                var manager = this;
                if (manager.isWindow) {
                    // yay we're here!
                    return manager;
                }
                if (manager.isDocument) {
                    // it's a document, so return the manager relative to the inside
                    return manager.returnsManager(manager.element().defaultView);
                }
                if (manager.isIframe) {
                    // it's an iframe, so return the manager relative to the outside
                    return manager.owner.returnsManager(manager.element().contentWindow);
                }
                // it's an element so go up
                return manager.owner.window();
            },
            element: function () {
                return this[TARGET];
            },
            length: function () {
                return 1;
            },
            registerAs: function () {
                var newName, oldName, manager = this,
                    registeredAs = manager.registeredAs;
                if (manager.isCustom && registeredAs !== manager._lastCustom) {
                    oldName = manager.owner.registeredElementName(manager._lastCustom);
                    manager.directiveDestruction(oldName);
                    manager._lastCustom = registeredAs;
                    newName = manager.owner.registeredElementName(registeredAs);
                    manager.directive(newName);
                }
            },
            wrap: function (list) {
                return this.owner.query(list || this);
            },
            collectChildren: function () {
                return collectChildren(this.element());
            },
            children: function (eq, globalmemo) {
                var filter = createDomFilter(eq),
                    manager = this,
                    children = manager.collectChildren(),
                    result = foldl(children, function (memo, child, idx, children) {
                        if (filter(child, idx, children)) {
                            memo.push(manager.owner.returnsManager(child));
                        }
                        return memo;
                    }, globalmemo || []);
                return globalmemo ? result : manager.wrap(result);
            },
            hide: function () {
                return this.applyStyle('display', 'none');
            },
            show: function () {
                return this.applyStyle('display', 'block');
            },
            resetEvents: function () {
                var manager = this;
                manager.stopListening();
                factories.Events[CONSTRUCTOR][PROTOTYPE].resetEvents.call(manager);
                return manager;
            },
            applyStyle: function (key, value) {
                applyStyle(key, value, this);
                return this;
            },
            getStyle: function (eq) {
                var returnValue = {},
                    manager = this,
                    first = manager.element();
                if (first && manager.isElement) {
                    returnValue = getComputed(first, manager.context);
                }
                return returnValue;
            },
            remove: function (fragment) {
                var el, parent, manager = this,
                    cachedRemoving = manager.isRemoving || BOOLEAN_FALSE;
                if (!cachedRemoving && (el = manager.element()) && (parent = el[PARENT_NODE])) {
                    manager.isRemoving = BOOLEAN_TRUE;
                    if (fragment) {
                        fragment.appendChild(el);
                    } else {
                        parent.removeChild(el);
                    }
                    dispatchDetached([el], manager.owner);
                    manager.isRemoving = cachedRemoving;
                }
                return manager;
            },
            destroy: function () {
                var customName, manager = this,
                    registeredAs = manager.registeredAs;
                manager.remove();
                if (registeredAs) {
                    customName = manager.owner.registeredElementName(registeredAs);
                    manager.directiveDestruction(customName);
                }
                // destroy events
                manager.resetEvents();
                // remove from global hash
                manager.owner.data.remove(manager.element());
                return manager;
            },
            createEvent: function (original, type, opts) {
                return DomEvent(original, {
                    target: this.target,
                    origin: this,
                    capturing: toBoolean(type.split(COLON)[0]),
                    arg2: opts
                });
            },
            index: function () {
                return this;
            },
            each: function (fn) {
                var wrapped = [this];
                fn(this, 0, wrapped);
                return wrapped;
            },
            find: function (fn) {
                return fn(this, 0, [this]) ? this : UNDEFINED;
            },
            get: function (where) {
                var events = this,
                    attrs = events.directive(ATTRIBUTES),
                    found = attrs[where] = attrs[where] || StringManager();
                return found;
            },
            // revisit this
            queueHandler: function (evnt, handler, list) {
                var selectorsMatch, ctx, domManager = this,
                    originalTarget = evnt.currentTarget,
                    el = domManager.element(),
                    mainHandler = handler.mainHandler;
                domManager.stashed = originalTarget;
                if (mainHandler.currentEvent) {
                    // cancel this event because this stack has already been called
                    exception({
                        message: 'queue prevented: this element is already being dispatched with the same event'
                    });
                    return;
                }
                mainHandler.currentEvent = handler;
                if (!handler) {
                    return;
                }
                if (handler.selector) {
                    ctx = findMatch(el, evnt.target, handler.selector);
                    if (ctx) {
                        e.currentTarget = ctx;
                    } else {
                        mainHandler.currentEvent = NULL;
                        return;
                    }
                }
                return BOOLEAN_TRUE;
            },
            tag: function (str) {
                return tag(this.element(), str);
            },
            rect: function () {
                return clientRect(this.element());
            },
            box: function (context) {
                return box(this.element(), context);
            },
            flow: function (context) {
                return flow(this.element(), context);
            },
            dispatchEvent: cannotTrust(function (name, e, capturing_) {
                return eventDispatcher(this, name, e, capturing_);
            }),
            unQueueHandler: function (e, handler, list) {
                var domManager = this;
                e.currentTarget = domManager.stashed;
                domManager.stashed = NULL;
                handler.mainHandler.currentEvent = NULL;
            },
            toJSON: function () {
                var children, obj, manager = this,
                    node = manager.element();
                if (!canBeProcessed(node)) {
                    return node;
                }
                children = manager.children().toJSON();
                obj = {
                    tag: tag(node)
                };
                if (children[LENGTH]) {
                    obj.children = children;
                }
                if (node[INNER_TEXT]) {
                    obj[INNER_TEXT] = node[INNER_TEXT];
                }
                duff(node[ATTRIBUTES], function (attr) {
                    obj[camelCase(attr[LOCAL_NAME])] = attr.nodeValue;
                });
                return obj;
            }
        }, wrap({
            id: BOOLEAN_FALSE,
            src: BOOLEAN_FALSE,
            checked: BOOLEAN_FALSE,
            disabled: BOOLEAN_FALSE,
            classes: 'className'
        }, function (attr, api) {
            if (!attr) {
                attr = api;
            }
            return function (string) {
                var item, manager = this;
                if (string !== UNDEFINED) {
                    return manager.attr(attr, string);
                }
                return manager.element()[attr];
            };
        }), wrap(videoDirectEvents, triggerEventWrapperManager), wrap(directEvents, function (attr) {
            return triggerEventWrapperManager(attr);
        })), BOOLEAN_TRUE),
        addEventQueue = function (obj) {
            var mainHandler = obj.mainHandler,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (selector) {
                    obj.list.splice(mainHandler[DELEGATE_COUNT]++, 0, obj);
                } else {
                    obj.list.push(obj);
                }
            } else {
                mainHandler[ADD_QUEUE].push(obj);
            }
        },
        removeEventQueue = function (obj, idx) {
            var gah, mainHandler = obj.mainHandler,
                list = obj.list,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (!obj.isDestroyed) {
                    obj.isDestroyed = BOOLEAN_TRUE;
                    idx = idx === UNDEFINED ? list.indexOf(obj) : idx;
                    if (selector) {
                        mainHandler[DELEGATE_COUNT]--;
                    }
                    mainHandler.events.detach(obj);
                }
            } else {
                if (!obj.disabled) {
                    mainHandler[REMOVE_QUEUE].push(obj);
                }
            }
            obj.disabled = BOOLEAN_TRUE;
        },
        _removeEventListener = function (manager, name, namespace, selector, handler, capture_) {
            var capture = !!capture_,
                directive = manager.directive(EVENTS),
                removeFromList = function (list, name) {
                    return list && list.duffRight(function (obj) {
                        if ((!name || name === obj[NAME]) && (!handler || obj.handler === handler) && (!namespace || obj.namespace === namespace) && (!selector || obj.selector === selector)) {
                            removeEventQueue(obj);
                        }
                    });
                };
            return name ? removeFromList(directive[HANDLERS][capture + COLON + name], name) : each(directive[HANDLERS], removeFromList);
        },
        /**
         * @class DOMM
         * @augments Model
         * @augments Collection
         */
        IS_TRUSTED = 'isTrusted',
        fixHooks = {
            // Includes some event props shared by KeyEvent and MouseEvent
            props: gapSplit("data altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which"),
            fixedHooks: {},
            keyHooks: {
                props: gapSplit("char charCode key keyCode"),
                filter: function (evnt, original) {
                    var charCode;
                    // Add which for key evnts
                    if (evnt.which == NULL) {
                        charCode = original.charCode;
                        evnt.which = charCode != NULL ? charCode : original.keyCode;
                    }
                    return evnt;
                }
            },
            forceHooks: {
                props: [],
                filter: function (evnt, original) {
                    evnt.value = ((original.force || original.webkitForce) / 3) || 0;
                    return evnt;
                }
            },
            motionHooks: {
                props: [],
                filter: function () {
                    this.watchingMotion = BOOLEAN_TRUE;
                }
            },
            mouseHooks: {
                props: gapSplit("button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement"),
                filter: function (evnt, original) {
                    var eventDoc, doc, body,
                        button = original.button;
                    // Calculate pageX/Y if missing and clientX/Y available
                    if (evnt.pageX == NULL && original.clientX != NULL) {
                        evntDoc = evnt.target.ownerDocument || doc;
                        doc = evntDoc.documentElement;
                        body = evntDoc[BODY];
                        evnt.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                        evnt.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                    }
                    evnt.movementX = original.movementX || 0;
                    evnt.movementY = original.movementY || 0;
                    evnt.layerX = original.layerX || 0;
                    evnt.layerY = original.layerY || 0;
                    evnt.x = original.x || 0;
                    evnt.y = original.y || 0;
                    // Add which for click: 1 === left; 2 === middle; 3 === right
                    // Note: button is not normalized, so don't use it
                    if (!evnt.which && button !== UNDEFINED) {
                        evnt.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
                    }
                    return evnt;
                }
            },
            make: (function () {
                var cached = {};
                return function (evnt, originalEvent, data) {
                    var acc, acc_, doc, target, val, i, prop, copy, type = originalEvent.type,
                        // Create a writable copy of the event object and normalize some properties
                        fixHook = fixHooks.fixedHooks[type];
                    if (!fixHook) {
                        fixHooks.fixedHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : rforceEvent.test(type) ? this.forceHooks : motionMorph.test(type) ? this.motionHooks : {};
                        // rfocusMorph
                        // motionMorph
                    }
                    copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
                    i = copy[LENGTH];
                    while (i--) {
                        prop = copy[i];
                        val = originalEvent[prop];
                        if (val != NULL) {
                            evnt[prop] = val;
                        }
                    }
                    evnt.originalType = originalEvent.type;
                    // Support: Cordova 2.5 (WebKit) (#13255)
                    // All events should have a target; Cordova deviceready doesn't
                    // ie also does not have a target... so use current target
                    target = evnt.target || (evnt.view ? evnt.view.event.currentTarget : event && event.currentTarget) || evnt.delegateTarget;
                    if (!target) {
                        target = evnt.target = doc;
                    }
                    // Support: Safari 6.0+, Chrome<28
                    // Target should not be a text node (#504, #13143)
                    if (target[NODE_TYPE] === 3) {
                        evnt.target = target[PARENT_NODE];
                    }
                    if (isFunction(fixHook.filter)) {
                        fixHook.filter(evnt, originalEvent);
                    }
                    evnt.type = distilledEventName[originalEvent.type] || originalEvent.type;
                    evnt.set(originalEvent.data || data || EMPTY_STRING);
                    evnt.isImmediatePropagationStopped = evnt.isPropagationStopped = evnt.isDefaultPrevented = BOOLEAN_FALSE;
                    // special
                    if (evnt.type === 'fullscreenchange') {
                        doc = evnt.target;
                        if (isWindow(doc)) {
                            doc = doc[DOCUMENT];
                        } else {
                            while (doc && !isDocument(doc) && doc[PARENT_NODE]) {
                                doc = doc[PARENT_NODE];
                            }
                        }
                        evnt.fullscreenDocument = doc;
                        if (isDocument(doc)) {
                            evnt.isFullScreen = (doc.fullScreen || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.fullscreenElement) ? BOOLEAN_TRUE : BOOLEAN_FALSE;
                        }
                    }
                    evnt[IS_TRUSTED] = _.has(originalEvent, IS_TRUSTED) ? originalEvent[IS_TRUSTED] : !DO_NOT_TRUST;
                    if (this.watchingMotion) {
                        acc = original.acceleration;
                        if (!acc) {
                            acc_ = original.accelerationIncludingGravity;
                            acc = {
                                x: acc_.x - 9.81,
                                y: acc_.y - 9.81,
                                z: acc_.z - 9.81
                            };
                        }
                        if (acc) {
                            cached.x = acc.x;
                            cached.y = acc.y;
                            cached.z = acc.z;
                            cached.interval = original.interval;
                            cached.rotationRate = original.rotationRate;
                        }
                        if (cached.x != NULL) {
                            evnt.motionX = cached.x;
                            evnt.motionY = cached.y;
                            evnt.motionZ = cached.z;
                            evnt.interval = cached.interval;
                            evnt.rotationRate = cached.rotationRate;
                        }
                        if (original.alpha != NULL) {
                            cached.alpha = original.alpha;
                            cached.beta = original.beta;
                            cached.gamma = original.gamma;
                            cached.absolute = original.absolute;
                        }
                        if (cached.alpha != NULL) {
                            evnt.alpha = cached.alpha;
                            evnt.beta = cached.beta;
                            evnt.gamma = cached.gamma;
                            evnt.absolute = cached.absolute;
                        }
                    }
                    return evnt;
                };
            }())
        },
        DomEvent = factories.ObjectEvent.extend('DomEvent', {
            constructor: function (evnt, opts) {
                var e = this;
                if (DomEvent.isInstance(evnt)) {
                    return evnt;
                }
                e.origin = opts.origin;
                e.originalEvent = evnt;
                e.delegateTarget = opts.target;
                fixHooks.make(e, evnt, opts.arg2);
                e.capturing = opts.capturing === UNDEFINED ? isCapturing(e) : opts.capturing;
                return e;
            },
            preventDefault: function () {
                var e = this.originalEvent;
                this.isDefaultPrevented = BOOLEAN_TRUE;
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                this.isPropagationStopped = BOOLEAN_TRUE;
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = BOOLEAN_TRUE;
                if (e && e.stopImmediatePropagation) {
                    e.stopImmediatePropagation();
                }
                this.stopPropagation();
            }
        }, BOOLEAN_TRUE),
        eq = _.eq,
        objectMatches = _.matches,
        createDomFilter = function (filtr) {
            return isFunction(filtr) ? filtr : (isString(filtr) ? (filterExpressions[filtr] || function (item) {
                return matches(item, filtr);
            }) : (isNumber(filtr) ? function (el, idx) {
                return idx === filtr;
            } : (isObject(filtr) ? objectMatches(filtr) : function () {
                return BOOLEAN_TRUE;
            })));
        },
        unwrapsOnLoop = function (fn) {
            return function (manager, index, list) {
                return fn(manager.element(), index, list);
            };
        },
        dataReconstructor = function (list, fn) {
            return foldl(list, function (memo, arg1, arg2, arg3) {
                if (fn(arg1, arg2, arg3)) {
                    memo.push(arg1);
                }
                return memo;
            }, []);
        },
        domFilter = function (items, filtr) {
            var filter = createDomFilter(filtr);
            return dataReconstructor(items, unwrapsOnLoop(filter));
        },
        dimensionFinder = function (element, doc, win) {
            return function (num) {
                var ret, manager = this[INDEX](num);
                if (manager.isElement) {
                    ret = clientRect(manager)[element];
                } else {
                    if (manager.isDocument && manager.element()[BODY]) {
                        ret = manager.element()[BODY][doc];
                    } else {
                        if (manager.isWindow) {
                            ret = manager.element()[win];
                        }
                    }
                }
                return ret || 0;
            };
        },
        dommFind = attachPrevious(function (str) {
            var passedString = isString(str),
                matchers = [],
                domm = this,
                push = function (el) {
                    matchers.push(domm.context.owner.returnsManager(el));
                };
            return duff(domm.unwrap(), function (manager) {
                if (passedString) {
                    duff(query(str, manager.element()), push);
                } else {
                    push(manager);
                }
            }) && matchers;
        }),
        canBeProcessed = function (item) {
            return isWindow(item) || isElement(item) || isDocument(item) || isFragment(item);
        },
        collectChildren = function (element) {
            return element.children || element.childNodes;
        },
        appendChildDOMM = function (els, clone) {
            return this.insertAt(els, NULL, clone);
        },
        prependChildDOMM = function (els, clone) {
            return this.insertAt(els, 0, clone);
        },
        returnsManager = function (element, owner) {
            return element && !isWindow(element) && element.isValidDomManager ? element : ensure(element, owner);
        },
        exportResult = _.exports({
            covers: covers,
            center: center,
            closer: closer,
            distance: distance,
            // query: query,
            escape: escape,
            unescape: unescape,
            // css: css,
            box: box,
            isElement: isElement,
            isWindow: isWindow,
            isDocument: isDocument,
            isFragment: isFragment,
            unitToNumber: unitToNumber,
            numberToUnit: numberToUnit
        }),
        // removeChild = eachProc(),
        setupDomContentLoaded = function (handler, documentManager) {
            var bound = bind(handler, documentManager);
            if (documentManager.isReady) {
                bound($, documentManager.DOMContentLoadedEvent);
            } else {
                documentManager.on('DOMContentLoaded', function (e) {
                    bound($, e);
                });
            }
            return documentManager;
        },
        applyToEach = function (method) {
            return function (one, two, three, four, five) {
                return this.each(function (manager) {
                    manager[method](one, two, three, four, five);
                });
            };
        },
        allEachMethods = gapSplit('show hide style remove on off once addEventListener removeEventListener dispatchEvent').concat(allDirectMethods),
        firstMethods = gapSplit('tag element rect box flow'),
        applyToFirst = function (method) {
            var shouldBeContext = method !== 'tag';
            return function (one, two) {
                var element = this.index(one);
                return element && element[method](shouldBeContext ? this.context : two);
            };
        },
        readMethods = gapSplit('isWindow isElement isDocument isFragment'),
        applyToTarget = function (property) {
            return function (one) {
                var element = this.index(one);
                return element && element[property];
            };
        },
        DOMM = factories.Collection.extend('DOMM', extend(makeValueTarget('class', 'className', propertyApi, BOOLEAN_TRUE), {
            /**
             * @func
             * @name DOMM#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMM instance
             * @returns {DOMM} instance
             */
            constructor: function (str, ctx, isValid, validContext, documentContext) {
                var isArrayResult, els = str,
                    dom = this,
                    context = dom.context = validContext ? ctx.index(0) : documentContext, // returnsManager(ctx || win[DOCUMENT], documentContext),
                    unwrapped = context.element();
                if (isFunction(str)) {
                    if (isDocument(unwrapped)) {
                        return setupDomContentLoaded(str, documentContext).wrap();
                    }
                } else {
                    if (!isValid) {
                        if (isString(str)) {
                            if (str[0] === '<') {
                                els = makeTree(str, documentContext);
                            } else {
                                els = map(query(str, unwrapped), documentContext.returnsManager, documentContext);
                            }
                        } else {
                            els = str;
                            if (DomManager.isInstance(els)) {
                                els = [els];
                            } else {
                                if (canBeProcessed(els)) {
                                    els = [documentContext.returnsManager(els)];
                                } else {
                                    els = els && map(els, documentContext.returnsManager, documentContext);
                                }
                            }
                        }
                    }
                    dom.swap(els);
                }
                return dom;
            },
            setValue: setValue(domIterates),
            hasValue: hasValue(domContextFind),
            addValue: addValue(domIterates),
            removeValue: removeValue(domIterates),
            toggleValue: toggleValue(domIterates),
            changeValue: changeValue(domIterates),
            push: function (el) {
                this.unwrap().push(this.context.owner.returnsManager(el));
            },
            elements: function () {
                // to array of DOMManagers
                return map(this.unwrap(), function (manager) {
                    // to element
                    return manager.element();
                });
            },
            /**
             * @func
             * @name DOMM#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            /**
             * @func
             * @name DOMM#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            fragment: function (els) {
                return this.context.returnsManager(fragment(els || this.unwrap(), this.context));
            },
            /**
             * @func
             * @name DOMM#filter
             * @param {String|Function|Object} filtr - filter variable that will filter by matching the object that is passed in, or by selector if it is a string, or simply with a custom function
             * @returns {DOMM} new DOMM instance object
             */
            filter: attachPrevious(function (filter) {
                return domFilter(this.unwrap(), filter);
            }),
            /**
             * @func
             * @name DOMM#find
             * @param {String} str - string to use query to find against
             * @returns {DOMM} matching elements
             */
            // find: dommFind,
            $: dommFind,
            /**
             * @func
             * @name DOMM#children
             * @param {Number} [eq] - index of the children to gather. If none is provided, then all children will be added
             * @returns {DOMM} all / matching children
             */
            children: attachPrevious(function (eq) {
                return foldl(this.unwrap(), function (memo, manager) {
                    return manager.children(eq, memo);
                }, []);
            }),
            /**
             * @func
             * @name DOMM#offAll
             * @returns {DOMM} instance
             */
            // resetEvents: applyToEach('resetEvents'),
            /**
             * @name DOMM#off
             * @param {String|Function} type - event type
             * @param {Function} handler - specific event handler to be removed
             * @returns {DOMM} instnace
             */
            // on: applyToEach('addEventListener'),
            // off: applyToEach('removeEventListener'),
            // once: applyToEach('once'),
            // addEventListener: applyToEach('addEventListener'),
            // removeEventListener: applyToEach('removeEventListener'),
            // dispatchEvent: applyToEach('dispatchEvent'),
            /**
             * @func
             * @name DOMM#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMM} instance
             */
            /**
             * @func
             * @name DOMM#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM} instance
             */
            // css: styleManipulator(DOMproducesKeyValues),
            css: styleManipulator,
            style: styleManipulator,
            /**
             * @func
             * @name DOMM#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allElements: function () {
                return !!(this[LENGTH]() && !find(this.unwrap(), function (manager) {
                    return !manager.isElement;
                }));
            },
            /**
             * @func
             * @name DOMM#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            /**
             * @func
             * @name DOMM#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            /**
             * @func
             * @name DOMM#getStyle
             * @retuns {Object} the get computed result or a UNDEFINED object if first or defined index is not a dom element and therefore cannot have a style associated with it
             */
            // getStyle: function (eq) {
            //     var ret = {},
            //         first = this.index();
            //     if (first && isElement(first)) {
            //         ret = getComputed(first, this.context);
            //     }
            //     return ret;
            // },
            /**
             * @func
             * @name DOMM#data
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {Object|*} can return the value that is asked for by the initial function call
             */
            // data: dataManipulator(DOMproducesKeyValues), // domAttrManipulator(dataAttributeManipulator),
            /**
             * @func
             * @name DOMM#attr
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM|*} if multiple attributes were requested then a plain hash is returned, otherwise the DOMM instance is returned
             */
            // attr: attrManipulator(DOMproducesKeyValues), // domAttrManipulator(trackedAttributeInterface),
            // prop: propManipulator(DOMproducesKeyValues), // domAttrManipulator(trackedAttributeInterface, BOOLEAN_TRUE),
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            /**
             * @func
             * @name DOMM#eq
             * @param {Number|Array} [num=0] - index or list of indexes to create a new DOMM element with.
             * @returns {DOMM} instance
             */
            eq: attachPrevious(function (num) {
                return eq(this.unwrap(), num);
            }),
            /**
             * @func
             * @name DOMM#clientRect
             * @param {Number} [num=0] - item who's bounding client rect will be assessed and extended
             * @returns {Object} hash of dimensional properties (getBoundingClientRect)
             */
            /**
             * @func
             * @name DOMM#addClass
             * @param {String|Array} add - space delimited string that separates classes to be added through the change class function
             * @returns {DOMM} instance
             */
            // addClass: DOMIterator(addClass, UNDEFINED, WRITE),
            // /**
            //  * @func
            //  * @name DOMM#removeClass
            //  * @param {String|Array} remove - space delimited string that separates classes to be removed through the change class function
            //  * @returns {DOMM} instance
            //  */
            // removeClass: DOMIterator(removeClass, UNDEFINED, WRITE),
            // /**
            //  * @func
            //  * @name DOMM#toggleClass
            //  * @params {String|Array} list - space delimited string that separates classes to be removed and added through the change class function
            //  * @returns {DOMM} instance
            //  */
            // toggleClass: DOMIterator(toggleClass, UNDEFINED, WRITE),
            /**
             * @func
             * @name DOMM#hasClass
             * @param {String|Array} list - space delimited string that each element is checked againsts to ensure that it has the classs
             * @returns {Boolean} do all of the elements in the collection have all of the classes listed
             */
            // hasClass: containsClass,
            /**
             * @func
             * @name DOMM#changeClass
             * @param {String|Array} [remove] - removes space delimited list or array of classes
             * @param {String|Array} [add] - adds space delimited list or array of classes
             * @returns {DOMM} instance
             */
            // changeClass: DOMIterator(changeClass, UNDEFINED, WRITE),
            // booleanClass: DOMIterator(booleanClass, UNDEFINED, WRITE),
            /**
             * @func
             * @name DOMM#box
             * @param {Number} [num=0] - index to get the boxmodel of
             */
            /**
             * @func
             * @name DOMM#end
             * @returns {DOMM} object that started the traversal chain
             */
            end: function () {
                var that = this;
                while (that._previous) {
                    that = that._previous;
                }
                return that;
            },
            /**
             * @func
             * @name DOMM#append
             */
            append: appendChildDOMM,
            appendChild: appendChildDOMM,
            prepend: prependChildDOMM,
            prependChild: prependChildDOMM,
            /**
             * @func
             * @name DOMM#next
             * @returns {DOMM} instance
             */
            next: horizontalTraverser(1),
            /**
             * @func
             * @name DOMM#previous
             * @returns {DOMM} instance
             */
            prev: horizontalTraverser(-1),
            /**
             * @func
             * @name DOMM#skip
             * @returns {DOMM} instance
             */
            skip: horizontalTraverser(0),
            /**
             * @func
             * @name DOMM#insertAt
             * @returns {DOMM} instance
             */
            insertAt: function (els_, index, clone) {
                var manager = this,
                    owner = manager.context,
                    els = isAppendable(els_) ? this.context.returnsManager(els_) : owner.query(els_).fragment();
                return this.each(function (manager) {
                    var elements = els;
                    if (clone) {
                        elements = elements.clone();
                    }
                    manager.insertAt(elements, index);
                });
            },
            // insertAt: function (els, index, clone) {
            //     var lastChildIndex, dom = this,
            //         frag = DOMM(els).fragment().element(),
            //         first = dom.eq(0),
            //         children = index == NULL ? NULL : first.children(),
            //         manager = children && children.index() || NULL,
            //         element = manager && manager.element() || NULL,
            //         parent = first.index(),
            //         parentEl = parent && parent.element(),
            //         fragmentChildren = query(CUSTOM_ATTRIBUTE, frag),
            //         returnValue = parentEl && parentEl.insertBefore(frag, element),
            //         notify = isAttached(parentEl) && each(fragmentChildren, dispatchAttached);
            //     return returnValue;
            // },
            /**
             * @func
             * @name DOMM#parent
             * @param {Number} [count=1] - number of elements to go up in the parent chain
             * @returns {DOMM} instance of collected, unique parents
             */
            parent: (function () {
                var finder = function (collect, fn, original) {
                        return function (el) {
                            var rets, found, parent = el,
                                next = original;
                            while (parent && parent.element() && !found) {
                                parent = parent.element();
                                rets = fn(parent[PARENT_NODE] || parent[DEFAULT_VIEW], original, next);
                                parent = this.context.owner.returnsManager(rets[0]);
                                found = rets[1];
                                next = rets[2];
                            }
                            if (parent) {
                                collect.push(parent);
                            }
                        };
                    },
                    number = function (parent, original, next) {
                        next -= 1;
                        if (next < 0 || !isFinite(next) || isNaN(next)) {
                            next = 0;
                        }
                        return [parent, !next, next];
                    },
                    string = function (parent, original, next) {
                        return [parent, matches(parent, original)];
                    },
                    speshal = {
                        document: function (parent, original, next) {
                            return [parent, isDocument(parent)];
                        },
                        window: function (parent, original, next) {
                            return [parent, isWindow(parent)];
                        },
                        iframe: function (parent, original, next) {
                            var win;
                            if (isWindow(parent) || (parent === win[TOP])) {
                                return [parent, BOOLEAN_FALSE];
                            }
                            win = parent;
                            return [parent, wraptry(function () {
                                parent = win.frameElement;
                                if (parent) {
                                    return BOOLEAN_TRUE;
                                }
                                return BOOLEAN_FALSE;
                            }, function () {
                                return BOOLEAN_FALSE;
                            }) && parent];
                        }
                    };
                return attachPrevious(function (original) {
                    var iterator, data = [],
                        doDefault = BOOLEAN_FALSE,
                        collect = Collection();
                    if (isNumber(original)) {
                        iterator = number;
                    } else {
                        if (isString(original)) {
                            iterator = speshal[original] || string;
                        } else {
                            doDefault = original ? BOOLEAN_TRUE : doDefault;
                        }
                    }
                    if (doDefault) {
                        this.each(finder(collect, function (el) {
                            return [el, original(el)];
                        }));
                    } else {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        this.each(finder(collect, iterator, original));
                    }
                    return collect.unwrap();
                });
            }()),
            /**
             * @func
             * @name DOMM#has
             * @param {Node|Array} els - list of elements to check the current instance against
             * @returns {Boolean} whether or not the current domm element has all of the elements that were passed in
             */
            has: function (els) {
                var domm = this,
                    collection = Collection(els),
                    length = collection[LENGTH]();
                return !!length && collection.find(function (el) {
                    return domm.posit(el) ? BOOLEAN_FALSE : BOOLEAN_TRUE;
                });
            },
            /**
             * @func
             * @name DOMM#html
             * @returns {DOMM} instance
             */
            html: htmlTextManipulator(INNER_HTML),
            /**
             * @func
             * @name DOMM#text
             * @returns {DOMM} instance
             */
            text: htmlTextManipulator(INNER_TEXT),
            /**
             * @func
             * @name DOMM#contentRect
             * @returns {Object} dimensions of the content rectangle
             */
            contentRect: function (num) {
                var box = this.box(num),
                    pB = box.paddingBottom,
                    pT = box.paddingTop,
                    pR = box.paddingRight,
                    pL = box.paddingLeft,
                    bT = box.borderTop,
                    bB = box.borderBottom,
                    bR = box.borderRight,
                    bL = box.borderLeft;
                return {
                    bottom: box[BOTTOM] - pB - bB,
                    height: box[HEIGHT] - pT - bT - pB - bB,
                    right: box[RIGHT] - pR - bR,
                    width: box[WIDTH] - pL - bL - pR - bR,
                    left: box[LEFT] + pL - bL,
                    top: box[TOP] + pT - bT
                };
            },
            /**
             * @func
             * @name DOMM#flowRect
             * @returns {Object} dimensions of the flow rectangle: the amount of space the element should take up in the dom
             */
            flowRect: function () {
                var box = this.box(0),
                    mT = box.marginTop,
                    mL = box.marginLeft,
                    mB = box.marginBottom,
                    mR = box.marginRight;
                return {
                    height: box[HEIGHT] + mT + mB,
                    bottom: box[BOTTOM] + mB,
                    width: box[WIDTH] + mR + mL,
                    right: box[RIGHT] + mR,
                    left: box[LEFT] + mL,
                    top: box[TOP] + mT
                };
            },
            /**
             * @func
             * @name DOMM#childOf
             */
            childOf: function (oParent_) {
                var domm = this,
                    _oParent = DOMM(oParent_),
                    children = domm.unwrap(),
                    oParent = _oParent.unwrap();
                // has to use utility find because the DOMM find is just a scoped query ($)
                return !!children[LENGTH] && !!oParent[LENGTH] && !find(oParent, function (_parent) {
                    return find(children, function (child) {
                        var parent = child,
                            finding = BOOLEAN_TRUE;
                        while (parent && finding) {
                            if (_parent === parent) {
                                finding = BOOLEAN_FALSE;
                            }
                            parent = parent[PARENT_NODE];
                        }
                        return finding;
                    });
                });
            },
            map: function (handler, context) {
                return Collection(map(this.unwrap(), handler, context));
            },
            toJSON: function () {
                return this.mapCall('toJSON');
            },
            toString: function () {
                return JSON.stringify(this);
            }
        }, wrap(allEachMethods, applyToEach), wrap(firstMethods, applyToFirst), wrap(readMethods, applyToTarget)), BOOLEAN_TRUE),
        $ = win.$ = DOMM_SETUP(doc);
    app.undefine(function (windo) {
        windo.$ = DOMM_SETUP(windo[DOCUMENT]);
    });
    // collect all templates with an id
    $.collectTemplates();
    // register all custom elements...
    // everything that's created after this should go through the DomManager to be marked appropriately
    duff($.query(CUSTOM_ATTRIBUTE), returnsManager);
    // add $ to module madness
    // app.addModuleArguments([$]);
    // define a hash for attribute caching
    app.defineDirective('attributes', function () {
        return {};
    });
});