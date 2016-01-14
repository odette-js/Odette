application.scope().module('Node', function (module, app, _) {
    var blank, sizzleDoc = document,
        eq = _.eq,
        uniqueId = _.uniqueId,
        extendFrom = _.extendFrom,
        factories = _.factories,
        isFunction = _.isFunction,
        each = _.each,
        duff = _.duff,
        find = _.find,
        foldl = _.foldl,
        isString = _.isString,
        isObject = _.isObject,
        isNumber = _.isNumber,
        wrap = _.wrap,
        merge = _.merge,
        remove = _.splice,
        extend = _.extend,
        negate = _.negate,
        intendedObject = _.intendedObject,
        isInstance = _.isInstance,
        isBlank = _.isBlank,
        gapJoin = _.gapJoin,
        isArray = _.isArray,
        toArray = _.toArray,
        duffRev = _.duffRev,
        indexOf = _.indexOf,
        listHas = _.listHas,
        gapSplit = _.gapSplit,
        // dataCache = _.associator,
        camelCase = _.camelCase,
        unCamelCase = _.unCamelCase,
        objCondense = _.objCondense,
        parseDecimal = _.parseDecimal,
        LENGTH_STRING = 'length',
        itemsString = '_items',
        __delegateCountString = '__delegateCount',
        removeQueueString = 'removeQueue',
        addQueueString = 'addQueue',
        CLASSNAME = 'className',
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        getComputed = window.getComputedStyle,
        allStyles = getComputed(sizzleDoc.body),
        devicePixelRatio = (window.devicePixelRatio || 1),
        ua = navigator.userAgent,
        /**
         * @func
         */
        isAndroid = function () {
            return ua.match(/Android/i);
        },
        /**
         * @func
         */
        isBlackBerry = function () {
            return ua.match(/BlackBerry/i);
        },
        /**
         * @func
         */
        isIos = function () {
            return ua.match(/iPhone|iPad|iPod/i);
        },
        /**
         * @func
         */
        isOpera = function () {
            return ua.match(/Opera Mini/i);
        },
        /**
         * @func
         */
        isWindows = function () {
            return ua.match(/IEMobile/i);
        },
        /**
         * @func
         */
        // isTablet = function () {
        //     return ua.match(/Mobile|iPad|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/);
        // },
        rkeyEvent = /^key/,
        rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
        rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
        rforceEvent = /^webkitmouseforce/,
        /**
         * @func
         */
        isMobile = function () {
            return (isAndroid() || isBlackBerry() || isIos() || isOpera() || isWindows());
        },
        /**
         * @func
         */
        isTouch = function () {
            var ret = BOOLEAN_FALSE;
            if ('ontouchstart' in window || 'onmsgesturechange' in window) {
                ret = BOOLEAN_TRUE;
            }
            if (window.DocumentTouch) {
                ret = sizzleDoc instanceof window.DocumentTouch;
            }
            return ret;
        },
        hasWebP = (function () {
            var len = 4,
                result = BOOLEAN_TRUE,
                queue = [],
                emptyqueue = function (fn) {
                    return function () {
                        len--;
                        fn();
                        if (!len) {
                            duff(queue, function (item) {
                                item(result);
                            });
                            queue = [];
                        }
                    };
                };
            duff(["UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==", "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==", "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"], function (val) {
                var img = new Image();
                img.onload = emptyqueue(function () {
                    // is this code even doing anything?
                    // if (result && (img.width > 0) && (img.height > 0)) {
                    //     result = result;
                    // }
                });
                img.onerror = emptyqueue(function () {
                    result = false;
                });
                img.src = "data:image/webp;base64," + val;
            });
            return function (cb) {
                if (!len || !result) {
                    cb(result);
                } else {
                    queue.push(cb);
                }
            };
        }()),
        /**
         * @func
         */
        deviceCheck = _.wrap({
            isAndroid: isAndroid,
            isBlackBerry: isBlackBerry,
            isIos: isIos,
            isOpera: isOpera,
            isWindows: isWindows,
            isMobile: isMobile,
            isTouch: isTouch
        }, function (fn) {
            return !!(fn());
        }),
        saveDOMContentLoadedEvent = function (doc) {
            var data = elementData.get(doc);
            if (data.isReady === void 0) {
                data.isReady = BOOLEAN_FALSE;
                _.DOMM(doc).on('DOMContentLoaded', function (e) {
                    data.DOMContentLoadedEvent = e;
                    data.isReady = BOOLEAN_TRUE;
                });
            }
        },
        _DOMM = _.factories._DOMM = function (doc) {
            saveDOMContentLoadedEvent(doc);
            return function (sel, ctx) {
                return _.DOMM(sel, ctx || doc);
            };
        },
        setAttribute = function (el, key, val) {
            if (val === true) {
                val = '';
            }
            val = stringify(val);
            val += '';
            el.setAttribute(key, val);
        },
        getAttribute = function (el, key, val) {
            var converted;
            val = el.getAttribute(key);
            if (val === '') {
                val = BOOLEAN_TRUE;
            }
            if (isString(val)) {
                if (val[0] === '{' || val[0] === '[') {
                    val = JSON.parse(val);
                } else {
                    converted = +val;
                    if (converted === converted) {
                        val = converted;
                    } else {
                        // if for whatever reason you have a function
                        if (val[val.length - 1] === '}') {
                            if (val.slice(0, 8) === 'function') {
                                val = new Function.constructor('return ' + val);
                            }
                        }
                    }
                }
            } else {
                if (isBlank(val)) {
                    val = BOOLEAN_FALSE;
                }
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
            if (val !== blank) {
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
                className = getAttribute(el, 'class');
            }
            return (className || '').split(' ');
        },
        setClassName = function (el, key, val) {
            var value = val.join('');
            if (isString(el[CLASSNAME])) {
                el[CLASSNAME] = value;
            } else {
                setAttribute(el, 'class', value);
            }
        },
        queuedata = {
            className: app.module('Storage').message.request('make:list', {
                // storage: nodeData,
                name: CLASSNAME,
                get: getClassName,
                set: setClassName,
                key: function (item) {
                    return item;
                }
            }),
            data: app.module('Storage').message.request('make:nested', {
                // storage: nodeData,
                name: 'dataset',
                get: attributeInterface,
                set: attributeInterface,
                categoryKey: _.camelCase
            })
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
                    domm.duff(function (el) {
                        var whichever = api || attr;
                        if (isFunction(el[whichever])) {
                            el[whichever]();
                        } else {
                            $(el).dispatchEvent(whichever);
                        }
                    });
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
            duff(matches, function (idx, match) {
                var value;
                match = match.trim();
                value = match.match(/~*=[\'|\"](.*?)[\'|\"]/);
                name = match.match(/(.*)(?:~*=)/igm);
                name = _.join(_.split(name, '='), '').trim();
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
        // BeforeUnloadEvent = gapSplit(''),
        TimeEvent = gapSplit('beginEvent endEvent repeatEvent'),
        AnimationEvent = gapSplit('animationend animationiteration animationstart transitionend'),
        AudioProcessingEvent = gapSplit('audioprocess complete'),
        UIEvents = gapSplit('abort error hashchange load orientationchange readystatechange resize scroll select unload beforeunload'),
        ProgressEvent = gapSplit('abort error load loadend loadstart popstate progress timeout'),
        AllEvents = _.concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvent, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvent, TimeEvent, AnimationEvent, AudioProcessingEvent, UIEvents, ProgressEvent),
        knownPrefixes = gapSplit('-o- -ms- -moz- -webkit- mso- -xv- -atsc- -wap- -khtml- -apple- prince- -ah- -hp- -ro- -rim- -tc-'),
        trustedEvents = gapSplit('load scroll resize orientationchange click dblclick mousedown mouseup mouseover mouseout mouseenter mouseleave mousemove change contextmenu hashchange load mousewheel wheel readystatechange'),
        setClass = function (el, val) {
            if (isString(el.className)) {
                el.className = val;
            } else {
                el.setAttribute('class', val);
            }
        },
        knownPrefixesHash = _.wrap(knownPrefixes, true),
        /**
         * @private
         * @func
         */
        changeClass = function (el, remove, add) {
            var subdata = queuedata.className.get(el);
            queuedata.className.remove(el, remove, subdata);
            queuedata.className.add(el, add, subdata);
        },
        removeClass = function (el, remove) {
            var subdata = queuedata.className.get(el);
            queuedata.className.remove(el, remove, subdata);
        },
        addClass = function (el, add) {
            var subdata = queuedata.className.get(el);
            queuedata.className.add(el, add, subdata);
        },
        eventNameProperties = function (str) {},
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
                    nameSplit.unshift('');
                }
                name = nameSplit.join('-');
                cssString.push(name + ': ' + val + ';');
            });
            return cssString.join(' ');
        },
        // toCssObject = function () {},
        /**
         * @private
         * @func
         */
        isDom = function (el) {
            var hasAttr, retVal = BOOLEAN_FALSE;
            if (isObject(el)) {
                if (isObject(el.style)) {
                    if (isString(el.tagName)) {
                        if (isFunction(el.getBoundingClientRect)) {
                            retVal = BOOLEAN_TRUE;
                        }
                    }
                }
            }
            return retVal;
        },
        ensureDOM = function (fn) {
            return function (el) {
                if (isDom(el)) {
                    fn(el);
                }
            };
        },
        /**
         * @private
         * @func
         */
        // returns the flow of the element passed on relative to the element's bounding window
        position = function (el) {
            var clientRect = el.getBoundingClientRect(),
                computedStyle = getComputed(el),
                marginTop = parseFloat(computedStyle.marginTop),
                marginLeft = parseFloat(computedStyle.marginLeft),
                marginRight = parseFloat(computedStyle.marginRight),
                marginBottom = parseFloat(computedStyle.marginBottom);
            return {
                height: clientRect.height,
                width: clientRect.width,
                top: clientRect.top - marginTop,
                left: clientRect.left - marginLeft,
                right: clientRect.left - marginLeft + clientRect.width - marginRight,
                bottom: clientRect.top - marginTop + clientRect.height - marginBottom
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
                    if (!_.listHas(list, __prefix)) {
                        list.push(__prefix);
                    }
                };
            for (i = 0; i < knownPrefixes[LENGTH_STRING]; i++) {
                currentLen = knownPrefixes[i][LENGTH_STRING];
                if (len < currentLen) {
                    len = currentLen;
                }
            }
            for (n in allStyles) {
                found = 0;
                currentCheck = '';
                __prefix = '';
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
                        deprefixed = styleName.split(__prefix).join('');
                        found = 1;
                    }
                    prefixIndex = indexOf(knownPrefixes, '-' + currentCheck);
                    if (prefixIndex !== -1) {
                        __prefix = knownPrefixes[prefixIndex];
                        deprefixed = styleName.split(currentCheck).join('');
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
                if (isObject(el)) {
                    if (_.isBool(obj)) {
                        obj = el;
                        retObj = 1;
                    }
                    firstEl = el[0];
                    intendedObject(key, value, function (key, value) {
                        if (!isBlank(value)) {
                            count++;
                            prefixes = [''];
                            if (prefixed[m]) {
                                prefixes = prefixed[m].concat(prefixes);
                            }
                            for (j = 0; j < prefixes[LENGTH_STRING]; j++) {
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
                    if (isDom(el)) {
                        el = [el];
                    }
                    if (!count) {
                        if (isDom(firstEl)) {
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
            if (els[LENGTH_STRING]) {
                intendedObject(key, value, function (key, value_) {
                    var value = convertStyleValue(value_);
                    duff(els, ensureDOM(function (el) {
                        el.style[key] = value;
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
        box = function (el) {
            var computed, ret = {};
            if (isDom(el)) {
                computed = getComputed(el);
                ret = merge({
                    borderBottom: parseFloat(computed.borderBottomWidth) || 0,
                    borderRight: parseFloat(computed.borderRightWidth) || 0,
                    borderLeft: parseFloat(computed.borderLeftWidth) || 0,
                    borderTop: parseFloat(computed.borderTopWidth) || 0,
                    paddingBottom: parseFloat(computed.paddingBottom) || 0,
                    paddingRight: parseFloat(computed.paddingRight) || 0,
                    paddingLeft: parseFloat(computed.paddingLeft) || 0,
                    paddingTop: parseFloat(computed.paddingTop) || 0,
                    marginBottom: parseFloat(computed.marginBottom) || 0,
                    marginRight: parseFloat(computed.marginRight) || 0,
                    marginLeft: parseFloat(computed.marginLeft) || 0,
                    marginTop: parseFloat(computed.marginTop) || 0,
                    computedBottom: parseFloat(computed.bottom) || 0,
                    computedRight: parseFloat(computed.right) || 0,
                    computedLeft: parseFloat(computed.left) || 0,
                    computedTop: parseFloat(computed.top) || 0
                }, clientRect(el));
            }
            return ret;
        },
        clientRect = function (item) {
            var ret = {};
            if (item) {
                if (isDom(item) && item.parentNode) {
                    ret = item.getBoundingClientRect();
                }
            }
            return extend({
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: 0,
                height: 0
            }, ret);
        },
        /**
         * @private
         * @func
         */
        unitRemoval = function (str, unit) {
            return parseFloat(str.split(unit || 'px').join('').trim()) || 0;
        },
        /**
         * @private
         * @func
         */
        getStyleSize = function (el, attr) {
            var val, elStyle, num = el;
            if (isObject(el)) {
                if (isDom(el)) {
                    elStyle = getComputed(el);
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
        numToUnitsConverters = {
            'in': function (val, el, win, styleAttr) {
                return val / 96;
            },
            vh: function (val, el, win, styleAttr) {
                return (val / win.innerHeight) * 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val / 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return (val / win.innerWidth) * 100;
            },
            em: function (val, el, win, styleAttr) {
                return val / getStyleSize(el, 'fontSize');
            },
            mm: function (val, el, win, styleAttr) {
                return val / 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                var mult = Math.min(win.innerHeight, win.innerWidth);
                return (val / mult) * 100;
            },
            rem: function (val, el, win, styleAttr) {
                return val / getStyleSize(win.document.body.parentNode, 'fontSize');
            },
            pt: function (val, el, win, styleAttr) {
                return val / 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                var mult = Math.max(win.innerHeight, win.innerWidth);
                return (val / mult) * 100;
            },
            '%': function (val, el, win, styleAttr) {
                var parent = _.isDom(el) ? el.parentNode : el,
                    _val = getStyleSize(parent, styleAttr);
                return (val / _val) * 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val / 16;
            }
        },
        numToUnits = function (num, unit, el, winTop, styleAttr, returnNum) {
            var number = num;
            if (num) {
                number = numToUnitsConverters[unit](num, el, winTop, styleAttr);
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
        unitsToNumConverters = {
            // 'in'
            // vh
            // px
            // cm
            // vw
            // em
            // mm
            // vmin
            // rem
            // pt
            // vmax
            // '%'
            // pc
            'in': function (val, el, win, styleAttr) {
                return val * 96;
            },
            vh: function (val, el, win, styleAttr) {
                return win.innerHeight * val / 100;
            },
            px: function (val, el, win, styleAttr) {
                return val;
            },
            cm: function (val, el, win, styleAttr) {
                return val * 37.79527559055118;
            },
            vw: function (val, el, win, styleAttr) {
                return win.innerWidth * val / 100;
            },
            em: function (val, el, win, styleAttr) {
                return getStyleSize(el, 'fontSize') * val;
            },
            mm: function (val, el, win, styleAttr) {
                return val * 3.779527559055118;
            },
            vmin: function (val, el, win, styleAttr) {
                return ((Math.min(win.innerHeight, win.innerWidth) || 1) * val / 100);
            },
            rem: function (val, el, win, styleAttr) {
                return getStyleSize(win.document.body.parentNode, 'fontSize') * val;
            },
            pt: function (val, el, win, styleAttr) {
                return val * 1.333333333333333;
            },
            vmax: function (val, el, win, styleAttr) {
                return ((Math.max(win.innerHeight, win.innerWidth) || 1) * val / 100);
            },
            '%': function (val, el, win, styleAttr) {
                var parent = _.isDom(el) ? el.parentNode : el,
                    _val = getStyleSize(parent, styleAttr);
                return (val * _val) / 100;
            },
            pc: function (val, el, win, styleAttr) {
                return val * 16;
            }
        },
        unitsToNum = function (str, el, winTop, styleAttr) {
            var ret, number, unit = _.units(str);
            if (unit) {
                number = +(str.split(unit).join('')) || 0;
                if (unitsToNumConverters[unit]) {
                    number = unitsToNumConverters[unit](number, el, winTop, styleAttr) || 0;
                }
            } else {
                // you passed in a number
                number = str;
            }
            return number;
        },
        /**
         * @private
         * @func
         */
        containsClass = function (el, className) {
            var idxOf, original = getClass(el),
                nuClasses = gapSplit(className),
                nuClassesLen = nuClasses[LENGTH_STRING],
                i = 0,
                has = 0;
            for (; i < nuClassesLen; i++) {
                idxOf = indexOf(original, nuClasses[i]);
                if (idxOf !== -1) {
                    has++;
                }
            }
            return (has === nuClassesLen);
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
        isWin = function (obj) {
            return obj && obj === obj.window;
        },
        /**
         * @private
         * @func
         */
        isDoc = function (obj) {
            return obj && isNumber(obj.nodeType) && obj.nodeType === obj.DOCUMENT_NODE;
        },
        isFrag = function (frag) {
            return frag && frag.nodeType === sizzleDoc.DOCUMENT_FRAGMENT_NODE;
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
        createEl = function (str) {
            return sizzleDoc.createElement(str);
        },
        makeEmptyFrame = function (str) {
            var frame, div = createEl('div');
            div.innerHTML = str;
            frame = div.children[0];
            return $(frame);
        },
        makeTree = function (str) {
            var div = createEl('div');
            div.innerHTML = str;
            return $(div.children).remove().un();
        },
        /**
         * @private
         * @func
         */
        // makeScriptTag = function (src) {
        //     var scriptTag = createEl('script');
        //     scriptTag.type = 'text/javascript';
        //     scriptTag.src = src;
        //     return scriptTag;
        // },
        /**
         * @private
         * @func
         */
        matches = function (element, selector) {
            var match, parent, temp, matchesSelector;
            if (!selector || !element || element.nodeType !== 1) {
                return BOOLEAN_FALSE;
            }
            matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
            if (matchesSelector) {
                return matchesSelector.call(element, selector);
            }
            // fall back to performing a selector:
            parent = element.parentNode;
            temp = !parent;
            if (temp) {
                parent = createEl('div');
                parent.appendChild(element);
            }
            // temp && tempParent.removeChild(element);
            return !!_.posit(_.Sizzle(selector, parent), element);
        },
        setAttribute = function (el, key, val) {
            if (val === true) {
                val = '';
            }
            val = _.stringify(val);
            val += '';
            el.setAttribute(key, val);
        },
        getAttribute = function (el, key, val) {
            var converted;
            val = el.getAttribute(key);
            if (val === '') {
                val = BOOLEAN_TRUE;
            }
            if (isString(val)) {
                if (val[0] === '{' || val[0] === '[') {
                    val = JSON.parse(val);
                } else {
                    converted = +val;
                    if (converted === converted) {
                        val = converted;
                    } else {
                        // if for whatever reason you have a function
                        if (val[val.length - 1] === '}') {
                            if (val.slice(0, 8) === 'function') {
                                val = new Function.constructor('return ' + val);
                            }
                        }
                    }
                }
            } else {
                if (isBlank(val)) {
                    val = BOOLEAN_FALSE;
                }
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
            if (val !== blank) {
                if (!val && val !== 0) {
                    el.removeAttribute(key);
                } else {
                    setAttribute(el, key, val);
                }
            } else {
                return getAttribute(el, key, val);
            }
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
        /**
         * @private
         * @func
         */
        makeEl = function (tagName) {
            return $(foldl(gapSplit(tagName), function (memo, name) {
                memo.push(createEl(name));
                return memo;
            }, []));
        },
        createDocFrag = function () {
            return sizzleDoc.createDocumentFragment();
        },
        frag = function (el) {
            var frag = createDocFrag(),
                els = el[itemsString] || el;
            if (!_.isArrayLike(els)) {
                els = [els];
            }
            duff(els, function (el) {
                frag.appendChild(el);
            });
            return frag;
        },
        makeEls = function (arr, tag, style, props, attrs) {
            var frag = createDocFrag();
            map(arr, function (idx, str) {
                var div = createEl(tag || 'div');
                div.innerHTML = str;
                each(style, function (key, val) {
                    div.style[key] = val;
                });
                each(props, function (key, val) {
                    div[key] = val;
                });
                each(attrs, function (key, val) {
                    attributeInterface(div, key, val);
                });
                frag.appendChild(div);
            });
            return frag;
        },
        /**
         * @private
         * @func
         */
        htmlTextManipulator = function (attr) {
            return function (str) {
                var dom = this,
                    nuStr = '';
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
                    list = domm[itemsString];
                idxChange = _idxChange || idxChange;
                if (idxChange) {
                    duff(list, function (idx_, el) {
                        var parent = el.parentNode,
                            idx = (indexOf(parent.children, el) + idxChange),
                            item = parent.children[idx];
                        if (item && !_.listHas(list, item)) {
                            _.add(collected, item);
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
                    domList = dom.un();
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
                            if (value !== blank) {
                                ret[_key] = value;
                                count++;
                            }
                        });
                    });
                });
                if (dataKeys[LENGTH_STRING] === 1) {
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
                bottom = _clientRect.bottom,
                right = _clientRect.right,
                left = _clientRect.left,
                tippytop = _clientRect.top,
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
                x: clientRect.left + (clientRect.width / 2),
                y: clientRect.top + (clientRect.height / 2)
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
        flattenBlock = function (block, selector, spaced) {
            var children = [],
                _flat = {},
                flat = {};
            _.each(block, function (property, value) {
                var gah;
                if (_.isObject(value)) {
                    children.push(flattenBlock(value, selector + ' ' + property));
                } else {
                    flat[property] = value;
                }
            });
            _flat[selector] = flat;
            _flat = [_flat];
            return _flat.concat.apply(_flat, children);
        },
        buildBlocks = function (blocks) {
            var allBlocks = coll();
            _.each(blocks, function (block, selector) {
                allBlocks = allBlocks.concat(flattenBlock(block, selector));
            });
            return allBlocks;
        },
        stringifyPair = function (property, value) {
            return property + ':' + value + ';';
        },
        stringifyBlock = function (block, selector, opts) {
            var blockString = '' + selector + '{';
            opts = extend({
                line: '\n',
                tab: '\t',
                minify: 1
            }, opts || {});
            each(jsToCss(prefixer(block)), function (property, value) {
                if (_.isObject(value)) {
                    blockString += stringifyBlock(value, property, opts);
                } else {
                    blockString += stringifyPair(property, value);
                }
            });
            if (blockString[blockString[LENGTH_STRING] - 1] !== '{') {
                blockString += '}';
            } else {
                blockString = '';
            }
            return blockString;
        },
        buildStyles = function (obj, opts) {
            return coll(obj).foldl(function (memo, idx, item) {
                memo += buildBlocks(item).foldl(function (memo, idx, block) {
                    _.each(block, function (block, idx, selector) {
                        memo += stringifyBlock(block, selector, opts);
                    });
                    return memo;
                }, '');
                memo += '\n';
                return memo;
            }, '').split(' &').join('');
        },
        // parseEventName = function (name) {
        //     var ret = [
        //         [],
        //         []
        //     ];
        //     duff(gapSplit(name), function (nme) {
        //         var captures = BOOLEAN_FALSE;
        //         if (nme[0] === '_') {
        //             nme = nme.slice(1);
        //             captures = BOOLEAN_TRUE;
        //         }
        //         duff(gapSplit(eventExpander[nme] || nme), function (nm) {
        //             ret[0].push(nm);
        //             ret[1].push(captures);
        //         });
        //     });
        //     return ret;
        // },
        createSelector = function (domm, args, fn) {
            var fun, selector, name = args.shift();
            if (isString(args[0]) || isBlank(args[0])) {
                selector = args.shift();
            }
            // if (isFunction(args[0])) {
            //     args[0] = [args[0]];
            // }
            if (isFunction(args[0])) {
                fn = _.bind(fn, domm);
                fun = args[0];
                // duff(args[0], function (fun) {
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
                if (this.length()) {
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
            if (isString(evnt)) {
                evnt = {
                    type: evnt,
                    bubbles: BOOLEAN_FALSE,
                    eventPhase: 2,
                    cancelable: BOOLEAN_FALSE,
                    defaultPrevented: BOOLEAN_FALSE,
                    data: '',
                    isTrusted: BOOLEAN_FALSE,
                    timeStamp: _.nowish(),
                    target: el
                };
            }
            return evnt;
        },
        isCapturing = function (evnt) {
            var capturing = BOOLEAN_FALSE,
                eventPhase = evnt.eventPhase;
            if (eventPhase === 1) {
                capturing = BOOLEAN_TRUE;
            }
            if (eventPhase === 2 && !evnt.bubbles && isDom(evnt.srcElement)) {
                capturing = BOOLEAN_TRUE;
            }
            return capturing;
        },
        findMatch = function (el, target, selector) {
            var parent, found = null;
            if (selector && isString(selector)) {
                parent = target;
                while (parent && !found && isDom(parent) && parent !== el) {
                    if (matches(parent, selector)) {
                        found = parent;
                    }
                    parent = parent.parentNode;
                }
            }
            return found;
        },
        getMainHandler = function (data, name, capturing) {
            return data.handlers[capturing + ':' + name];
        },
        dispatchEvent = function (el, evnt, capturing, data, args, selector) {
            var e, gah, eventNameStack, capturingStack, events, stack, currentEventStack, selectorIsString, mainHandler, eventType, removeStack, $el, matches = 1;
            evnt = validateEvent(evnt, el);
            if (evnt && evnt.type) {
                capturing = !!capturing;
                if (!_.isObject(data)) {
                    data = elementData.get(el);
                }
                events = data.events;
                capturingStack = events[capturing];
                if (capturingStack) {
                    eventType = evnt.type;
                    eventNameStack = capturingStack[eventType];
                    // currentEventStack = data[currentEventStackString];
                    mainHandler = getMainHandler(data, eventType, capturing);
                    if (mainHandler) {
                        removeStack = mainHandler[removeQueueString];
                        $el = $(el);
                        e = new Event(evnt, el);
                        args = [e].concat(args || []);
                        // selectorIsString = isString(selector);
                        find(eventNameStack, function (obj) {
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
                                        mainHandler.currentEvent = null;
                                        return;
                                    }
                                }
                                // e.type = obj.passedName;
                                obj.fn.apply(ctx || $el, args);
                            }
                            if (!obj.persist) {
                                // puts it on the event queue
                                removeEventQueue(obj);
                            }
                            e.currentTarget = originalTarget;
                            mainHandler.currentEvent = null;
                            return e.isImmediatePropagationStopped;
                        });
                        duffRev(removeStack, removeEventQueue);
                        while (mainHandler[addQueueString].length) {
                            addEventQueue(mainHandler[addQueueString][0]);
                            gah = mainHandler[addQueueString].shift();
                        }
                    }
                }
            }
        },
        matchesHandler = function (handler, obj) {
            return !handler || obj.fn === handler;
        },
        _eventExpander = (function (__obj) {
            var obj = {};
            each(__obj, function (key, val, object) {
                obj[key] = gapSplit(val);
            });
            return obj;
        }({
            deviceorientation: 'deviceorientation mozOrientation',
            fullscreenalter: 'webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
            hover: 'mouseenter mouseleave',
            forcetouch: 'webkitmouseforcewillbegin webkitmouseforcedown webkitmouseforceup webkitmouseforcechanged'
        })),
        distilledEventName = (function () {
            var obj = {};
            each(_eventExpander, function (key, arr) {
                duff(arr, function (idx, item) {
                    obj[item] = key;
                });
            });
            return obj;
        }()),
        eventExpander = function (fn_) {
            return function (nme, idx) {
                var fn = _.bind(fn_, this);
                duff(gapSplit(_eventExpander[nme] || nme), function (name, idx) {
                    fn(name, nme);
                });
            };
        },
        addEventListener = expandEventListenerArguments(function (name, namespace, selector, callback, capture) {
            var dom = this;
            if (isFunction(callback)) {
                dom.duff(function (el) {
                    _addEventListener(el, name, namespace, selector, callback, capture);
                });
            }
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
                        currentEvent: null,
                        capturing: capture
                    };
                    el.addEventListener(name, eventHandler, capture);
                }
                attach = _.find(namespaceCache, function (obj) {
                    // remove any duplicates
                    if (fn === obj.fn && obj.namespace === namespace && selector === obj.selector) {
                        return true;
                    }
                });
                if (!attach) {
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
                }
            }));
        },
        addEventQueue = function (obj) {
            var mainHandler = obj.mainHandler,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (selector) {
                    obj.list.splice(mainHandler[__delegateCountString]++, 0, obj);
                } else {
                    obj.list.push(obj);
                }
            } else {
                mainHandler[addQueueString].push(obj);
            }
        },
        removeEventQueue = function (obj, idx) {
            var gah, mainHandler = obj.mainHandler,
                list = obj.list,
                selector = obj.selector;
            if (!mainHandler.currentEvent) {
                if (!obj.isDestroyed) {
                    obj.isDestroyed = true;
                    idx = idx === void 0 ? list.indexOf(obj) : idx;
                    if (idx + 1) {
                        if (selector) {
                            mainHandler[__delegateCountString]--;
                        }
                        gah = list.splice(idx, 1);
                    }
                    obj.list = null;
                }
            } else {
                if (obj.persist) {
                    mainHandler[removeQueueString].push(obj);
                }
            }
            obj.persist = BOOLEAN_FALSE;
        },
        ensureHandlers = function (fn) {
            return function (name) {
                // var args = toArray(arguments);
                var args = ['', blank, []],
                    origArgs = _.filter(arguments, negate(isBlank)),
                    argLen = origArgs.length;
                if (!isObject(name)) {
                    if (argLen === 1) {
                        args = [name, blank, [blank]];
                    }
                    if (argLen === 2) {
                        args = [name, blank, arguments[1]];
                    }
                }
                if (argLen === 3) {
                    args = arguments;
                }
                fn.apply(this, args);
            };
        },
        removeEventListener = ensureHandlers(expandEventListenerArguments(function (name, namespace, selector, handler, capture) {
            this.duff(function (idx, el) {
                _removeEventListener(el, name, namespace, selector, handler, capture);
            });
        })),
        removeEvent = function (obj) {
            var mainHandler = obj.mainHandler;
            if (obj.selector) {
                mainHandler[__delegateCountString] = Math.max(mainHandler[__delegateCountString] - 1, 0);
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
        coll = _.Collection,
        Collection = _.factories.Collection,
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
                        evntDoc = evnt.target.ownerDocument || sizzleDoc;
                        doc = evntDoc.documentElement;
                        body = evntDoc.body;
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
                    if (!evnt.which && button !== undefined) {
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
                i = copy.length;
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
                    target = evnt.target = sizzleDoc;
                }
                // Support: Safari 6.0+, Chrome<28
                // Target should not be a text node (#504, #13143)
                if (target.nodeType === 3) {
                    evnt.target = target.parentNode;
                }
                if (isFunction(fixHook.filter)) {
                    fixHook.filter(evnt, originalEvent);
                }
                evnt.type = distilledEventName[originalEvent.type] || originalEvent.type;
                evnt.data = originalEvent.data || '';
                evnt.isImmediatePropagationStopped = evnt.isPropagationStopped = evnt.isDefaultPrevented = BOOLEAN_FALSE;
                // special
                if (evnt.type === 'fullscreenchange') {
                    doc = evnt.target;
                    if (isWin(doc)) {
                        doc = doc.document;
                    } else {
                        while (doc && !isDoc(doc) && doc.parentNode) {
                            doc = doc.parentNode;
                        }
                    }
                    evnt.fullscreenDocument = doc;
                    if (isDoc(doc)) {
                        evnt.isFullScreen = (doc.fullScreen || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.fullscreenElement) ? true : false;
                    }
                }
                return evnt;
            }
        },
        Event = _.extendFrom.Model('Event', {
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
        createDomFilter = function (items, filtr) {
            var filter;
            if (isFunction(filtr)) {
                filter = filtr;
            } else {
                if (isObject(filtr)) {
                    if (isDom(filtr)) {
                        filter = function (el) {
                            return !!_.posit(items, el);
                        };
                    } else {
                        filter = _.matches(filtr);
                    }
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
                        }
                    }
                }
            }
            return filter;
        },
        domFilter = function (items, filtr) {
            var filter = createDomFilter(items, filtr);
            return _.filter(items, filter);
        },
        dimFinder = function (element, doc, win) {
            return function (num) {
                var ret, el = this.get(num);
                if (isDom(el)) {
                    ret = clientRect(el)[element];
                } else {
                    if (isDoc(el) && el.body) {
                        ret = el.body[doc];
                    } else {
                        if (isWin(el)) {
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
            duff(dom.un(), function (el) {
                if (passedString) {
                    duff(_.Sizzle(str, el), function (el) {
                        matchers.push(el);
                    });
                } else {
                    matchers.push(el);
                }
            });
            return matchers;
        }),
        canBeProcessed = function (item) {
            return isDom(item) || isWin(item) || isDoc(item) || isFrag(item);
        },
        DOMM = factories.DOMM = _.extendFrom.Collection('DOMM', extend({
            /**
             * @func
             * @name DOMM#constructor
             * @param {String|Node|Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMM instance
             * @returns {DOMM} instance
             */
            constructor: function (str, ctx) {
                var i, els, elsLen, $doc, docEl, docData, dom = this;
                if (isFunction(str)) {
                    if (_.isDoc(ctx)) {
                        $doc = $(ctx);
                        docEl = $doc.get();
                        docData = elementData.get(docEl);
                        if (docData.isReady) {
                            // make it async
                            setTimeout(function () {
                                str.apply($doc, [$, docData.DOMContentLoadedEvent]);
                            });
                            els = dom.un();
                        } else {
                            dom = $doc.on('DOMContentLoaded', function (e) {
                                _.unshift(args, $);
                                str.apply(this, args);
                            });
                            els = dom.un();
                        }
                    }
                } else {
                    if (isString(str)) {
                        if (str[0] === '<') {
                            els = makeTree(str);
                        } else {
                            els = _.Sizzle(str, ctx);
                        }
                    } else {
                        els = str;
                        if (canBeProcessed(els)) {
                            els = [els];
                        }
                    }
                }
                Collection.call(dom, els);
                return dom;
            },
            /**
             * @func
             * @name DOMM#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            isWin: function (num) {
                return isWin(this.index(num || 0) || {});
            },
            isDom: function (num) {
                return isDom(this.index(num || 0) || {});
            },
            /**
             * @func
             * @name DOMM#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            isDoc: function (num) {
                return isDoc(this.index(num || 0) || {});
            },
            isFrag: function (num) {
                return isFrag(this.index(num || 0) || {});
            },
            frag: function (el) {
                return _.frag(el || this[itemsString]);
            },
            /**
             * @func
             * @name DOMM#filter
             * @param {String|Function|Object} filtr - filter variable that will filter by matching the object that is passed in, or by selector if it is a string, or simply with a custom function
             * @returns {DOMM} new DOMM instance object
             */
            filter: attachPrevious(function (filter) {
                return domFilter(this.un(), filter);
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
                    items = dom.un(),
                    filter = createDomFilter(items, eq);
                return foldl(items, function (memo, el) {
                    return foldl(el.children || el.childNodes, function (memo, child, idx, children) {
                        if (!filter || filter(child, idx, children)) {
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
            offAll: function () {
                return this.duff(function (el) {
                    var data = elementData.get(el);
                    each(data.handlers, function (key, fn, eH) {
                        var wasCapt, split = key.split(':');
                        eH[key] = blank;
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
            dispatchEvent: expandEventListenerArguments(eachProc(dispatchEvent)),
            /**
             * @func
             * @name DOMM#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMM} instance
             */
            once: expandEventListenerArguments(eachProc(function (el, types, namespace, selector, fn, capture) {
                var args = toArray(arguments);
                args[4] = _.once(function () {
                    _removeEventListener.apply(null, args);
                    return fn.apply(this, arguments);
                });
                _addEventListener.apply(null, args);
            })),
            /**
             * @func
             * @name DOMM#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMM} instance
             */
            css: function (key, value) {
                var dom = this,
                    ret = css(dom[itemsString], key, value);
                if (isBlank(ret)) {
                    ret = dom;
                }
                return ret;
            },
            style: ensureOne(function (key, value) {
                style(this.un(), key, value);
                return this;
            }),
            /**
             * @func
             * @name DOMM#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allDom: function () {
                var count = 0,
                    length = this.length(),
                    result = length && find(this.un(), negate(isDom));
                return length && result === void 0;
            },
            /**
             * @func
             * @name DOMM#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimFinder('height', 'scrollHeight', 'innerHeight'),
            /**
             * @func
             * @name DOMM#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimFinder('width', 'scrollWidth', 'innerWidth'),
            /**
             * @func
             * @name DOMM#getStyle
             * @retuns {Object} the get computed result or a blank object if first or defined index is not a dom element and therefore cannot have a style associated with it
             */
            getStyle: function (eq) {
                var ret = {},
                    first = this.get();
                if (first && isDom(first)) {
                    ret = getComputed(first);
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
                if (value !== blank) {
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
                        value = null;
                    }
                } else {
                    if (isBlank(val)) {
                        val = blank;
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
                return eq(this.un(), num);
            }),
            /**
             * @func
             * @name DOMM#first
             * @returns {DOMM} instance
             */
            first: attachPrevious(function () {
                return eq(this.un(), 0);
            }),
            /**
             * @func
             * @name DOMM#last
             * @returns {DOMM} instance
             */
            last: attachPrevious(function () {
                return eq(this.un(), this.length() - 1);
            }),
            /**
             * @func
             * @name DOMM#clientRect
             * @param {Number} [num=0] - item who's bounding client rect will be assessed and extended
             * @returns {Object} hash of dimensional properties (getBoundingClientRect)
             */
            clientRect: function (num) {
                return clientRect(eq(this.un(), num)[0]);
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
                if (domm.length()) {
                    callback = _.bind(callback, domm);
                    duff(domm[itemsString], function (item_, index, all) {
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
            addClass: eachProc(function (el, add) {
                changeClass(el, 0, add);
            }),
            /**
             * @func
             * @name DOMM#removeClass
             * @param {String|Array} remove - space delimited string that separates classes to be removed through the change class function
             * @returns {DOMM} instance
             */
            removeClass: eachProc(function (el, remove) {
                changeClass(el, remove);
            }),
            /**
             * @func
             * @name DOMM#toggleClass
             * @params {String|Array} list - space delimited string that separates classes to be removed and added through the change class function
             * @returns {DOMM} instance
             */
            toggleClass: eachProc(function (el, list) {
                var add = [],
                    remove = [];
                duff(gapSplit(list), function (item) {
                    if (containsClass(el, item)) {
                        remove.push(item);
                    } else {
                        add.push(item);
                    }
                });
                changeClass(el, remove, add);
            }),
            /**
             * @func
             * @name DOMM#hasClass
             * @param {String|Array} list - space delimited string that each element is checked againsts to ensure that it has the classs
             * @returns {Boolean} do all of the elements in the collection have all of the classes listed
             */
            hasClass: function (clas) {
                var dom = this,
                    retVals = [],
                    countLen = [],
                    classes = gapSplit(clas);
                dom.duff(function (el) {
                    countLen.push(1);
                    if (containsClass(el, clas)) {
                        retVals.push(1);
                    }
                });
                return (dom.length() && countLen[LENGTH_STRING] === retVals[LENGTH_STRING]);
            },
            /**
             * @func
             * @name DOMM#changeClass
             * @param {String|Array} [remove] - removes space delimited list or array of classes
             * @param {String|Array} [add] - adds space delimited list or array of classes
             * @returns {DOMM} instance
             */
            changeClass: eachProc(changeClass),
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
                return box(this.get(num));
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
                el.style.display = 'none';
            })),
            /**
             * @func
             * @name DOMM#show
             */
            show: eachProc(ensureDOM(function (el) {
                el.style.display = 'block';
            })),
            /**
             * @func
             * @name DOMM#append
             */
            append: function (el) {
                var dom = this,
                    frag = _.frag(el);
                dom.duff(function (el) {
                    el.appendChild(frag);
                });
                return dom;
            },
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
                    frag = _.frag(els),
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
                    point = point.get(0);
                }
                if (!_.isDom(point)) {
                    point = null;
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
                var parent = el.parentNode;
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
                                rets = fn(parent.parentNode || parent.defaultView, original, next);
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
                            return [parent, isDoc(parent)];
                        },
                        window: function (parent, original, next) {
                            return [parent, isWin(parent)];
                        },
                        iframe: function (parent, original, next) {
                            var win, found = 1;
                            if (isWin(parent) && parent !== window.top) {
                                if (parent.location.protocol.indexOf('http') === -1) {
                                    win = parent;
                                    found = 1;
                                    try {
                                        parent = win.frameElement;
                                        if (parent) {
                                            found = 0;
                                        }
                                    } catch (e) {
                                        found = 1;
                                    }
                                }
                            }
                            return [parent, (!found && parent)];
                        }
                    };
                return attachPrevious(function (original) {
                    var iterator, doDefault = 1,
                        collect = coll();
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
                    return collect[itemsString];
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
                    list = domm[itemsString];
                if (_.isInstance(els, Collection)) {
                    els = els.un();
                } else {
                    if (isDom(els)) {
                        els = [els];
                    }
                }
                if (els[LENGTH_STRING]) {
                    has = els[LENGTH_STRING];
                }
                find(els, function (el) {
                    if (domm.posit(el)) {
                        has--;
                    }
                });
                return has === 0 && els && els[LENGTH_STRING];
            },
            /**
             * @func
             * @name DOMM#indexOf
             * @param {Node|Array} el - element to check against the collection
             * @returns {Number} index of the element
             */
            indexOf: function (el, lookAfter) {
                if (isInstance(el, DOMM)) {
                    el = el.get();
                }
                return indexOf(this[itemsString], el, lookAfter);
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
                    bottom: box.bottom - pB - bB,
                    height: box.height - pT - bT - pB - bB,
                    right: box.right - pR - bR,
                    width: box.width - pL - bL - pR - bR,
                    left: box.left + pL - bL,
                    top: box.top + pT - bT
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
                    height: box.height + mT + mB,
                    bottom: box.bottom + mB,
                    width: box.width + mR + mL,
                    right: box.right + mR,
                    left: box.left + mL,
                    top: box.top + mT
                };
            },
            /**
             * @func
             * @name DOMM#stopEvent
             */
            stopEvent: function (e, now) {
                e = _.Event(e);
                e.stopPropagation();
                e.preventDefault();
                if (!isBlank(e.cancelBubble)) {
                    e.cancelBubble = BOOLEAN_TRUE;
                }
                if (!isBlank(e.cancel)) {
                    e.cancel = BOOLEAN_TRUE;
                }
                if (now) {
                    e.stopImmediatePropagation();
                }
            },
            /**
             * @func
             * @name DOMM#childOf
             */
            childOf: function (oParent) {
                var domm = this,
                    _oParent = $(oParent),
                    children = domm.un();
                oParent = _oParent.un();
                return !!domm.length() && !!_oParent.length() && !find(oParent, function (_parent) {
                    return find(children, function (child) {
                        var parent = child,
                            finding = BOOLEAN_TRUE;
                        while (parent && finding) {
                            if (_parent === parent) {
                                finding = BOOLEAN_FALSE;
                            }
                            parent = parent.parentNode;
                        }
                        return finding;
                    });
                });
            },
            serialize: function () {
                var domm = this,
                    arr = [];
                domm.each(function (idx, $node) {
                    var node = $node.get(),
                        children = $node.children().serialize(),
                        obj = {
                            tag: node.localName
                        };
                    if (children.length) {
                        obj.children = children;
                    }
                    if (node.innerText) {
                        obj.innerText = node.innerText;
                    }
                    duff(node.attributes, function (idx, attr) {
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
            id: 0,
            src: 0,
            checked: 0,
            disabled: 0,
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
                item = this.get(str);
                if (item) {
                    return item[attr];
                }
            };
        }), _.wrap({
            play: 'playing',
            pause: 'paused'
        }, triggerEventWrapper), _.wrap(gapSplit('blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu'), function (attr) {
            return triggerEventWrapper(attr);
        })), BOOLEAN_TRUE),
        $ = _DOMM(sizzleDoc);
    app.addModuleArgs([$]);
    _.exports({
        covers: covers,
        center: center,
        closer: closer,
        distance: distance,
        css: css,
        box: box,
        frag: frag,
        isDom: isDom,
        isWin: isWin,
        isDoc: isDoc,
        isFrag: isFrag,
        device: deviceCheck,
        makeEl: makeEl,
        makeEls: makeEls,
        createDocFrag: createDocFrag,
        hasWebP: hasWebP,
        makeTree: makeTree,
        numToUnits: numToUnits,
        unitsToNumConverters: unitsToNumConverters,
        numToUnitsConverters: numToUnitsConverters,
        position: position,
        unitsToNum: unitsToNum,
        buildStyles: buildStyles,
        changeClass: changeClass,
        unitRemoval: unitRemoval,
        getStyleSize: getStyleSize,
        htmlDataMatch: htmlDataMatch,
        toStyleString: toStyleString,
        trustedEvents: trustedEvents,
        makeEmptyFrame: makeEmptyFrame,
        isTrustedEvent: isTrustedEvent,
        devicePxRatio: devicePixelRatio,
        setAttribute: setAttribute,
        getAttribute: getAttribute,
        attributeInterface: attributeInterface,
        attributeRegExpMaker: function (attr, regex) {
            var stringified = regex.toString(),
                converted = stringified.slice(1, stringified[LENGTH_STRING] - 1).replace(new RegExp('{{{}}}'), attr);
            return new RegExp(converted, 'mgi');
        },
        Sizzle: function (str, ctx) {
            return (ctx || sizzleDoc).querySelectorAll(str);
        },
        stashAttrs: function (el, extras) {
            var data = _.stashedAttrs(el);
            duff(gapSplit('id class maxWidth width minWidth maxHeight height minHeight style').concat(gapSplit(extras) || []), function (idx, attr) {
                if (!_.has(data.backup, attr)) {
                    data.stashedCount++;
                }
                data.backup[attr] = _.attributeInterface(el, unCamelCase(attr));
            });
        },
        stashedAttrs: function (el) {
            var obj = {},
                data = elementData.get(el);
            if (!data.backup) {
                data.backup = {};
            }
            if (!data.stashedCount) {
                data.stashedCount = 0;
            }
            return data;
        },
        resetAttrs: function (el) {
            var data = elementData.get(el);
            each(data.backup, function (key, val) {
                attributeInterface(el, unCamelCase(key), val);
            });
        },
        elementData: elementData,
        eventLists: {
            Event: Event,
            SVGEvent: SVGEvent,
            KeyboardEvent: KeyboardEvent,
            GamePadEvent: GamePadEvent,
            CompositionEvent: CompositionEvent,
            MouseEvents: MouseEvents,
            TouchEvents: TouchEvents,
            DeviceEvents: DeviceEvents,
            FocusEvent: FocusEvent,
            TimeEvent: TimeEvent,
            AnimationEvent: AnimationEvent,
            AudioProcessingEvent: AudioProcessingEvent,
            UIEvents: UIEvents,
            ProgressEvent: ProgressEvent,
            AllEvents: AllEvents
        }
    });
});