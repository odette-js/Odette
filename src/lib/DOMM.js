application.scope().module('DOMM', function (module, app, _, factories) {
    var posit = _.posit,
        Collection = factories.Collection,
        elementData = _.associator,
        NODE_TYPE = 'nodeType',
        PARENT_NODE = 'parentNode',
        ITEMS = '_items',
        DELEGATE_COUNT = '__delegateCount',
        REMOVE_QUEUE = 'removeQueue',
        ADD_QUEUE = 'addQueue',
        CLASSNAME = 'className',
        DEFAULT_VIEW = 'defaultView',
        STYLE = 'style',
        BODY = 'body',
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
                img.onload = emptyqueue(_.noop);
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
            return function (sel, ctx) {
                return DOMM(sel, ctx || doc);
            };
        },
        setAttribute = function (el, key, val_) {
            var val = val_;
            if (val === BOOLEAN_TRUE) {
                val = EMPTY_STRING;
            } else {
                val = stringify(val);
            }
            val += EMPTY_STRING;
            el.setAttribute(key, val);
        },
        getAttribute = function (el, key) {
            var converted;
            var val = parse(el.getAttribute(key));
            val = +val == val ? +val : val;
            if (val === EMPTY_STRING) {
                val = BOOLEAN_TRUE;
            }
            if (isBlank(val)) {
                val = BOOLEAN_FALSE;
            }
            return val;
        },
        /**
         * @private
         * @func
         */
        attributeInterface = function (el, key, val) {
            // set or remove if not undefined
            // undefined fills in the gap by returning some value, which is never undefined
            if (val !== UNDEFINED) {
                if (!val && val !== 0) {
                    el.removeAttribute(key);
                } else {
                    setAttribute(el, key, val);
                }
            } else {
                return getAttribute(el, key, val);
            }
        },
        getClassName = function (el, key) {
            var className = el[CLASSNAME];
            if (!isString(className)) {
                className = getAttribute(el, CLASS);
            }
            return (className || EMPTY_STRING).split(' ');
        },
        setClassName = function (el, value) {
            // var value = val.join(' ').trim();
            if (isString(el[CLASSNAME])) {
                el[CLASSNAME] = value;
            } else {
                setAttribute(el, CLASS, value);
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
        triggerEventWrapper = function (attr, api) {
            attr = attr || api;
            return function (fn, fn2) {
                var args, evnt, count = 0,
                    domm = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    args = toArray(arguments);
                    args.unshift(attr);
                    domm.on.apply(domm, args);
                } else {
                    domm.duff(cannotTrust(function (el) {
                        var whichever = api || attr;
                        if (isFunction(el[whichever])) {
                            el[whichever]();
                        } else {
                            $(el).dispatchEvent(whichever);
                        }
                    }));
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
        // changeClass = function (el, remove, add) {
        //     var n, val, command, classList;
        //     if (el) {
        //         classList = getClassName(el);
        //         if (remove) {
        //             duff(gapSplit(remove), function (clas) {
        //                 _.remove(classList, clas);
        //             });
        //         }
        //         if (add) {
        //             duff(gapSplit(add), function (clas) {
        //                 _.add(classList, clas);
        //             });
        //         }
        //         // val = gapJoin(classList).trim();
        //         setClassName(el, classList);
        //         return el;
        //     }
        // },
        addClass = function (classManager, add) {
            duff(gapSplit(add), classManager.add, classManager);
            return classManager;
        },
        removeClass = function (classManager, remove) {
            duff(gapSplit(remove), classManager.remove, classManager);
            return classManager;
        },
        toggleClass = function (classManager, togglers) {
            duff(gapSplit(togglers), classManager.toggle, classManager);
            return classManager;
        },
        changeClass = function (classManager, remove, add) {
            return addClass(removeClass(classManager, remove), add);
        },
        applyClass = function (fn) {
            return function (one, two) {
                this.duff(function (el) {
                    var classManager = elementData.ensure(el, ATTRIBUTES, factories.StringManager);
                    classManager.ensure(getClassName(el), ' ');
                    var ret = fn(classManager, one, two);
                    var generated = ret.generate(' ');
                    setClassName(el, generated);
                });
                return this;
            };
        },
        /**
         * @private
         * @func
         */
        containsClass = function (className) {
            return !!this.length() && !find(this.unwrap(), function (el) {
                var classManager = elementData.ensure(el, ATTRIBUTES, factories.StringManager);
                classManager.ensure(getClassName(el), ' ');
                return find(gapSplit(className), function (clas) {
                    var stringInstance = classManager.get(clas);
                    return stringInstance ? !stringInstance.isValid() : BOOLEAN_TRUE;
                });
            });
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
                nameSplit = name.split('-');
                if (knownPrefixesHash[nameSplit[0]]) {
                    nameSplit.unshift(EMPTY_STRING);
                }
                name = nameSplit.join('-');
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
                    prefixIndex = indexOf(knownPrefixes, '-' + currentCheck);
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
                    if (!isBlank(value)) {
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
        convertStyleValue = function (key, value_) {
            var value = value_;
            if (value === +value) {
                if (timeBasedCss[key]) {
                    value += 'ms';
                }
                if (!numberBasedCss[key]) {
                    value += 'px';
                }
            }
            return value;
        },
        style = function (els, key, value) {
            var ensuredDom;
            if (els[LENGTH]) {
                intendedObject(key, value, function (key, value_) {
                    var value = convertStyleValue(value_);
                    duff(els, ensureDOM(function (el) {
                        el[STYLE][key] = value;
                    }));
                });
            }
        },
        prefixer = function (obj) {
            var rez = css(obj, BOOLEAN_TRUE);
            return rez;
        },
        jsToCss = function (obj) {
            var nuObj = {};
            each(obj, function (key, val) {
                var deCameled = unCamelCase(key),
                    split = deCameled.split('-'),
                    starter = split[0],
                    idx = indexOf(knownPrefixes, '-' + starter + '-');
                if (idx !== -1) {
                    split[0] = '-' + starter;
                }
                nuObj[split.join('-')] = val;
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
                return val / getStyleSize(el, 'fontSize', win);
            },
            mm: function (val, el, win, styleAttr) {
                return val / 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                var mult = Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]);
                return (val / mult) * 100;
            },
            rem: function (val, el, win, styleAttr) {
                return val / getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], 'fontSize', win);
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
                return getStyleSize(el, 'fontSize') * val;
            },
            mm: function (val, el, win, styleAttr) {
                return val * 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                return ((Math.min(win[INNER_HEIGHT], win[INNER_WIDTH]) || 1) * val / 100);
            },
            rem: function (val, el, win, styleAttr) {
                return getStyleSize(win[DOCUMENT][BODY][PARENT_NODE], 'fontSize') * val;
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
        tagIs = function (el, str) {
            var tagName;
            if (el && isObject(el)) {
                tagName = el.tagName;
                if (isString(tagName)) {
                    return tagName.toLowerCase() === str.toLowerCase();
                }
            }
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
            var frame, div = createElement('div');
            div.innerHTML = str;
            frame = div.children[0];
            return $(frame);
        },
        makeTree = function (str) {
            var div = createElement('div');
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
                parent = createElement('div');
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
        /**
         * @private
         * @func
         */
        htmlTextManipulator = function (attr) {
            return function (str) {
                var dom = this,
                    nuStr = EMPTY_STRING;
                if (isString(str)) {
                    return dom.duff(function (el) {
                        el[attr] = str;
                    });
                } else {
                    dom.duff(function (el) {
                        nuStr += el[attr];
                    });
                    return nuStr;
                }
            };
        },
        horizontalTraverser = function (_idxChange) {
            return attachPrevious(function (idxChange) {
                var domm = this,
                    collected = [],
                    list = domm.unwrap();
                idxChange = _idxChange || idxChange;
                if (idxChange) {
                    duff(list, function (idx_, el) {
                        var parent = el[PARENT_NODE],
                            idx = (indexOf(parent.children, el) + idxChange),
                            item = parent.children[idx];
                        if (item && !posit(list, item)) {
                            add(collected, item);
                        }
                    });
                } else {
                    collected = list;
                }
                return collected;
            });
        },
        domAttrManipulator = function (fn, getData) {
            // cant wrap in each because need to return custom data
            return function (key, value) {
                var dataKeys = [],
                    dom = this,
                    ret = {},
                    count = 0,
                    cachedData = [],
                    domList = dom.unwrap();
                // moved to outside because iterating over objects is more
                // time consuming than iterating over a straight list
                intendedObject(key, value, function (__key, val) {
                    var __keys = gapSplit(__key);
                    dataKeys.push(__key);
                    duff(domList, function (el, idx) {
                        var data;
                        if (getData) {
                            data = cachedData[idx] = cachedData[idx] || elementData.get(el);
                        }
                        duff(__keys, function (_key) {
                            var value = fn(el, _key, val, data, dom);
                            if (value !== UNDEFINED) {
                                ret[_key] = value;
                                count++;
                            }
                        });
                    });
                });
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
                var obj = $(fn.apply(this, arguments));
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
            if (isString(args[0]) || isBlank(args[0])) {
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
            return !isString(evnt) ? evnt : {
                type: evnt,
                bubbles: BOOLEAN_FALSE,
                eventPhase: 2,
                cancelable: BOOLEAN_FALSE,
                defaultPrevented: BOOLEAN_FALSE,
                data: EMPTY_STRING,
                isTrusted: BOOLEAN_FALSE,
                timeStamp: now(),
                target: el
            };
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
        eventDispatcher = function (el, e, args, list) {
            var $el = DOMM(el);
            return find(list, function (obj) {
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
                    obj.fn.apply(ctx || $el, args);
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
        dispatchEvent = function (el, evnt_, capturing, data, args, selector) {
            var e, gah, list, capturingStack, events, stack, currentEventStack, selectorIsString, mainHandler, eventType, removeStack, $el, matches = 1,
                evnt = validateEvent(evnt_, el);
            if (!evnt || !evnt.type) {
                return;
            }
            capturing = !!capturing;
            if (!_.isObject(data)) {
                data = elementData.get(el);
            }
            events = data.events;
            capturingStack = events[capturing];
            if (!capturingStack) {
                return;
            }
            eventType = evnt.type;
            list = capturingStack[eventType];
            mainHandler = getMainHandler(data, eventType, capturing);
            if (!mainHandler) {
                return;
            }
            removeStack = mainHandler[REMOVE_QUEUE];
            e = new Event(evnt, el);
            args = [e].concat(args || []);
            wraptry(function () {
                eventDispatcher(el, e, args, list);
            }, function () {
                console.trace(e);
            });
            duffRev(removeStack, removeEventQueue);
            while (mainHandler[ADD_QUEUE][LENGTH]) {
                addEventQueue(mainHandler[ADD_QUEUE][0]);
                gah = mainHandler[ADD_QUEUE].shift();
            }
            e.isTrusted = BOOLEAN_FALSE;
            return e.returnValue;
        },
        matchesHandler = function (handler, obj) {
            return !handler || obj.fn === handler;
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
            if (!isFunction(callback)) {
                return dom;
            }
            dom.duff(function (el) {
                _addEventListener(el, name, namespace, selector, callback, capture);
            });
            return dom;
        }),
        eventToNamespace = function (evnt) {
            if (!isString(evnt)) {
                evnt = evnt.type;
            }
            evnt = evnt.split('.');
            var evntName = evnt.shift();
            return [evntName, evnt.sort().join('.')];
        },
        _addEventListener = function (el, types, namespace, selector, fn, capture) {
            var handleObj, eventHandler, data = elementData.get(el),
                handlers = data.handlers = data.handlers || {},
                events = data.events = data.events || {},
                capturehash = events[capture] = events[capture] || {};
            duff(gapSplit(types), eventExpander(function (name, passedName) {
                var attach, mainHandler, handlerKey = capture + ':' + name,
                    namespaceCache = capturehash[name] = capturehash[name] || [];
                mainHandler = handlers[handlerKey];
                if (!mainHandler) {
                    eventHandler = function (e) {
                        return dispatchEvent(this, e, capture, data);
                    };
                    handlers[handlerKey] = mainHandler = {
                        fn: eventHandler,
                        __delegateCount: 0,
                        addQueue: [],
                        removeQueue: [],
                        currentEvent: NULL,
                        capturing: capture
                    };
                    el.addEventListener(name, eventHandler, capture);
                }
                attach = find(namespaceCache, function (obj) {
                    // remove any duplicates
                    if (fn === obj.fn && obj.namespace === namespace && selector === obj.selector) {
                        return BOOLEAN_TRUE;
                    }
                });
                if (attach) {
                    return;
                }
                addEventQueue({
                    fn: fn,
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
        ensureHandlers = function (fn) {
            return function (name) {
                // var args = toArray(arguments);
                var args = [EMPTY_STRING, UNDEFINED, []],
                    origArgs = filter(arguments, negate(isBlank)),
                    argLen = origArgs[LENGTH];
                if (!isObject(name)) {
                    if (argLen === 1) {
                        args = [name, UNDEFINED, [UNDEFINED]];
                    }
                    if (argLen === 2) {
                        args = [name, UNDEFINED, arguments[1]];
                    }
                }
                if (argLen === 3) {
                    args = arguments;
                }
                return fn.apply(this, args);
            };
        },
        removeEventListener = ensureHandlers(expandEventListenerArguments(function (name, namespace, selector, handler, capture) {
            this.duff(function (el) {
                _removeEventListener(el, name, namespace, selector, handler, capture);
            });
        })),
        removeEvent = function (obj) {
            var mainHandler = obj.mainHandler;
            if (obj.selector) {
                mainHandler[DELEGATE_COUNT] = Math.max(mainHandler[DELEGATE_COUNT] - 1, 0);
            }
            _.remove(obj.list, obj);
        },
        _removeEventListener = function (el, name, namespace, selector, handler, capture) {
            var objs, vent, current, data = elementData.get(el),
                // currentStack = data[currentEventStackString],
                events = data.events,
                removeFromList = function (list, name) {
                    duffRev(list, function (obj) {
                        if ((!name || name === obj.name) && (!handler || obj.fn === handler) && (!namespace || obj.namespace === namespace) && (!selector || obj.selector === selector)) {
                            removeEventQueue(obj);
                        }
                    });
                };
            if (events) {
                objs = events[capture];
                if (name) {
                    // scan a select list
                    removeFromList(objs[name], name);
                } else {
                    // scan all of the lists
                    each(objs, removeFromList);
                }
            }
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
                    if (isBlank(evnt.which)) {
                        charCode = original.charCode;
                        evnt.which = !isBlank(charCode) ? charCode : original.keyCode;
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
                    if (isBlank(evnt.pageX) && !isBlank(original.clientX)) {
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
            make: function (evnt) {
                var doc, target, val, originalEvent = evnt.originalEvent,
                    // Create a writable copy of the event object and normalize some properties
                    i, prop, copy,
                    type = originalEvent.type,
                    fixHook = fixHooks.fixedHooks[type];
                if (!fixHook) {
                    fixHooks.fixedHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : rforceEvent.test(type) ? this.forceHooks : {};
                }
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
                i = copy[LENGTH];
                while (i--) {
                    prop = copy[i];
                    val = originalEvent[prop];
                    if (!isBlank(val)) {
                        evnt[prop] = val;
                    }
                }
                evnt.originalType = originalEvent.type;
                // Support: Cordova 2.5 (WebKit) (#13255)
                // All events should have a target; Cordova deviceready doesn't
                // ie also does not have a target... so use current target
                target = evnt.target || (evnt.view ? evnt.view.event.currentTarget : event.currentTarget);
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
                evnt.data = originalEvent.data || EMPTY_STRING;
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
        Event = factories.Model.extend('Event', {
            constructor: function (evnt, el) {
                var e = this;
                e.originalEvent = evnt;
                fixHooks.make(e);
                evnt.delegateTarget = el;
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
        domFilter = function (items, filtr) {
            var filter = createDomFilter(filtr);
            return _.filter(items, filter);
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
            var dom = this,
                matchers = [],
                passedString = isString(str);
            duff(dom.unwrap(), function (el) {
                if (passedString) {
                    duff(Sizzle(str, el), function (el) {
                        matchers.push(el);
                    });
                } else {
                    matchers.push(el);
                }
            });
            return matchers;
        }),
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
        DOMM = factories.DOMM = factories.Collection.extend('DOMM', extend({
            /**
             * @func
             * @name DOMM#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMM instance
             * @returns {DOMM} instance
             */
            constructor: function (str, ctx) {
                var i, els, handler, elsLen, $doc, docEl, docData, dom = this;
                dom.context = ctx || win[DOCUMENT];
                if (isFunction(str)) {
                    if (isDocument(ctx)) {
                        $doc = $(ctx);
                        docEl = $doc[INDEX]();
                        docData = elementData.get(docEl);
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
                Collection.constructor.call(dom, els);
                return dom;
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
                return fragment(el || (this && this[ITEMS]));
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
                    items = dom.unwrap(),
                    filter = createDomFilter(eq);
                return foldl(items, function (memo, el) {
                    return foldl(el.children || el.childNodes, function (memo, child, idx, children) {
                        if (filter(child, idx, children)) {
                            memo.push(child);
                        }
                        return memo;
                    }, memo);
                }, []);
            }),
            /**
             * @func
             * @name DOMM#offAll
             * @returns {DOMM} instance
             */
            wipeEvents: function () {
                return this.duff(function (el) {
                    var data = elementData.get(el);
                    each(data.handlers, function (key, fn, eH) {
                        var wasCapt, split = key.split(':');
                        eH[key] = UNDEFINED;
                        wasCapt = data.events[split[0]];
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
            dispatchEvent: cannotTrust(expandEventListenerArguments(eachProc(dispatchEvent))),
            /**
             * @func
             * @name DOMM#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMM} instance
             */
            once: expandEventListenerArguments(eachProc(function (el, types, namespace, selector, fn, capture) {
                var args = toArray(arguments);
                args[4] = once(function () {
                    _removeEventListener.apply(NULL, args);
                    return fn.apply(this, arguments);
                });
                _addEventListener.apply(NULL, args);
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
                if (isBlank(ret)) {
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
            height: dimFinder(HEIGHT, 'scrollHeight', 'innerHeight'),
            /**
             * @func
             * @name DOMM#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimFinder(WIDTH, 'scrollWidth', 'innerWidth'),
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
            data: domAttrManipulator(function (el, _key, val, data, dom) {
                var value, dataStr = 'data-',
                    sliced = _key.slice(0, 5),
                    key = _key;
                if (dataStr !== sliced) {
                    key = dataStr + _key;
                }
                key = unCamelCase(key);
                value = attributeInterface(el, key, val);
                if (value !== UNDEFINED) {
                    data.dataset[_key] = value;
                }
                return value;
            }, BOOLEAN_TRUE),
            /**
             * @func
             * @name DOMM#attr
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM|*} if multiple attributes were requested then a plain hash is returned, otherwise the DOMM instance is returned
             */
            attr: domAttrManipulator(function (el, _key, val, data, dom) {
                return attributeInterface(el, unCamelCase(_key), val);
            }),
            prop: domAttrManipulator(function (el, key, val, data, dom) {
                var value;
                if (isBlank(val)) {
                    value = el[key];
                    if (isBlank(value)) {
                        value = NULL;
                    }
                } else {
                    if (isBlank(val)) {
                        val = UNDEFINED;
                    }
                    el[key] = val;
                }
                return value;
            }),
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
            each: function (callback) {
                var domm = this;
                if (domm[LENGTH]()) {
                    callback = bind(callback, domm);
                    duff(domm[ITEMS], function (item_, index, all) {
                        var item = $([item_]);
                        callback(item, index, all);
                    });
                }
                return domm;
            },
            /**
             * @func
             * @name DOMM#addClass
             * @param {String|Array} add - space delimited string that separates classes to be added through the change class function
             * @returns {DOMM} instance
             */
            addClass: applyClass(addClass),
            /**
             * @func
             * @name DOMM#removeClass
             * @param {String|Array} remove - space delimited string that separates classes to be removed through the change class function
             * @returns {DOMM} instance
             */
            removeClass: applyClass(removeClass),
            /**
             * @func
             * @name DOMM#toggleClass
             * @params {String|Array} list - space delimited string that separates classes to be removed and added through the change class function
             * @returns {DOMM} instance
             */
            toggleClass: applyClass(toggleClass),
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
            changeClass: applyClass(changeClass),
            booleanClass: eachProc(function (el, add, remove) {
                if (add) {
                    add = remove;
                    remove = [];
                }
                changeClass(el, remove, add);
            }),
            /**
             * @func
             * @name DOMM#box
             * @param {Number} [num=0] - index to get the boxmodel of
             */
            box: function (num) {
                return box(this[INDEX](num), this.context);
            },
            flow: function (num) {
                return flow(this[index](num), this.context);
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
                var point, dom = this,
                    frag = fragment(els),
                    children = dom.children();
                if (!idx && !isNumber(idx)) {
                    point = {};
                }
                if (isNumber(idx)) {
                    point = children.eq(idx);
                }
                if (isString(idx)) {
                    point = dom.children().filter(idx);
                }
                if (isInstance(point, DOMM)) {
                    point = point[INDEX](0);
                }
                if (!_.isElement(point)) {
                    point = NULL;
                }
                dom.duff(function (el) {
                    el.insertBefore(frag, point);
                });
                return dom;
            },
            /**
             * @func
             * @name DOMM#remove
             * @returns {DOMM} instance
             */
            remove: eachProc(function (el) {
                var parent = el[PARENT_NODE];
                if (isObject(parent) && isFunction(parent.removeChild)) {
                    parent.removeChild(el);
                }
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
                            var win, found = 1;
                            if (isWindow(parent) && parent !== window[TOP]) {
                                if (parent.location.protocol.indexOf('http') === -1) {
                                    win = parent;
                                    found = 1;
                                    wraptry(function () {
                                        parent = win.frameElement;
                                        if (parent) {
                                            found = 0;
                                        }
                                    }, function () {
                                        found = 1;
                                    });
                                }
                            }
                            return [parent, (!found && parent)];
                        }
                    };
                return attachPrevious(function (original) {
                    var iterator, doDefault = 1,
                        collect = Collection();
                    if (isNumber(original)) {
                        iterator = number;
                    } else {
                        if (isString(original)) {
                            if (speshal[original]) {
                                iterator = speshal[original];
                            } else {
                                iterator = string;
                            }
                        } else {
                            if (original) {
                                doDefault = 0;
                            }
                        }
                    }
                    if (doDefault) {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        this.duff(finder(collect, iterator, original));
                    } else {
                        this.duff(finder(collect, function (el) {
                            return [el, original(el)];
                        }));
                    }
                    return collect[ITEMS];
                });
            }()),
            /**
             * @func
             * @name DOMM#has
             * @param {Node|Array} els - list of elements to check the current instance against
             * @returns {Boolean} whether or not the current domm element has all of the elements that were passed in
             */
            has: function (els) {
                var has = 0,
                    domm = this,
                    list = domm[ITEMS];
                if (_.isInstance(els, Collection)) {
                    els = els.unwrap();
                } else {
                    if (isElement(els)) {
                        els = [els];
                    }
                }
                if (els[LENGTH]) {
                    has = els[LENGTH];
                }
                find(els, function (el) {
                    if (domm.posit(el)) {
                        has--;
                    }
                });
                return has === 0 && els && els[LENGTH];
            },
            /**
             * @func
             * @name DOMM#indexOf
             * @param {Node|Array} el - element to check against the collection
             * @returns {Number} index of the element
             */
            indexOf: function (el, lookAfter) {
                if (isInstance(el, DOMM)) {
                    el = el[INDEX]();
                }
                return indexOf(this[ITEMS], el, lookAfter);
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
                            tag: node.localName
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
            }
        }, _.wrap({
            id: BOOLEAN_FALSE,
            src: BOOLEAN_FALSE,
            checked: BOOLEAN_FALSE,
            disabled: BOOLEAN_FALSE,
            tag: 'localName',
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
        Sizzle = function (str, ctx) {
            return (ctx || doc).querySelectorAll(str);
        },
        $;
    _.exports({
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
    });
    $ = _DOMM(doc);
    app.addModuleArgs([$]);
});