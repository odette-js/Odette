application.scope().module('DOMM', function (module, app, _, factories) {
    var posit = _.posit,
        DOMM_STRING = 'DOMM',
        Collection = factories.Collection,
        elementData = _.associator,
        NODE_TYPE = 'nodeType',
        PARENT_NODE = 'parentNode',
        ITEMS = '_items',
        DELEGATE_COUNT = '__delegateCount',
        REMOVE_QUEUE = 'removeQueue',
        ADD_QUEUE = 'addQueue',
        CLASSNAME = 'className',
        CLASS__NAME = (CLASS + HYPHEN + NAME),
        FONT_SIZE = 'fontSize',
        DEFAULT_VIEW = 'defaultView',
        DIV = 'div',
        devicePixelRatio = (win.devicePixelRatio || 1),
        ua = navigator.userAgent,
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
            return isWindow(windo) ? windo : (windo && windo[DEFAULT_VIEW] ? windo[DEFAULT_VIEW] : (windo.ownerGlobal ? windo.ownerGlobal : $(windo).parent(WINDOW)[INDEX](0) || win));
        },
        getComputed = function (el, ctx) {
            var ret = getClosestWindow(ctx).getComputedStyle(el);
            return ret ? ret : getClosestWindow(el).getComputedStyle(el) || clone(el[STYLE]) || {};
        },
        allStyles = getComputed(doc[BODY], win),
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
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
        saveDOMContentLoadedEvent = function (doc) {
            var data = elementData.get(doc);
            if (data.isReady === UNDEFINED) {
                data.isReady = BOOLEAN_FALSE;
                DOMM(doc).on('DOMContentLoaded', function (e) {
                    data.DOMContentLoadedEvent = e;
                    data.isReady = BOOLEAN_TRUE;
                });
            }
        },
        _DOMM = factories._DOMM = function (doc) {
            saveDOMContentLoadedEvent(doc);
            var scoped = function (sel, ctx) {
                return DOMM(sel, ctx || doc);
            };
            scoped[CONSTRUCTOR] = DOMM[CONSTRUCTOR];
            return scoped;
        },
        writeAttribute = function (el, key, val_) {
            el.setAttribute(key, (val_ === BOOLEAN_TRUE ? EMPTY_STRING : stringify(val_)) + EMPTY_STRING);
        },
        coerceValue = function (value) {
            var val = value;
            if (val === EMPTY_STRING) {
                val = BOOLEAN_TRUE;
            } else {
                if (val == NULL) {
                    val = BOOLEAN_FALSE;
                } else {
                    val = +val == val ? +val : val;
                }
            }
            return val === val ? val : BOOLEAN_FALSE;
        },
        readAttribute = function (el, key) {
            return coerceValue(parse(el.getAttribute(key)));
        },
        /**
         * @private
         * @func
         */
        removeAttribute = function (el, key) {
            el.removeAttribute(key);
        },
        attributeInterface = {
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
        // scopedInterface = function (attribute, remove, add) {
        //     return function (el) {
        //         var stringManager = elementData.ensure(el, DOMM_STRING, DomManager).get(attribute, StringManager);
        //     };
        // },
        trackedAttributeInterface = function (el, key, val, isProp, data) {
            // set or remove if not undefined
            // undefined fills in the gap by returning some value, which is never undefined
            var isArrayResult, cameledKey = camelCase(key),
                el_interface = isProp ? propertyInterface : attributeInterface,
                stringManager = !isProp && (data || returnsElementData(el)).get(cameledKey, StringManager),
                readAttribute = el_interface.read(el, key);
            if (!isProp && isString(readAttribute)) {
                stringManager.ensure(readAttribute);
            }
            if (val == NULL) {
                return readAttribute;
            }
            if (!val && val !== 0) {
                el_interface.remove(el, key);
            } else {
                el_interface.write(el, key, isProp ? val : addRemoveAttributes(val, stringManager).generate(' '));
            }
        },
        getClassName = function (el, key) {
            var className, failed = key === CLASS;
            if (!failed) {
                className = el[CLASSNAME];
                if (!isString(className)) {
                    failed = BOOLEAN_TRUE;
                }
            }
            if (failed) {
                className = getAttribute(el, CLASS, BOOLEAN_FALSE);
            }
            return (className || EMPTY_STRING).split(' ');
        },
        setClassName = function (el, key, value) {
            var failed = key === CLASS;
            if (!failed) {
                if (isString(el[CLASSNAME])) {
                    el[CLASSNAME] = value;
                } else {
                    failed = BOOLEAN_TRUE;
                }
            }
            if (failed) {
                setAttribute(el, CLASS, value, BOOLEAN_FALSE);
            }
        },
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
        triggerEventWrapper = function (attr_, api) {
            var attr = attr_ || api,
                eachHandler = cannotTrust(function (el) {
                    var whichever = api || attr;
                    if (isFunction(el[whichever])) {
                        el[whichever]();
                    } else {
                        $(el).dispatchEvent(whichever);
                    }
                });
            return function (fn, fn2, capturing) {
                var args, evnt, count = 0,
                    domm = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    domm.on(attr, fn, fn2, capturing);
                } else {
                    domm.duff(eachHandler);
                }
                return domm;
            };
        },
        /**
         * @private
         * @func
         */
        htmlDataMatch = function (string, regexp, callback, nameFinder) {
            var matches = string.trim().match(regexp);
            duff(matches, function (match) {
                var value;
                match = match.trim();
                value = match.match(/~*=[\'|\"](.*?)[\'|\"]/);
                name = match.match(/(.*)(?:~*=)/igm);
                name = _.join(_.split(name, '='), EMPTY_STRING).trim();
                callback(value[1], name, match);
            });
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
        // BeforeUnloadEvent = gapSplit(EMPTY_STRING),
        TimeEvent = gapSplit('beginEvent endEvent repeatEvent'),
        AnimationEvent = gapSplit('animationend animationiteration animationstart transitionend'),
        AudioProcessingEvent = gapSplit('audioprocess complete'),
        UIEvents = gapSplit('abort error hashchange load orientationchange readystatechange resize scroll select unload beforeunload'),
        ProgressEvent = gapSplit('abort error load loadend loadstart popstate progress timeout'),
        AllEvents = _.concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvent, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvent, TimeEvent, AnimationEvent, AudioProcessingEvent, UIEvents, ProgressEvent),
        knownPrefixes = gapSplit('-o- -ms- -moz- -webkit- mso- -xv- -atsc- -wap- -khtml- -apple- prince- -ah- -hp- -ro- -rim- -tc-'),
        trustedEvents = gapSplit('load scroll resize orientationchange click dblclick mousedown mouseup mouseover mouseout mouseenter mouseleave mousemove change contextmenu hashchange load mousewheel wheel readystatechange'),
        ALL_EVENTS_HASH = wrap(AllEvents, BOOLEAN_TRUE),
        knownPrefixesHash = wrap(knownPrefixes, BOOLEAN_TRUE),
        StringManager = factories.StringManager,
        // isProp = isProp_ === UNDEFINED ? !isObject(el[CLASSNAME]) : isProp_,
        //         currentClassName = getAttribute(el, key, isProp),
        // gapSplit(currentClassName)
        // because classes are always strings, we can use a different management tool
        LAZYattributeInterface = function (el, key, remove, add, current, wipes, data_, manager_) {
            var data = manager_ || data_ || returnsElementData(el),
                _manager = manager_ || data.get(key, StringManager),
                manager = _manager.ensure(current, ' ');
            return manager;
        },
        readProperty = function (el, property) {
            return el[property];
        },
        writeProperty = function (el, property, value) {
            el[property] = value;
        },
        removeProperty = function (el, property) {
            writeProperty(el, property, NULL);
        },
        propertyInterface = {
            read: readProperty,
            write: writeProperty,
            remove: removeProperty
        },
        ensureManager = function (el, attribute, currentValue, data, manager) {
            var _attributeManager = manager || (data || returnsElementData(el)).get(attribute, StringManager);
            return _attributeManager.ensure(currentValue, ' ');
        },
        queueAttributes = function (list, attribute, first_, second_, api, merge, after) {
            var first = gapSplit(first_),
                second = gapSplit(second_);
            duff(list, function (el) {
                var result = merge(ensureManager(el, attribute, api.read(el, attribute)), first, second);
                return after && api[after] && api[after](el, attribute, result.generate(' '));
            }, NULL);
        },
        globalQueueAttributes = function (merge) {
            return function (attribute, api, insides) {
                return function (list, first, second, attribute_, insides_) {
                    var inside = insides_ === UNDEFINED ? insides : insides_;
                    return queueAttributes(list, attribute_ || attribute, first, second, api, merge, inside);
                };
            };
        },
        _addAttributeValues = function (attributeManager, add) {
            duff(add, attributeManager.add, attributeManager);
            return attributeManager;
        },
        _removeAttributeValues = function (attributeManager, remove) {
            duff(remove, attributeManager.remove, attributeManager);
            return attributeManager;
        },
        _toggleAttributeValues = function (attributeManager, togglers) {
            duff(togglers, attributeManager.toggle, attributeManager);
            return attributeManager;
        },
        _changeAttributeValues = function (attributeManager, remove, add) {
            return _addAttributeValues(_removeAttributeValues(attributeManager, remove), add);
        },
        _booleanAttributeValues = function (attributeManager, addremove, follows) {
            // rework this
            return (addremove ? _addAttributeValues : _removeAttributeValues)(attributeManager, follows);
        },
        // global attribute manager handlers
        addAttributeValues = globalQueueAttributes(_addAttributeValues),
        removeAttributeValues = globalQueueAttributes(_removeAttributeValues),
        toggleAttributeValues = globalQueueAttributes(_toggleAttributeValues),
        changeAttributeValues = globalQueueAttributes(_changeAttributeValues),
        booleanAttributeValues = globalQueueAttributes(_booleanAttributeValues),
        // scoped to class
        classNameApi = {
            read: getClassName,
            write: setClassName,
            remove: removeAttribute
        },
        addClass = addAttributeValues(CLASSNAME, classNameApi),
        removeClass = removeAttributeValues(CLASSNAME, classNameApi),
        toggleClass = toggleAttributeValues(CLASSNAME, classNameApi),
        changeClass = changeAttributeValues(CLASSNAME, classNameApi),
        booleanClass = booleanAttributeValues(CLASSNAME, classNameApi),
        attributeApplication = function (fn, key, applies) {
            return function (one, two) {
                return fn(this.unwrap(), one, two, key, applies);
            };
        },
        containsClass = function (newClasses_) {
            var newClasses = gapSplit(newClasses_);
            var result = newClasses[LENGTH] && !!this[LENGTH]() && !find(this.unwrap(), function (el) {
                var currentClassName = getClassName(el),
                    _attributeManager = elementData.ensure(el, DOMM_STRING, DomManager).get(CLASSNAME, StringManager),
                    classManager = _attributeManager.ensure(currentClassName, ' ');
                return find(newClasses, function (clas) {
                    var stringInstance = classManager.get(clas);
                    return stringInstance ? !stringInstance.isValid() : BOOLEAN_TRUE;
                });
            });
            return result;
        },
        /**
         * @private
         * @func
         */
        toStyleString = function (css) {
            var cssString = [];
            each(css, function (name, val) {
                var nameSplit;
                name = unCamelCase(name);
                nameSplit = name.split(HYPHEN);
                if (knownPrefixesHash[nameSplit[0]]) {
                    nameSplit.unshift(EMPTY_STRING);
                }
                name = nameSplit.join(HYPHEN);
                cssString.push(name + ': ' + val + ';');
            });
            return cssString.join(' ');
        },
        /**
         * @private
         * @func
         */
        ensureDOM = function (fn) {
            return function (el) {
                if (isElement(el)) {
                    fn(el);
                }
            };
        },
        /**
         * @private
         * @func
         */
        // returns the flow of the element passed on relative to the element's bounding window
        flow = function (el, ctx) {
            var clientRect = el.getBoundingClientRect(),
                computedStyle = getComputed(el, ctx),
                marginTop = parseFloat(computedStyle.marginTop),
                marginLeft = parseFloat(computedStyle.marginLeft),
                marginRight = parseFloat(computedStyle.marginRight),
                marginBottom = parseFloat(computedStyle.marginBottom);
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
        css = (function () {
            var i, j, n, found, prefixIndex, __prefix, styleName, currentCheck, deprefixed, currentLen,
                validCssNames = [],
                prefixed = {},
                len = 0,
                valueModifiers = {
                    '-webkit-transform': function (val) {
                        return val;
                    }
                },
                modifyFinalProp = function (prop, val) {
                    if (valueModifiers[prop]) {
                        val = valueModifiers[prop](val);
                    }
                    return val;
                },
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
            return function (el, key, value) {
                var n, m, j, firstEl, lastKey, prefixes, unCameled, computed, _ret, retObj, finalProp, i = 0,
                    ret = {},
                    count = 0,
                    nuCss = {};
                if (!isObject(el)) {
                    return;
                }
                if (isBoolean(key)) {
                    key = el;
                    retObj = 1;
                }
                firstEl = el[0];
                intendedObject(key, value, function (key, value) {
                    if (value != NULL) {
                        count++;
                        prefixes = [EMPTY_STRING];
                        if (prefixed[m]) {
                            prefixes = prefixed[m].concat(prefixes);
                        }
                        for (j = 0; j < prefixes[LENGTH]; j++) {
                            finalProp = camelCase(prefixes[j] + m);
                            nuCss[finalProp] = modifyFinalProp(finalProp, value);
                        }
                    } else {
                        ret[m] = value;
                    }
                });
                if (retObj) {
                    return nuCss;
                }
                if (isElement(el)) {
                    el = [el];
                }
                if (!count) {
                    if (isElement(firstEl)) {
                        _ret = {};
                        computed = getComputed(firstEl);
                        count--;
                        each(ret, function (val_, key, obj) {
                            _ret[key] = convertStyleValue(key, computed[key]);
                            count++;
                            lastKey = key;
                        });
                        if (count + 1) {
                            if (count) {
                                return _ret;
                            } else {
                                return _ret[lastKey];
                            }
                        }
                    }
                } else {
                    style(el, nuCss);
                }
            };
        }()),
        convertStyleValue = function (key, value) {
            return value !== +value ? value : (timeBasedCss[key] ? value + 'ms' : (!numberBasedCss[key] ? value + PIXELS : value));
        },
        style = function (els, key, value) {
            if (!els[LENGTH]) {
                return;
            }
            intendedObject(key, value, function (key, value_) {
                var value = convertStyleValue(value_);
                duff(els, ensureDOM(function (el) {
                    el[STYLE][key] = value;
                }));
            });
        },
        prefixer = function (obj) {
            var rez = css(obj, BOOLEAN_TRUE);
            return rez;
        },
        jsToCss = function (obj) {
            var nuObj = {};
            each(obj, function (key, val) {
                var deCameled = unCamelCase(key),
                    split = deCameled.split(HYPHEN),
                    starter = split[0],
                    idx = indexOf(knownPrefixes, HYPHEN + starter + HYPHEN);
                if (idx !== -1) {
                    split[0] = HYPHEN + starter;
                }
                nuObj[split.join(HYPHEN)] = val;
            });
            return nuObj;
        },
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
            var ret = {};
            if (isElement(item)) {
                ret = item.getBoundingClientRect();
            }
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
            number = +(str.split(unit).join(EMPTY_STRING)) || 0;
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
            if (!el || !isDocument(el)) {
                return BOOLEAN_FALSE;
            }
            tagName = el.localName.toLowerCase();
            return str ? tagName === str.toLowerCase() : tagName;
        },
        /**
         * @private
         * @func
         */
        isTrustedEvent = function (name) {
            return (indexOf(trustedEvents, name) !== -1);
        },
        /**
         * @private
         * @func
         */
        createElement = function (str) {
            return doc.createElement(str);
        },
        makeEmptyFrame = function (str) {
            var frame, div = createElement(DIV);
            div.innerHTML = str;
            frame = div.children[0];
            return $(frame);
        },
        makeTree = function (str) {
            var div = createElement(DIV);
            div.innerHTML = str;
            return $(div.children).remove().unwrap();
        },
        /**
         * @private
         * @func
         */
        matches = function (element, selector) {
            var match, parent, temp, matchesSelector;
            if (!selector || !element || element[NODE_TYPE] !== 1) {
                return BOOLEAN_FALSE;
            }
            matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) {
                return matchesSelector.call(element, selector);
            }
            // fall back to performing a selector:
            parent = element[PARENT_NODE];
            temp = !parent;
            if (temp) {
                parent = createElement(DIV);
                parent.appendChild(element);
            }
            // temp && tempParent.removeChild(element);
            return !!posit(Sizzle(selector, parent), element);
        },
        /**
         * @private
         * @func
         */
        eachProc = function (fn) {
            return function () {
                var args = toArray(arguments),
                    domm = this;
                args.unshift(domm);
                domm.duff(function (el) {
                    args[0] = el;
                    fn.apply(domm, args);
                });
                return domm;
            };
        },
        createDocumentFragment = function () {
            return doc.createDocumentFragment();
        },
        /**
         * @private
         * @func
         */
        createElements = function (tagName) {
            return $(foldl(gapSplit(tagName), function (memo, name) {
                memo.push(createElement(name));
                return memo;
            }, []));
        },
        fragment = function (el) {
            var frag;
            if (isFragment(el)) {
                frag = el;
            } else {
                frag = createDocumentFragment();
                $(el).duff(ensureDOM(function (el) {
                    frag.appendChild(el);
                }));
            }
            return frag;
        },
        htmlTextManipulator = function (attr) {
            return function (string) {
                var dom = this,
                    returnString = EMPTY_STRING;
                return isString(string) ? dom.duff(function (el) {
                    if (tag(el, 'iframe')) {
                        win = el.contentWindow;
                        if (win) {
                            doc = win[DOCUMENT];
                            doc.open();
                            doc.write(string);
                            doc.close();
                        }
                    } else {
                        el[attr] = string;
                    }
                }) : dom.duff(function (el) {
                    if (tag(el, 'iframe')) {
                        win = el.contentWindow;
                        if (win) {
                            doc = win[DOCUMENT];
                            returnString += doc.body ? doc.body[PARENT_NODE].outerHTML : EMPTY_STRING;
                        }
                    } else {
                        returnString += el[attr];
                    }
                }) && returnString;
            };
        },
        horizontalTraverser = function (_idxChange) {
            return attachPrevious(function (idxChange_) {
                var data, domm = this,
                    collected = [],
                    list = domm.unwrap(),
                    idxChange = _idxChange || idxChange_;
                if (idxChange) {
                    data = [];
                    duff(list, function (idx_, el) {
                        var parent = el[PARENT_NODE],
                            idx = (indexOf(parent.children, el) + idxChange),
                            item = parent.children[idx];
                        if (item && !posit(list, item)) {
                            if (add(collected, item)) {
                                data.push(returnsElementData(item));
                            }
                        }
                    });
                } else {
                    // didn't go anywhere
                    collected = list;
                    data = list._data || loadData(NULL, collected);
                }
                return [collected, data];
            });
        },
        discernClassProperty = function (isProp) {
            return isProp ? CLASSNAME : CLASS;
        },
        domAttrManipulator = function (fn, isProp) {
            // cant wrap in each because need to return custom data
            return function (key, value, context) {
                var dataKeys = [],
                    dom = context || this,
                    ret = {},
                    count = 0,
                    cachedData = dom._data || [],
                    domList = dom.unwrap();
                // moved to outside because iterating over objects is more
                // time consuming than iterating over a straight list
                intendedObject(key, value, function (__key, val) {
                    var __keys = gapSplit(__key);
                    dataKeys.push(__key);
                    duff(domList, function (el, idx) {
                        var datum = cachedData[idx] = cachedData[idx] || elementData.ensure(el, DOMM_STRING, DomManager);
                        duff(__keys, function (_key) {
                            var value, cachedIsProp = isProp,
                                unCameledKey = unCamelCase(_key);
                            if (unCameledKey === CLASS__NAME) {
                                cachedIsProp = isString(el[CLASSNAME]);
                                unCameledKey = discernClassProperty(cachedIsProp);
                            }
                            value = fn(el, unCameledKey, val, cachedIsProp, datum);
                            if (value !== UNDEFINED) {
                                ret[_key] = value;
                                count++;
                            }
                        });
                    });
                });
                dom._data = cachedData;
                if (dataKeys[LENGTH] === 1) {
                    if (count === 1) {
                        ret = ret[dataKeys[0]];
                    } else {
                        if (!count) {
                            ret = dom;
                        }
                    }
                } else {
                    ret = dom;
                }
                return ret;
            };
        },
        attachPrevious = function (fn) {
            return function () {
                var prev = this;
                // ensures it's still a dom object
                var result = fn.apply(this, arguments);
                // don't know if we went up or down, so use null as context
                var obj = new DOMM[CONSTRUCTOR](result[0], NULL, result[1]);
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
                        namespaceSplit = nme.split('.'),
                        nm = namespaceSplit.shift(),
                        namespace = namespaceSplit.join('.');
                    if (nm[0] === '_') {
                        nm = nm.slice(1);
                        captures = BOOLEAN_TRUE;
                    }
                    fn(nm, namespace, selector, fun, captures);
                });
            }
        },
        ensureOne = function (fn) {
            return function () {
                if (this[LENGTH]()) {
                    fn.apply(this, arguments);
                }
                return this;
            };
        },
        expandEventListenerArguments = function (fn) {
            return ensureOne(function () {
                var args, obj, selector, domm = this;
                // if there's nothing selected, then do nothing
                args = toArray(arguments);
                obj = args.shift();
                if (isObject(obj)) {
                    if (isString(args[0])) {
                        selector = args.shift();
                    }
                    each(obj, function (key, handlers) {
                        createSelector(domm, [key, selector, handlers].concat(args), fn);
                    });
                } else {
                    args.unshift(obj);
                    createSelector(domm, args, fn);
                }
            });
        },
        validateEvent = function (evnt, el) {
            return isString(evnt) ? {
                type: evnt,
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
            if (eventPhase === 2 && !evnt.bubbles && isElement(evnt.srcElement)) {
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
        getMainHandler = function (data, name, capturing) {
            return data.handlers[capturing + ':' + name];
        },
        dispatchEvent = function (el, evnt_, capturing_, data_, args, selector) {
            var e = {},
                data, gah, addQueue, list, capturingStack, events, stack, currentEventStack, selectorIsString, mainHandler, eventType, removeStack, $el, matches = 1,
                evnt = validateEvent(evnt_, el),
                capturing = !!capturing_;
            if (!evnt || !evnt.type) {
                return;
            }
            data = data_ || elementData.ensure(el, DOMM_STRING, DomManager);
            events = data._getEvents();
            capturingStack = events._captureHash[capturing];
            if (!capturingStack) {
                return;
            }
            eventType = evnt.type;
            wraptry(function () {
                data.dispatchEvent(evnt, NULL, capturing);
            }, console.error);
            events._removeEvents.duffRight(data._removeEvent, data);
            return e.returnValue;
        },
        _eventExpander = wrap({
            ready: 'DOMContentLoaded',
            deviceorientation: 'deviceorientation mozOrientation',
            fullscreenalter: 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
            hover: 'mouseenter mouseleave',
            forcetouch: 'webkitmouseforcewillbegin webkitmouseforcedown webkitmouseforceup webkitmouseforcechanged'
        }, function (val) {
            return gapSplit(val);
        }),
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
            var dom = this;
            return isFunction(callback) ? dom.duff(function (el) {
                _addEventListener(el, name, namespace, selector, callback, capture);
            }) && dom : dom;
        }),
        eventToNamespace = function (evnt) {
            if (!isString(evnt)) {
                evnt = evnt.type;
            }
            evnt = evnt.split('.');
            var evntName = evnt.shift();
            return [evntName, evnt.sort().join('.')];
        },
        SortedCollection = factories.SortedCollection,
        eventIdIncrementor = 0,
        returnsId = function () {
            return this.id;
        },
        DomManager = factories.Events.extend('DomManager', {
            _createEvent: function (evnt, opts, capturing) {
                return new DomEvent[CONSTRUCTOR](validateEvent(evnt), {
                    target: this.target,
                    capturing: capturing,
                    arg2: opts
                });
            },
            getEventList: function (evnt, _events) {
                var captureHash = _events._captureHash[evnt.capturing];
                return captureHash && captureHash[evnt.originalType];
            },
            constructor: function () {
                factories.Events[CONSTRUCTOR].apply(this, arguments);
                this[ATTRIBUTES] = {};
                return this;
            },
            get: function (where, defaults) {
                var events = this,
                    attrs = events[ATTRIBUTES],
                    found = attrs[where] = attrs[where] || defaults();
                return found;
            },
            _makeEvents: function () {
                var list = this[_EVENTS] = this[_EVENTS] = {
                    _byName: {},
                    _elementHandlers: {},
                    _captureHash: {},
                    _currentEvents: SortedCollection(),
                    _removeEvents: SortedCollection()
                };
                return list;
            },
            queueHandler: function (evnt, handler, list) {
                var selectorsMatch, ctx, domManager = this,
                    originalTarget = evnt.currentTarget,
                    el = domManager[TARGET],
                    mainHandler = handler.mainHandler;
                domManager.stashed = originalTarget;
                if (mainHandler.currentEvent) {
                    // cancel this event because this stack has already been called
                    exception('queue prevented because this element is already being dispatched with the same event');
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
            unQueueHandler: function (e, handler, list) {
                var domManager = this;
                e.currentTarget = domManager.stashed;
                domManager.stashed = NULL;
                handler.mainHandler.currentEvent = NULL;
            }
        }, BOOLEAN_TRUE),
        eventDispatcher = function (el, e, list) {
            // var $el = DOMM(el);
            return list.find(function (obj) {
                var selectorsMatch, ctx, originalTarget = e.currentTarget,
                    mainHandler = obj.mainHandler;
                if (mainHandler.currentEvent) {
                    return BOOLEAN_TRUE;
                }
                mainHandler.currentEvent = obj;
                if (obj && obj.persist && !obj.disabled) {
                    if (obj.selector) {
                        ctx = findMatch(el, evnt.target, obj.selector);
                        if (ctx) {
                            e.currentTarget = ctx;
                        } else {
                            mainHandler.currentEvent = NULL;
                            return;
                        }
                    }
                    obj.fn(e);
                }
                if (!obj.persist) {
                    // puts it on the event queue
                    removeEventQueue(obj);
                }
                e.currentTarget = originalTarget;
                mainHandler.currentEvent = NULL;
                return e.isImmediatePropagationStopped;
            });
        },
        _addEventListener = function (el, types, namespace, selector, fn_, capture) {
            var handleObj, eventHandler, data = elementData.ensure(el, DOMM_STRING, DomManager),
                events = data._getEvents(),
                captureHash = events._captureHash[capture] = events._captureHash[capture] || {},
                fn = bind(fn_, el);
            duff(gapSplit(types), eventExpander(function (name, passedName) {
                var foundDuplicate, handlerKey = capture + ':' + name,
                    elementHandlers = events._elementHandlers,
                    mainHandler = elementHandlers[handlerKey],
                    namespaceCache = captureHash[name] = captureHash[name] || SortedCollection();
                if (!mainHandler) {
                    eventHandler = function (e) {
                        return dispatchEvent(this, e, capture, data);
                    };
                    mainHandler = elementHandlers[handlerKey] = {
                        fn: eventHandler,
                        __delegateCount: 0,
                        events: events,
                        // addQueue: [],
                        // removeQueue: [],
                        currentEvent: NULL,
                        capturing: capture
                    };
                    // mainHandler[ADD_QUEUE] = SortedCollection();
                    // mainHandler[REMOVE_QUEUE] = SortedCollection();
                    el.addEventListener(name, eventHandler, capture);
                }
                foundDuplicate = namespaceCache.find(function (obj) {
                    // remove any duplicates
                    if (fn_ === obj.handler && obj.namespace === namespace && selector === obj.selector) {
                        return BOOLEAN_TRUE;
                    }
                });
                if (foundDuplicate) {
                    return;
                }
                addEventQueue({
                    id: ++eventIdIncrementor,
                    valueOf: returnsId,
                    fn: fn,
                    handler: fn_,
                    persist: BOOLEAN_TRUE,
                    disabled: BOOLEAN_FALSE,
                    list: namespaceCache,
                    namespace: namespace,
                    mainHandler: mainHandler,
                    selector: selector,
                    name: name,
                    passedName: passedName
                });
            }));
        },
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
                    if (idx + 1) {
                        if (selector) {
                            mainHandler[DELEGATE_COUNT]--;
                        }
                        gah = list.splice(idx, 1);
                    }
                    obj.list = NULL;
                }
            } else {
                if (obj.persist) {
                    mainHandler[REMOVE_QUEUE].push(obj);
                }
            }
            obj.persist = BOOLEAN_FALSE;
        },
        removeEventListener = expandEventListenerArguments(function (name, namespace, selector, handler, capture) {
            return this.duff(function (el) {
                _removeEventListener(el, name, namespace, selector, handler, capture);
            });
        }),
        removeEvent = function (obj) {
            var mainHandler = obj.mainHandler;
            if (obj.selector) {
                mainHandler[DELEGATE_COUNT] = Math.max(mainHandler[DELEGATE_COUNT] - 1, 0);
            }
            _.remove(obj.list, obj);
        },
        _removeEventListener = function (el, name, namespace, selector, handler, capture_) {
            var data = elementData.ensure(el, DOMM_STRING, DomManager),
                removeFromList = function (list, name) {
                    return list && list.duffRight(function (obj) {
                        if ((!name || name === obj[NAME]) && (!handler || obj.handler === handler) && (!namespace || obj.namespace === namespace) && (!selector || obj.selector === selector)) {
                            removeEventQueue(obj);
                        }
                    });
                };
            return name ? removeFromList(data._getEvents(name), name) : each(data._getEvents()._captureHash[!!capture_], removeFromList);
        },
        /**
         * @class DOMM
         * @augments Model
         * @augments Collection
         */
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
                    evnt.value = (original.webkitForce / 3) || original;
                    return evnt;
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
            make: function (evnt, originalEvent, data) {
                var doc, target, val, i, prop, copy, type = originalEvent.type,
                    // Create a writable copy of the event object and normalize some properties
                    fixHook = fixHooks.fixedHooks[type];
                if (!fixHook) {
                    fixHooks.fixedHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : rforceEvent.test(type) ? this.forceHooks : {};
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
                evnt.data = originalEvent.data || data || EMPTY_STRING;
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
                evnt.isTrusted = _.has(originalEvent, 'isTrusted') ? originalEvent.isTrusted : !DO_NOT_TRUST;
                return evnt;
            }
        },
        DomEvent = factories.ObjectEvent.extend('DomEvent', {
            constructor: function (evnt, opts) {
                var e = this;
                if (isInstance(evnt, DomEvent[CONSTRUCTOR])) {
                    return evnt;
                }
                e.originalEvent = evnt;
                e.delegateTarget = opts.target;
                fixHooks.make(e, evnt, opts.arg2);
                e.capturing = opts.capturing === UNDEFINED ? isCapturing(e) : opts.capturing;
                return e;
            },
            getNamespace: function () {
                return this.capturing + COLON + this.originalType;
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
            var filter;
            if (isFunction(filtr)) {
                filter = filtr;
            } else {
                if (isObject(filtr)) {
                    filter = objectMatches(filtr);
                } else {
                    if (isString(filtr)) {
                        filter = filterExpressions[filtr];
                        if (!filter) {
                            filter = function (item) {
                                return matches(item, filtr);
                            };
                        }
                    } else {
                        if (isNumber(filtr)) {
                            filter = function (el, idx) {
                                return idx === filtr;
                            };
                        } else {
                            filter = function () {
                                return BOOLEAN_TRUE;
                            };
                        }
                    }
                }
            }
            return filter;
        },
        dataReconstructor = function (list, fn) {
            return _.foldl(list, function (memo, arg1, arg2, arg3) {
                if (fn(arg1, arg2, arg3)) {
                    memo[0].push(arg1);
                    memo[1].push(returnsElementData(arg1));
                }
                return memo;
            }, [
                [],
                []
            ]);
        },
        domFilter = function (items, filtr) {
            var filter = createDomFilter(filtr);
            return dataReconstructor(items, filter);
        },
        dimFinder = function (element, doc, win) {
            return function (num) {
                var ret, el = this[INDEX](num);
                if (isElement(el)) {
                    ret = clientRect(el)[element];
                } else {
                    if (isDocument(el) && el[BODY]) {
                        ret = el[BODY][doc];
                    } else {
                        if (isWindow(el)) {
                            ret = el[win];
                        }
                    }
                }
                return ret || 0;
            };
        },
        dommFind = attachPrevious(function (str) {
            var passedString = isString(str),
                matchers = [],
                data = [],
                push = function (el) {
                    matchers.push(el);
                    data.push(returnsElementData(data));
                };
            _.duff(this.unwrap(), function (el) {
                if (passedString) {
                    duff(Sizzle(str, el), push);
                } else {
                    push(el);
                }
            });
            return [matchers, data];
        }),
        makeDataKey = function (_key) {
            var dataString = 'data-',
                key = _key,
                sliced = _key.slice(0, 5);
            if (dataString !== sliced) {
                key = dataString + _key;
            }
            return key;
        },
        canBeProcessed = function (item) {
            return isElement(item) || isWindow(item) || isDocument(item) || isFragment(item);
        },
        append = function (el) {
            var dom = this,
                firstEl = dom.first();
            if (firstEl) {
                firstEl.appendChild(fragment(el));
            }
            return dom;
        },
        prependChild = function (els) {
            return this.insertAt(0);
        },
        returnsElementData = function (element) {
            return elementData.ensure(element, DOMM_STRING, DomManager);
        },
        AttributeManager = Collection.extend('AttributeManager', {}, BOOLEAN_TRUE),
        makeQueues = function (list, queuedData_) {
            return AttributeManager(queuedData_ || map(list, returnsElementData));
        },
        applyQueueManager = function (list) {},
        _makeQueueManager = function () {
            return makeQueues(this.unwrap(), this._data);
        },
        _applyQueueManager = function () {
            return applyQueues(this.unwrap(), this._data);
        },
        loadData = function (data, items) {
            return data || map(items || this.unwrap(), returnsElementData);
        },
        Sizzle = function (str, ctx) {
            return (ctx || doc).querySelectorAll(str);
        },
        exportResult = _.exports({
            covers: covers,
            center: center,
            closer: closer,
            distance: distance,
            css: css,
            box: box,
            fragment: fragment,
            isElement: isElement,
            isWindow: isWindow,
            isDocument: isDocument,
            isFragment: isFragment,
            createElement: createElement,
            createElements: createElements,
            createDocumentFragment: createDocumentFragment,
            Sizzle: Sizzle,
            unitToNumber: unitToNumber,
            numberToUnit: numberToUnit
        }),
        DOMM = factories[DOMM_STRING] = factories.Collection.extend(DOMM_STRING, extend({
            /**
             * @func
             * @name DOMM#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMM instance
             * @returns {DOMM} instance
             */
            constructor: function (str, ctx, data_) {
                var i, els, handler, elsLen, $doc, docEl, docData, dom = this;
                dom.context = ctx || win[DOCUMENT];
                if (isFunction(str)) {
                    if (isDocument(ctx)) {
                        $doc = $(ctx);
                        docEl = $doc[INDEX]();
                        docData = returnsElementData(docEl);
                        handler = bind(str, $doc);
                        if (docData.isReady) {
                            // make it async
                            _.AF.once(function () {
                                handler($, docData.DOMContentLoadedEvent);
                            });
                            els = dom.unwrap();
                        } else {
                            dom = $doc.on('DOMContentLoaded', function (e) {
                                handler($, e);
                            });
                            els = dom.unwrap();
                        }
                        return $doc;
                    }
                } else {
                    if (isString(str)) {
                        if (str[0] === '<') {
                            els = makeTree(str);
                        } else {
                            els = Sizzle(str, ctx);
                        }
                    } else {
                        els = str;
                        if (!isArray(els) && canBeProcessed(els)) {
                            els = [els];
                        }
                    }
                }
                dom.swap(els, NULL, data_);
                return dom;
            },
            loadData: loadData,
            swap: function (list, hash, data) {
                var domm = this;
                domm._data = loadData(data, list || []);
                return Collection[CONSTRUCTOR][PROTOTYPE].swap.apply(domm, arguments);
            },
            /**
             * @func
             * @name DOMM#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            isWindow: function (num) {
                return isWindow(this[INDEX](num || 0) || {});
            },
            isElement: function (num) {
                return isElement(this[INDEX](num || 0) || {});
            },
            /**
             * @func
             * @name DOMM#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            isDocument: function (num) {
                return isDocument(this[INDEX](num || 0) || {});
            },
            isFragment: function (num) {
                return isFragment(this[INDEX](num || 0) || {});
            },
            fragment: function (el) {
                var domm = this;
                return fragment(el || (domm && domm.unwrap && domm.unwrap()));
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
             * @param {String} str - string to use sizzle to find against
             * @returns {DOMM} matching elements
             */
            find: dommFind,
            $: dommFind,
            /**
             * @func
             * @name DOMM#children
             * @param {Number} [eq] - index of the children to gather. If none is provided, then all children will be added
             * @returns {DOMM} all / matching children
             */
            children: attachPrevious(function (eq) {
                var dom = this,
                    data = [],
                    items = dom.unwrap(),
                    filter = createDomFilter(eq);
                return [foldl(items, function (memo, el) {
                    return foldl(el.children || el.childNodes, function (memo, child, idx, children) {
                        if (filter(child, idx, children)) {
                            memo.push(child);
                            data.push(returnsElementData(child));
                        }
                        return memo;
                    }, memo);
                }, []), data];
            }),
            /**
             * @func
             * @name DOMM#offAll
             * @returns {DOMM} instance
             */
            resetEvents: function () {
                return this.duff(function (el) {
                    var data = elementData.get(el);
                    each(data.handlers, function (key, fn, eH) {
                        var wasCapt, split = key.split(':');
                        eH[key] = UNDEFINED;
                        wasCapt = data[_EVENTS][split[0]];
                        if (wasCapt) {
                            wasCapt[split[1]] = [];
                        }
                    });
                    elementData.remove(el);
                });
            },
            /**
             * @name DOMM#off
             * @param {String|Function} type - event type
             * @param {Function} handler - specific event handler to be removed
             * @returns {DOMM} instnace
             */
            on: addEventListener,
            off: removeEventListener,
            addEventListener: addEventListener,
            removeEventListener: removeEventListener,
            dispatchEvent: cannotTrust(function () {
                var args = toArray(arguments);
                return this.duff(function (el) {
                    var domManager = elementData.ensure(el, DOMM_STRING, DomManager);
                    domManager.dispatchEvent.apply(domManager, args);
                });
            }),
            /**
             * @func
             * @name DOMM#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMM} instance
             */
            once: expandEventListenerArguments(eachProc(function (el, types, namespace, selector, fn, capture) {
                var args = args;
                var _fn = once(function () {
                    _removeEventListener(el, types, namespace, selector, _fn, capture);
                    return fn.apply(this, arguments);
                });
                _addEventListener(el, types, namespace, selector, _fn, capture);
            })),
            /**
             * @func
             * @name DOMM#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM} instance
             */
            css: ensureOne(function (key, value) {
                var dom = this,
                    ret = css(dom.unwrap(), key, value);
                if (ret == NULL) {
                    ret = dom;
                }
                return ret;
            }),
            style: ensureOne(function (key, value) {
                style(this.unwrap(), key, value);
                return this;
            }),
            /**
             * @func
             * @name DOMM#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allElements: function () {
                var count = 0,
                    length = this[LENGTH](),
                    result = length && find(this.unwrap(), negate(isElement));
                return length && result === UNDEFINED;
            },
            /**
             * @func
             * @name DOMM#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            /**
             * @func
             * @name DOMM#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            /**
             * @func
             * @name DOMM#getStyle
             * @retuns {Object} the get computed result or a UNDEFINED object if first or defined index is not a dom element and therefore cannot have a style associated with it
             */
            getStyle: function (eq) {
                var ret = {},
                    first = this.get();
                if (first && isElement(first)) {
                    ret = getComputed(first, this.context);
                }
                return ret;
            },
            /**
             * @func
             * @name DOMM#data
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {Object|*} can return the value that is asked for by the initial function call
             */
            data: domAttrManipulator(function (el, _key, val, isProp, data) {
                return trackedAttributeInterface(el, makeDataKey(_key), val, isProp, data);
            }),
            /**
             * @func
             * @name DOMM#attr
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM|*} if multiple attributes were requested then a plain hash is returned, otherwise the DOMM instance is returned
             */
            attr: domAttrManipulator(trackedAttributeInterface),
            prop: domAttrManipulator(trackedAttributeInterface, BOOLEAN_TRUE),
            // prop: domAttrManipulator(function (el, key, val) {
            //     var value;
            //     if (val == NULL) {
            //         value = el[key];
            //         value = value == NULL ? NULL : value;
            //     } else {
            //         el[key] = val == NULL ? NULL : val;
            //     }
            //     return value;
            // }),
            /**
             * @func
             * @name DOMM#eq
             * @param {Number|Array} [num=0] - index or list of indexes to create a new DOMM element with.
             * @returns {DOMM} instance
             */
            eq: attachPrevious(function (num) {
                var data = [];
                return [eq(this.unwrap(), num, function (item) {
                    data.push(item);
                }), data];
            }),
            /**
             * @func
             * @name DOMM#clientRect
             * @param {Number} [num=0] - item who's bounding client rect will be assessed and extended
             * @returns {Object} hash of dimensional properties (getBoundingClientRect)
             */
            clientRect: function (num) {
                return clientRect(eq(this.unwrap(), num)[0]);
            },
            /**
             * @func
             * @name DOMM#each
             * @param {Function} callback - iterator to apply to each item on the list
             * @param {Boolean} elOnly - switches the first argument from a DOMM wrapped object to the Node itself
             * @returns {DOMM} instance
             */
            each: ensureOne(function (callback_) {
                var domm = this,
                    callback = bind(callback_, domm);
                domm.duff(function (item_, index, all) {
                    var item = $([item_]);
                    callback(item, index, all);
                }, NULL);
            }),
            /**
             * @func
             * @name DOMM#addClass
             * @param {String|Array} add - space delimited string that separates classes to be added through the change class function
             * @returns {DOMM} instance
             */
            addClass: attributeApplication(addClass, UNDEFINED, WRITE),
            /**
             * @func
             * @name DOMM#removeClass
             * @param {String|Array} remove - space delimited string that separates classes to be removed through the change class function
             * @returns {DOMM} instance
             */
            removeClass: attributeApplication(removeClass, UNDEFINED, WRITE),
            /**
             * @func
             * @name DOMM#toggleClass
             * @params {String|Array} list - space delimited string that separates classes to be removed and added through the change class function
             * @returns {DOMM} instance
             */
            toggleClass: attributeApplication(toggleClass, UNDEFINED, WRITE),
            /**
             * @func
             * @name DOMM#hasClass
             * @param {String|Array} list - space delimited string that each element is checked againsts to ensure that it has the classs
             * @returns {Boolean} do all of the elements in the collection have all of the classes listed
             */
            hasClass: containsClass,
            /**
             * @func
             * @name DOMM#changeClass
             * @param {String|Array} [remove] - removes space delimited list or array of classes
             * @param {String|Array} [add] - adds space delimited list or array of classes
             * @returns {DOMM} instance
             */
            changeClass: attributeApplication(changeClass, UNDEFINED, WRITE),
            booleanClass: attributeApplication(booleanClass, UNDEFINED, WRITE),
            /**
             * @func
             * @name DOMM#box
             * @param {Number} [num=0] - index to get the boxmodel of
             */
            box: function (num) {
                return box(this[INDEX](num), this.context);
            },
            flow: function (num) {
                return flow(this[INDEX](num), this.context);
            },
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
             * @name DOMM#hide
             * @description sets all elements to display
             * @returns {DOMM} instance
             */
            hide: eachProc(ensureDOM(function (el) {
                el[STYLE].display = 'none';
            })),
            /**
             * @func
             * @name DOMM#show
             */
            show: eachProc(ensureDOM(function (el) {
                el[STYLE].display = 'block';
            })),
            /**
             * @func
             * @name DOMM#append
             */
            append: append,
            appendChild: append,
            prepend: prependChild,
            prependChild: prependChild,
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
            insertAt: function (els, idx) {
                var dom = this,
                    frag = fragment(els),
                    children = dom.children(),
                    point_ = isNumber(idx) ? children.eq(idx) : (isString(idx) ? dom.children.filter(idx) : DOMM(point)[INDEX](0)),
                    point = isElement(point) ? point : NULL;
                return dom.duff(function (el) {
                    el.insertBefore(frag, point);
                });
            },
            /**
             * @func
             * @name DOMM#remove
             * @returns {DOMM} instance
             */
            remove: eachProc(function (el) {
                var parent = el[PARENT_NODE],
                    data = elementData.get(el);
                if (data.isRemoving) {
                    return;
                }
                data.isRemoving = BOOLEAN_TRUE;
                result(parent, 'removeChild', el);
            }),
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
                            while (parent && !found) {
                                rets = fn(parent[PARENT_NODE] || parent[DEFAULT_VIEW], original, next);
                                parent = rets[0];
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
                        this.duff(finder(collect, function (el) {
                            return [el, original(el)];
                        }));
                    } else {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        this.duff(finder(collect, iterator, original));
                    }
                    collect = collect.unwrap();
                    if (collect[0]) {
                        data = returnsElementData(collect);
                    }
                    return [collect, data];
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
                    length = collection.length();
                return !!length && collection.find(function (el) {
                    return domm.posit(el) ? BOOLEAN_FALSE : BOOLEAN_TRUE;
                });
            },
            /**
             * @func
             * @name DOMM#indexOf
             * @param {Node|Array} el - element to check against the collection
             * @returns {Number} index of the element
             */
            indexOf: function (el, lookAfter) {
                return indexOf(this.unwrap(), isInstance(el, DOMM) ? el[INDEX](0) : el, lookAfter);
            },
            /**
             * @func
             * @name DOMM#html
             * @returns {DOMM} instance
             */
            html: htmlTextManipulator('innerHTML'),
            /**
             * @func
             * @name DOMM#text
             * @returns {DOMM} instance
             */
            text: htmlTextManipulator('innerText'),
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
                    _oParent = $(oParent_),
                    children = domm.unwrap(),
                    oParent = _oParent.unwrap();
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
            serialize: function () {
                var domm = this,
                    arr = [];
                domm.each(function ($node) {
                    var node = $node[INDEX](),
                        children = $node.children().serialize(),
                        obj = {
                            tag: tag(node)
                        };
                    if (children[LENGTH]) {
                        obj.children = children;
                    }
                    if (node.innerText) {
                        obj.innerText = node.innerText;
                    }
                    duff(node.attributes, function (attr) {
                        obj[camelCase(attr.localName)] = attr.nodeValue;
                    });
                    arr.push(obj);
                });
                return arr;
            },
            stringify: function () {
                return JSON.stringify(this.serialize());
            },
            tag: function (str) {
                return tag(this.index(0), str);
            },
            queue: _makeQueueManager,
            apply: _applyQueueManager
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
            return function (str) {
                var item, setter = {};
                if (isString(str)) {
                    setter[attr] = str;
                    return this.attr(setter);
                }
                item = this[INDEX](str);
                if (item) {
                    return item[attr];
                }
            };
        }), wrap({
            play: 'playing',
            pause: 'paused'
        }, triggerEventWrapper), wrap(gapSplit('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'), function (attr) {
            return triggerEventWrapper(attr);
        })), BOOLEAN_TRUE),
        $ = _.$ = _DOMM(doc);
    app.addModuleArguments([$]);
});