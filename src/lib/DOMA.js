var ATTACHED = 'attached',
    IFRAME = 'iframe';
app.scope(function (app) {
    var _ = app._,
        ATTRIBUTES = 'Attributes',
        factories = _.factories,
        Collection = factories.Collection,
        globalAssociator = factories.Associator(),
        DOM_MANAGER_STRING = 'DomManager',
        NODE_TYPE = 'nodeType',
        DESTROYED = 'destroyed',
        CUSTOM = 'custom',
        REMOVING = 'removing',
        ACCESSABLE = 'accessable',
        CUSTOM_LISTENER = CUSTOM + 'Listener',
        LOCAL_NAME = 'localName',
        UPPER_CHILD = 'Child',
        APPEND_CHILD = 'append' + UPPER_CHILD,
        REMOVE = 'remove',
        REMOVE_CHILD = REMOVE + UPPER_CHILD,
        PARENT_NODE = 'parentNode',
        HTML = 'html',
        INNER_HTML = 'innerHTML',
        TEXT = 'text',
        INNER_TEXT = 'innerText',
        OUTER_HTML = 'outerHTML',
        REGISTERED_AS = 'registeredAs',
        ATTRIBUTE_CHANGE = 'attributeChange',
        ATTRIBUTES_CHANGING = 'attributesChanging',
        DELEGATE_COUNT = 'delegateCount',
        CAPTURE_COUNT = 'captureCount',
        CUSTOM_KEY = DATA + HYPHEN + CUSTOM,
        CUSTOM_ATTRIBUTE = '[' + CUSTOM_KEY + ']',
        CLASS__NAME = (CLASS + HYPHEN + NAME),
        FONT_SIZE = 'fontSize',
        DEFAULT_VIEW = 'defaultView',
        IS_ELEMENT = 'isElement',
        DIV = 'div',
        devicePixelRatio = (win.devicePixelRatio || 1),
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
        noMatch = /(.)^/,
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
        escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '`': '&#x60;'
        },
        unescapeMap = invert(escapeMap),
        createEscaper = function (map) {
            var escaper = function (match) {
                return map[match];
            };
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
        templateGenerator = function (text, templateSettings) {
            var settings = extend({}, templateSettings);
            var matcher = RegExp([
                (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
            ].join('|') + '|$', 'g');
            var index = 0;
            var source = "__HTML__+='";
            text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
                source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
                index = offset + match[LENGTH];
                if (escape) {
                    source += "'+\n((__t=(this." + escape + "))==null?'':_.escape(__t))+\n'";
                } else if (interpolate) {
                    source += "'+\n((__t=(this." + interpolate + "))==null?'':__t)+\n'";
                } else if (evaluate) {
                    source += "';\n" + evaluate + "\n__HTML__+='";
                }
                // Adobe VMs need the match returned to produce the correct offset.
                return match;
            });
            source += "';\n";
            // If a variable is not specified, place data values in local scope.
            if (!settings.variable) {
                source = 'with(this||{}){\n' + source + '}\n';
            }
            source = "var __t,__HTML__='',__j=Array.prototype.join," + "print=function(){__HTML__+=__j.call(arguments,'');};\n" + source + 'return __HTML__;\n';
            var render = _.wraptry(function () {
                return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR(settings.variable || '_', source);
            });
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
            templates.keep(ID, id, templateHandler);
            return templateHandler;
        },
        isElement = function (object) {
            return !!(object && isNumber(object[NODE_TYPE]) && object[NODE_TYPE] === object.ELEMENT_NODE);
        },
        /**
         * @private
         * @func
         */
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
            return isWindow(windo) ? windo : (windo && windo[DEFAULT_VIEW] ? windo[DEFAULT_VIEW] : (windo.ownerGlobal ? windo.ownerGlobal : DOMA(windo).parent(WINDOW)[ITEM](0) || win));
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
        Image = win.Image,
        hasWebP = (function () {
            var countdown = 4,
                result = BOOLEAN_TRUE,
                queue = [],
                emptyqueue = function (handler) {
                    return function () {
                        countdown--;
                        handler();
                        if (countdown) {
                            return;
                        }
                        duff(queue, function (item) {
                            item(result);
                        });
                        queue = [];
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
        fetch = function (url, callback) {
            var img = new Image();
            url = stringifyQuery(url);
            if (callback) {
                img.onload = function () {
                    var list = toArray(arguments);
                    ARRAY_PROTOTYPE.unshift(list, url);
                    callback.apply(this, list);
                };
            }
            img.src = url;
            return img;
        },
        writeAttribute = function (el, key, val_) {
            if (val_ === BOOLEAN_FALSE || val_ == NULL) {
                removeAttribute(el, key);
            } else {
                el.setAttribute(key, (val_ === BOOLEAN_TRUE ? EMPTY_STRING : stringify(val_)) + EMPTY_STRING);
            }
        },
        readAttribute = function (el, key) {
            var coerced, val = el.getAttribute(key);
            return convertAttributeValue(val);
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
                stringManager.refill(toArray(value, SPACE));
            }
            return stringManager;
        },
        DO_NOT_TRUST = BOOLEAN_FALSE,
        // cannotTrust = function (fn) {
        //     return function () {
        //         var ret, cachedTrust = DO_NOT_TRUST;
        //         DO_NOT_TRUST = BOOLEAN_TRUE;
        //         ret = fn.apply(this, arguments);
        //         DO_NOT_TRUST = cachedTrust;
        //         return ret;
        //     };
        // },
        makeEachTrigger = function (attr, api) {
            var whichever = api || attr;
            return function (manager) {
                var el = manager.element();
                var ret, cachedTrust = DO_NOT_TRUST;
                DO_NOT_TRUST = BOOLEAN_TRUE;
                if (ALL_EVENTS_HASH[whichever] && isFunction(el[whichever])) {
                    el[whichever]();
                } else {
                    manager[DISPATCH_EVENT](whichever);
                }
                DO_NOT_TRUST = cachedTrust;
            };
        },
        triggerEventWrapper = function (attr_, api) {
            var attr = attr_ || api,
                eachHandler = makeEachTrigger(attr, api);
            return function (fn, fn2, capturing) {
                var doma = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    doma.on(attr, fn, fn2, capturing);
                } else {
                    doma.each(eachHandler);
                }
                return doma;
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
        Events = toArray('abort,afterprint,beforeprint,blocked,cached,canplay,canplaythrough,change,chargingchange,chargingtimechange,checking,close,complete,dischargingtimechange,DOMContentLoaded,downloading,durationchange,emptied,ended,error,fullscreenchange,fullscreenerror,input,invalid,languagechange,levelchange,loadeddata,loadedmetadata,message,noupdate,obsolete,offline,online,open,pagehide,pageshow,paste,pause,pointerlockchange,pointerlockerror,play,playing,ratechange,reset,seeked,seeking,stalled,storage,submit,success,suspend,timeupdate,updateready,upgradeneeded,versionchange,visibilitychange'),
        SVGEvent = toArray('SVGAbort,SVGError,SVGLoad,SVGResize,SVGScroll,SVGUnload,SVGZoom,volumechange,waiting'),
        KeyboardEvent = toArray('keydown,keypress,keyup'),
        GamePadEvent = toArray('gamepadconnected,gamepadisconnected'),
        CompositionEvent = toArray('compositionend,compositionstart,compositionupdate,drag,dragend,dragenter,dragleave,dragover,dragstart,drop'),
        MouseEvents = toArray('click,contextmenu,dblclick,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,show,wheel'),
        TouchEvents = toArray('touchcancel,touchend,touchenter,touchleave,touchmove,touchstart'),
        DeviceEvents = toArray('devicemotion,deviceorientation,deviceproximity,devicelight'),
        FocusEvent = toArray('blur,focus'),
        TimeEvent = toArray('beginEvent,endEvent,repeatEvent'),
        AnimationEvent = toArray('animationend,animationiteration,animationstart,transitionend'),
        AudioProcessingEvent = toArray('audioprocess,complete'),
        UIEvents = toArray('abort,error,hashchange,load,orientationchange,readystatechange,resize,scroll,select,unload,beforeunload'),
        ProgressEvent = toArray('abort,error,load,loadend,loadstart,popstate,progress,timeout'),
        AllEvents = concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvent, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvent, TimeEvent, AnimationEvent, AudioProcessingEvent, UIEvents, ProgressEvent),
        knownPrefixes = toArray('-o-,-ms-,-moz-,-webkit-,mso-,-xv-,-atsc-,-wap-,-khtml-,-apple-,prince-,-ah-,-hp-,-ro-,-rim-,-tc-'),
        validTagNames = toArray('a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rb,rp,rt,rtc,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'),
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
            var _attributeManager = getStringManager(manager, attribute);
            return _attributeManager.ensure(currentValue === BOOLEAN_TRUE ? EMPTY_STRING : currentValue, SPACE);
        },
        /**
         * @private
         * @func
         */
        // returns the flow of the element passed on relative to the element's bounding window
        flow = function (el, ctx) {
            var clientRect = el.getBoundingClientRect(),
                computedStyle = getComputed(el, ctx.element()),
                marginTop = unitRemoval(computedStyle.marginTop),
                marginLeft = unitRemoval(computedStyle.marginLeft),
                marginRight = unitRemoval(computedStyle.marginRight),
                marginBottom = unitRemoval(computedStyle.marginBottom);
            return {
                height: clientRect[HEIGHT] + marginTop + marginBottom,
                width: clientRect[WIDTH] + marginLeft + marginRight,
                top: clientRect[TOP] - marginTop,
                left: clientRect[LEFT] - marginLeft,
                right: clientRect[LEFT] + clientRect[WIDTH] + marginRight,
                bottom: clientRect[TOP] + clientRect[HEIGHT] + marginBottom
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
                    if (indexOf(list, __prefix) === -1) {
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
                unCamelCase(styleName);
                camelCase(styleName);
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
            var returnValue = isElement(item) ? item.getBoundingClientRect() : {};
            return {
                top: returnValue[TOP] || 0,
                left: returnValue[LEFT] || 0,
                right: returnValue[RIGHT] || 0,
                bottom: returnValue[BOTTOM] || 0,
                width: returnValue[WIDTH] || item.clientWidth || 0,
                height: returnValue[HEIGHT] || item.clientHeight || 0
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
            var tag;
            if (!el || !isElement(el)) {
                return BOOLEAN_FALSE;
            }
            tag = el[LOCAL_NAME].toLowerCase();
            return str ? tag === str.toLowerCase() : tag;
        },
        /**
         * @private
         * @func
         */
        elementTextOrComment = wrap([1, 3, 8], BOOLEAN_TRUE),
        // {
        //     '1': BOOLEAN_TRUE,
        //     '3': BOOLEAN_TRUE,
        //     '8': BOOLEAN_TRUE
        // },
        createElement = function (tag_, manager) {
            var confirmedObject, foundElement, elementName, newElement, newManager, documnt = manager && manager.element(),
                registeredElements = manager && manager.registeredElements,
                tag = tag_;
            if (isObject(tag)) {
                confirmedObject = BOOLEAN_TRUE;
                tag = tag.tagName;
                if (tag_.text) {
                    return makeText(tag_.content, manager);
                }
                if (tag_.comment) {
                    return makeComment(tag_.content, manager);
                }
            }
            foundElement = registeredElements && registeredElements[tag];
            elementName = foundElement === BOOLEAN_TRUE ? tag : foundElement;
            // native create
            if (!elementName) {
                exception({
                    message: 'custom tag names must be registered before they can be used'
                });
            }
            newElement = documnt.createElement(elementName);
            if (foundElement && foundElement !== BOOLEAN_TRUE) {
                attributeApi.write(newElement, CUSTOM_KEY, tag);
            }
            newManager = manager.returnsManager(newElement);
            if (!confirmedObject) {
                return newManager;
            }
            if (tag_.attributes) {
                newManager.attr(tag_.attributes);
            }
            if (!tag_.children) {
                return newManager;
            }
            if (isString(tag_.children)) {
                newManager.html(tag_.children);
            } else {
                newManager.append(reconstruct(tag_.children, manager));
            }
            return newManager;
        },
        makeText = function (content, manager) {
            return manager.element().createTextNode(content);
        },
        makeComment = function (content, manager) {
            return manager.element().createComment(content);
        },
        makeTree = function (str, manager) {
            var div = createElement(DIV, manager);
            // collect custom element
            div.html(str);
            return div.children().remove().unwrap();
        },
        makeBranch = function (str, manager) {
            return makeTree(str, manager)[0];
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
            return indexOf(query(selector, parent), element) !== -1;
        },
        createDocumentFragment = function (nulled, context) {
            return context.isDocument && context.element().createDocumentFragment();
        },
        /**
         * @private
         * @func
         */
        mappedConcat = function (context, handler, items) {
            var list = [];
            return list.concat.apply(list, items ? map(items, handler) : context.map(handler));
        },
        createElements = function (tagName, context) {
            return DOMA(foldl(toArray(tagName, SPACE), function (memo, name) {
                var createdElement = createElement(name, context);
                memo.push(createdElement);
                return memo;
            }, []), NULL, NULL, NULL, context);
        },
        fragment = function (els_, context) {
            var frag, els = els_;
            if (isFragment(els)) {
                frag = els;
            } else {
                if (DOMA.isInstance(els)) {
                    els = els.unwrap();
                }
                if (!isArrayLike(els)) {
                    els = els && toArray(els);
                }
                frag = context.createDocumentFragment();
                duff(els, function (manager_) {
                    var parentNode, manager = context.returnsManager(manager_),
                        el = manager.element();
                    if (!manager[IS_ELEMENT] || manager.isFragment) {
                        return;
                    }
                    parentNode = el[PARENT_NODE];
                    // we don't want to create a dom manager object if we're just checking the parentfffffffff
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
                return string !== UNDEFINED ? dom.eachCall(attr, string) && dom : dom.results(attr).join(EMPTY_STRING); //dom.map(getInnard.bind(NULL, attr)).join(EMPTY_STRING);
            };
        },
        horizontalTraverser = function (method, _idxChange) {
            return attachPrevious(function (context, idxChange_) {
                var collected = [],
                    list = context.unwrap(),
                    idxChange = _idxChange || idxChange_;
                if (idxChange) {
                    context.duff(function (manager) {
                        if ((traversal = manager[method](idxChange))) {
                            add(collected, traversal);
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
        styleAttributeManipulator = function (manager, key, value) {
            var element = manager.element();
            if (manager[IS_ELEMENT]) {
                if (value === BOOLEAN_TRUE) {
                    return element[STYLE][key];
                } else {
                    element[STYLE][key] = value;
                }
            }
        },
        // styleValueModifiers = {
        //     '-webkit-transform': function (val) {
        //         return val;
        //     }
        // },
        // modifyFinalStyle = function (prop, val) {
        //     if (styleValueModifiers[prop]) {
        //         val = styleValueModifiers[prop](val);
        //     }
        //     return val;
        // },
        // DomManagerRunsInstances = function (handler, key, value, list, hash, diffHandler, isProperty) {
        //     return function (manager) {
        //         return handler(manager, key, value, list, hash, diffHandler, isProperty);
        //     };
        // },
        // ManagerProducesKeyValues = function (context, list, hash, totalHandler, handler, isProperty) {
        //     return function (key, value) {
        //         DomManagerRunsInstances(totalHandler, key, value, list, hash, handler, isProperty)(context);
        //     };
        // },
        // DOMproducesKeyValues = function (context, list, hash, totalHandler, handler, isProperty) {
        //     return function (key, value) {
        //         context.duff(DomManagerRunsInstances(totalHandler, key, value, list, hash, handler, isProperty));
        //     };
        // },
        // domAttributeManipulator = function (totalHandler, innerHandler, isProperty) {
        //     return function (understandsContext) {
        //         return function (key, value) {
        //             var context = this,
        //                 hash = {},
        //                 list = [];
        //             intendedObject(key, value, understandsContext(context, list, hash, totalHandler, innerHandler, isProperty));
        //             return list[LENGTH] === 1 ? hash[list[0]] : context;
        //         };
        //     };
        // },
        attachPrevious = function (fn) {
            return function (one, two, three, four, five) {
                var prev = this,
                    // ensures it's still a dom object
                    result = fn(prev, one, two, three, four, five),
                    // don't know if we went up or down, so use null as context
                    obj = new DOMA[CONSTRUCTOR](result, NULL, BOOLEAN_TRUE, NULL, prev.context.owner);
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
        createSelector = function (doma, args, fn) {
            var fun, selector, capturing, group, name = args.shift();
            if (isString(args[0]) || args[0] == NULL) {
                selector = args.shift();
            }
            if (isString(args[0])) {
                args[0] = doma[args[0]];
            }
            if (!isFunction(args[0])) {
                return this;
            }
            fun = args.shift();
            capturing = args.shift();
            if (isString(capturing)) {
                group = capturing;
                capturing = BOOLEAN_FALSE;
            } else {
                capturing = !!capturing;
            }
            // that's all folks
            group = args.shift();
            fn(doma, name, selector, fun, capturing, group);
            return doma;
        },
        expandEventListenerArguments = function (fn) {
            return function () {
                var selector, doma = this,
                    args = toArray(arguments),
                    nameOrObject = args.shift();
                if (isObject(nameOrObject)) {
                    if (isString(args[0])) {
                        selector = args.shift();
                    }
                    each(nameOrObject, function (handler, key) {
                        createSelector(doma, [key, selector, handler].concat(args), fn);
                    });
                    return doma;
                } else {
                    args.unshift(nameOrObject);
                    return createSelector(doma, args, fn);
                }
            };
        },
        validateEvent = function (evnt, el, name_) {
            return evnt && isObject(evnt) && !isWindow(evnt) && isNumber(evnt.AT_TARGET) ? evnt : {
                data: stringify(evnt),
                type: name_,
                bubbles: BOOLEAN_FALSE,
                eventPhase: 2,
                cancelable: BOOLEAN_FALSE,
                defaultPrevented: BOOLEAN_FALSE,
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
            return capturing;
        },
        _eventExpander = wrap({
            resize: 'resize,orientationchange',
            ready: 'DOMContentLoaded',
            wheel: 'wheel,mousewheel',
            deviceorientation: 'deviceorientation,mozOrientation',
            fullscreenalter: 'webkitfullscreenchange,mozfullscreenchange,fullscreenchange,MSFullscreenChange',
            hover: 'mouseenter,mouseleave',
            forcewillbegin: 'mouseforcewillbegin,webkitmouseforcewillbegin',
            forcechange: 'mouseforcechange,webkitmouseforcechange',
            forcedown: 'mouseforcedown,webkitmouseforcedown',
            forceup: 'mouseforceup,webkitmouseforceup',
            force: 'mouseforcewillbegin,webkitmouseforcewillbegin,mouseforcechange,webkitmouseforcechange,mouseforcedown,webkitmouseforcedown,mouseforceup,webkitmouseforceup'
        }, toArray),
        distilledEventName = foldl(_eventExpander, function (memo, arr, key) {
            duff(arr, function (item) {
                memo[item] = key;
            });
            return memo;
        }, {}),
        eventExpander = function (expanders, fn, stack_) {
            var stack = stack_ || [];
            return function (nme) {
                var name = nme,
                    hadInList = indexOf(stack, name) !== -1;
                if (!hadInList) {
                    stack.push(name);
                }
                if (expanders[name] && !hadInList) {
                    duff(expanders[name], eventExpander(expanders, fn, stack));
                } else {
                    fn(name, stack[0], stack.slice(0));
                }
                if (!hadInList) {
                    stack.pop();
                }
            };
        },
        addEventListener = expandEventListenerArguments(function (manager, name, selector, callback, capture, group) {
            return isFunction(callback) ? _addEventListener(manager, name, group, selector, callback, capture) : manager;
        }),
        addEventListenerOnce = expandEventListenerArguments(function (manager, types, selector, callback, capture, group) {
            var _callback;
            return isFunction(callback) && _addEventListener(manager, types, group, selector, (_callback = once(function () {
                _removeEventListener(manager, types, group, selector, _callback, capture);
                return callback.apply(this, arguments);
            })), capture);
        }),
        removeEventListener = expandEventListenerArguments(function (manager, name, selector, handler, capture, group) {
            return isFunction(handler) ? _removeEventListener(manager, name, group, selector, handler, capture) : manager;
        }),
        _addEventListener = function (manager, eventNames, group, selector, handler, capture) {
            var events, wasCustom = manager.is(CUSTOM);
            duff(toArray(eventNames, SPACE), eventExpander(manager.owner.events.expanders, function (name, passedName, nameStack) {
                events = events || manager.directive(EVENTS);
                if (!ALL_EVENTS_HASH[name]) {
                    manager.mark(CUSTOM_LISTENER);
                }
                events.attach(name, {
                    capturing: !!capture,
                    origin: manager,
                    handler: handler,
                    group: group,
                    selector: selector,
                    passedName: passedName,
                    domName: name,
                    domTarget: manager,
                    nameStack: nameStack
                });
            }));
            if (!wasCustom && manager.is(CUSTOM_LISTENER)) {
                markCustom(manager, BOOLEAN_TRUE);
                manager.remark(ATTACHED, isAttached(manager.element(), manager.owner));
            }
            return manager;
        },
        eventToNamespace = function (evnt) {
            var evntName;
            if (!isString(evnt)) {
                evnt = evnt.type;
            }
            evnt = evnt.split(PERIOD);
            evntName = evnt.shift();
            return [evntName, evnt.sort().join(PERIOD)];
        },
        appendChild = function (el) {
            return this.insertAt(el, NULL);
        },
        prependChild = function (el) {
            return this.insertAt(el, 0);
        },
        insertBefore = function (els, index, clone) {
            var parent = this.parent();
            if (is.number(index)) {
                return this.insertAt(els, index);
            } else {
                return parent.insertAt(els, parent.children().indexOf(this));
            }
        },
        insertAfter = function (els, index, clone) {
            var parent = this.parent();
            if (is.number(index)) {
                return this.insertAt(els, index + 1);
            } else {
                return parent.insertAt(els, parent.children().indexOf(this) + 1);
            }
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
                if (windo.is(ACCESSABLE)) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    returnValue = doc.body ? doc.body[PARENT_NODE].outerHTML : EMPTY_STRING;
                }
            } else {
                if (manager[IS_ELEMENT]) {
                    parentElement = manager.element();
                    returnValue = parentElement[attribute];
                }
            }
            return returnValue;
        },
        setInnard = function (attribute, manager, value) {
            var owner, cachedValue, win, doc, windo, doTheThing, parentElement;
            if (manager.isIframe) {
                windo = manager.window();
                testIframe(manager);
                if (windo.is(ACCESSABLE)) {
                    parentElement = windo.element();
                    doc = parentElement[DOCUMENT];
                    doc.open();
                    doc.write(value);
                    doc.close();
                    doTheThing = BOOLEAN_TRUE;
                }
            } else {
                if (manager[IS_ELEMENT]) {
                    parentElement = manager.element();
                    cachedValue = parentElement[attribute];
                    parentElement[attribute] = value || EMPTY_STRING;
                    owner = manager.owner;
                    duff(owner.$(CUSTOM_ATTRIBUTE, parentElement), owner.returnsManager, owner);
                    if (cachedValue !== parentElement[attribute]) {
                        doTheThing = BOOLEAN_TRUE;
                    }
                }
            }
            if (doTheThing) {
                manager.bubble('content:changed', value);
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
            var contentWindow, contentWindowManager, element;
            manager.isIframe = manager.tagName === IFRAME;
            if (!manager.isIframe) {
                return;
            }
            element = manager.element();
            contentWindow = element.contentWindow;
            manager.remark('windowReady', !!contentWindow);
            if (!contentWindow) {
                return;
            }
            contentWindowManager = manager.owner.returnsManager(contentWindow);
            contentWindowManager.iframe = manager;
            markGlobal(contentWindowManager);
            if (!manager.cachedContent || !contentWindowManager.is(ACCESSABLE)) {
                return;
            }
            // must be string
            manager.html(manager.cachedContent);
            manager.cachedContent = NULL;
        },
        cachedDispatch = factories.Events[CONSTRUCTOR][PROTOTYPE][DISPATCH_EVENT],
        eventDispatcher = function (manager, name, e, capturing_) {
            var capturing = !!capturing_;
            return cachedDispatch.call(manager, name, validateEvent(e, manager.element(), name), {
                capturing: capturing
            });
        },
        directAttributes = {
            // id: BOOLEAN_FALSE,
            src: BOOLEAN_FALSE,
            checked: BOOLEAN_FALSE,
            disabled: BOOLEAN_FALSE,
            classes: CLASSNAME
        },
        videoDirectEvents = {
            play: 'playing',
            pause: 'paused'
        },
        directEvents = toArray('blur,focus,focusin,focusout,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error,contextmenu'),
        // collected here so DOMA can do what it wants
        allDirectMethods = directEvents.concat(_.keys(videoDirectEvents), _.keys(directAttributes)),
        isAttached = function (element_, owner) {
            var isAttachedResult, parent, potential, manager = owner.returnsManager(element_),
                element = manager.element();
            if ((isAttachedResult = manager.is(ATTACHED))) {
                return isAttachedResult;
            }
            if (manager.isWindow) {
                return BOOLEAN_TRUE;
            }
            while (!parent && element && element[PARENT_NODE]) {
                potential = element[PARENT_NODE];
                if (isFragment(potential)) {
                    return BOOLEAN_FALSE;
                }
                if (isDocument(potential)) {
                    return BOOLEAN_TRUE;
                }
                if (potential[__ELID__]) {
                    return isAttached(potential, owner);
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
                    var original = manager.is(ATTACHED);
                    manager.remark(ATTACHED, mark);
                    if (mark !== original && manager[IS_ELEMENT] && manager.is(CUSTOM_LISTENER)) {
                        managers.push(manager);
                    }
                });
                eachCall(managers, DISPATCH_EVENT, evnt);
            };
        },
        dispatchDetached = dispatchDomEvent('detach', BOOLEAN_FALSE),
        dispatchAttached = dispatchDomEvent('attach', BOOLEAN_TRUE),
        applyStyle = function (key, value, manager, important) {
            var newStyles, found, cached, element = manager.element();
            if (!manager[IS_ELEMENT] || (element[STYLE][key] === value && important)) {
                return BOOLEAN_FALSE;
            }
            cached = attributeApi.read(element, STYLE);
            value = value !== '' ? convertStyleValue(key, value) : value;
            if (!important) {
                duff(prefixedStyles[camelCase(key)], function (prefix) {
                    element[STYLE][prefix + unCamelCase(key)] = value;
                });
            } else {
                // write with importance
                attributeApi.write(element, STYLE, (newStyles = foldl(cached.split(';'), function (memo, item_, index, items) {
                    var item = item_.trim(),
                        itemSplit = item.split(COLON),
                        property = itemSplit[0].trim(),
                        setValue = itemSplit[1].trim();
                    if (property === key) {
                        found = BOOLEAN_TRUE;
                        setValue = value + ' !important';
                    }
                    memo.push([property, setValue].join(': '));
                    if (index === items[LENGTH] - 1 && !found) {
                        memo.push([key, value + ' !important'].join(': '));
                    }
                    return memo;
                }, []).join('; ')) ? newStyles + ';' : newStyles);
            }
            return attributeApi.read(element, STYLE) !== cached;
        },
        attributeValuesHash = {
            set: function (attributeManager, set, nulled, read) {
                attributeManager.refill(set === BOOLEAN_TRUE ? [] : set);
                if (set === BOOLEAN_FALSE) {
                    attributeManager.mark(REMOVING);
                }
            },
            add: function (attributeManager, add) {
                duff(add, attributeManager.add, attributeManager);
            },
            remove: function (attributeManager, remove) {
                duff(remove, attributeManager.remove, attributeManager);
            },
            toggle: function (attributeManager, togglers, direction) {
                duff(togglers, function (toggler) {
                    attributeManager.toggle(toggler, direction);
                });
            },
            change: function (attributeManager, remove, add) {
                this.remove(attributeManager, remove);
                this.add(attributeManager, toArray(add, SPACE));
            }
        },
        unmarkChange = function (fn) {
            return function (manager, idx) {
                var returnValue = fn(manager, idx);
                if (manager.is(ATTRIBUTES_CHANGING)) {
                    manager.unmark(ATTRIBUTES_CHANGING);
                    manager[DISPATCH_EVENT](ATTRIBUTE_CHANGE);
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
                var converted, generated, el = manager.element(),
                    read = api.read(el, unCamelCased),
                    returnValue = manager,
                    attributeManager = ensureManager(manager, unCamelCased, read);
                if (merge === 'get') {
                    if (!idx) {
                        returnValue = read;
                    }
                    return returnValue;
                }
                intendedObject(second_, third_, function (second, third) {
                    var currentMerge = merge || (third === BOOLEAN_TRUE ? 'add' : (third === BOOLEAN_FALSE ? REMOVE : 'toggle'));
                    attributeValuesHash[currentMerge](attributeManager, isString(second) ? second.split(SPACE) : second, third, read);
                });
                if (attributeManager.changeCounter) {
                    if (attributeManager.is(REMOVING)) {
                        attributeManager.unmark(REMOVING);
                        api.remove(el, unCamelCased);
                    } else {
                        generated = attributeManager.generate(SPACE);
                        api.write(el, unCamelCased, cautiousConvertValue(generated));
                    }
                }
                if (generated !== read && manager.is(CUSTOM_LISTENER)) {
                    manager.mark(ATTRIBUTES_CHANGING);
                    manager[DISPATCH_EVENT](ATTRIBUTE_CHANGE + COLON + trigger, {
                        previous: read,
                        current: convertAttributeValue(generated)
                    });
                }
            };
        },
        cautiousConvertValue = function (generated) {
            var converted = +generated;
            return generated[LENGTH] && converted == generated ? converted : generated;
        },
        convertAttributeValue = function (val_) {
            var val = val_;
            if (val === EMPTY_STRING) {
                return BOOLEAN_TRUE;
            } else {
                return val == NULL ? BOOLEAN_FALSE : cautiousConvertValue(val);
            }
        },
        domAttributeManipulatorExtended = function (proc, innerHandler, api) {
            return function (normalize) {
                return function (first, second, third, alternateApi, domHappy, trigger) {
                    return normalize(proc(first, second, third, alternateApi || api, domHappy, innerHandler, trigger), this);
                };
            };
        },
        hasAttributeValue = function (property, values_, third, api) {
            var values = toArray(values_, SPACE);
            return function (manager) {
                var el = manager.element(),
                    attributeManager = getStringManager(manager, property),
                    read = api.read(el, property);
                attributeManager.ensure(read, SPACE);
                return find(values, function (value) {
                    var stringInstance = attributeManager.get(ID, value);
                    return stringInstance ? !stringInstance.isValid() : BOOLEAN_TRUE;
                });
            };
        },
        setValue = domAttributeManipulatorExtended(queueAttributeValues, 'set', attributeApi),
        addValue = domAttributeManipulatorExtended(queueAttributeValues, 'add', attributeApi),
        removeValue = domAttributeManipulatorExtended(queueAttributeValues, REMOVE, attributeApi),
        toggleValue = domAttributeManipulatorExtended(queueAttributeValues, 'toggle', attributeApi),
        changeValue = domAttributeManipulatorExtended(queueAttributeValues, 'change', attributeApi),
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
                        context = context.item(0);
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
        propApi = getSetter(queueAttributeValues, propertyApi, camelCase),
        domFirst = function (handler, context) {
            var first = context.item(0);
            return first && handler(first, 0);
        },
        domIterates = function (handler, context) {
            context.each(handler);
            return context;
        },
        returnsFirst = function (fn, context) {
            return fn(context.item(), 0);
        },
        domContextFind = function (fn, context) {
            return !context.find(fn);
        },
        makeValueTarget = function (target, passed_, api, domaHappy) {
            var passed = passed_ || target;
            return _.foldl(toArray('add,remove,toggle,change,has,set'), function (memo, method_) {
                var method = method_ + 'Value';
                memo[method_ + capitalize(target)] = function (one, two) {
                    return this[method](passed, one, two, api, domaHappy, target);
                };
                return memo;
            }, {});
        },
        classApplicationWrapper = function (key, hasList, noList) {
            return function (element, list, second) {
                if (element.classList && element.classList[key]) {
                    return hasList(element, list, second);
                } else {
                    return noList(element, toArray(element[CLASSNAME], SPACE), list, second);
                }
            };
        },
        toggles = function (list, direction_, item) {
            var listIndex, direction = direction_;
            if (!item) {
                return;
            }
            if (direction == NULL) {
                listIndex = indexOf(list, item);
                direction = listIndex === -1;
            }
            listIndex = listIndex === UNDEFINED ? indexOf(list, item) : listIndex;
            if (direction) {
                if (listIndex === -1) {
                    list.push(item);
                }
            } else {
                if (listIndex !== -1) {
                    list.splice(listIndex, 1);
                }
            }
        },
        classApiShim = {
            add: classApplicationWrapper('add', function (element, list) {
                element.classList.add.apply(element.classList, list);
            }, function (element, current, list) {
                duff(list, passesFirstArgument(bind(add, NULL, current)));
            }),
            remove: classApplicationWrapper('remove', function (element, list) {
                element.classList.remove.apply(element.classList, list);
            }, function (element, current, list) {
                duff(list, passesFirstArgument(bind(remove, NULL, current)));
            }),
            // mess with toggle here so that you
            toggle: classApplicationWrapper('toggler', noop, function (element, current, list, direction) {
                duff(list, passesFirstArgument(bindWith(toggles, [NULL, current, direction])));
                element[CLASSNAME] = current.join(SPACE);
            }),
            contains: classApplicationWrapper('contains', function (element, list) {
                return !element.classList.contains.apply(element.classList, list);
            }, function (element, current, list) {
                return find(current, function (item) {
                    return !has(list, item, BOOLEAN_TRUE);
                });
            }),
            change: classApplicationWrapper('add', function (element, list, second) {
                element.classList.remove.apply(element.classList, list);
                element.classList.add.apply(element.classList, toArray(second, SPACE));
            }, function (element, current, list, second) {
                duff(list, passesFirstArgument(bind(remove, NULL, current)));
                duff(second, passesFirstArgument(bind(add, NULL, toArray(current, SPACE))));
            })
        },
        passer = function (key) {
            return function (a, b) {
                return function (manager) {
                    return classApiShim[key](manager.element(), a, b);
                };
            };
        },
        classApi = foldl(foldl(toArray('add,remove,toggle,change'), function (memo, key) {
            memo[key] = function (manipulator) {
                return function (classes, second) {
                    this.each(manipulator(toArray(classes, SPACE), second ? toArray(second, SPACE) : UNDEFINED));
                    return this;
                };
            };
            return memo;
        }, {
            has: function (manipulator) {
                return function (classes) {
                    return !this.find(manipulator(toArray(classes, SPACE)));
                };
            }
        }), function (memo, handler, key) {
            memo[key + 'Class'] = handler(passer(key === 'has' ? 'contains' : key));
            return memo;
        }, {}),
        markCustom = function (manager, forceCustom) {
            var resultant, isCustom, isCustomValue = manager[IS_ELEMENT] && attributeApi.read(manager.element(), CUSTOM_KEY);
            manager.remark(CUSTOM, forceCustom || !!isCustomValue);
            if (manager.is(CUSTOM) && !isCustomValue) {
                isCustomValue = BOOLEAN_TRUE;
            }
            resultant = manager[IS_ELEMENT] && writeAttribute(manager.element(), CUSTOM_KEY, isCustomValue);
            if (isCustomValue) {
                manager[REGISTERED_AS] = isCustomValue;
            }
        },
        markElement = function (manager) {
            var element;
            manager[IS_ELEMENT] = BOOLEAN_FALSE;
            manager.isIframe = BOOLEAN_FALSE;
            manager.tagName = BOOLEAN_FALSE;
            if (manager.isWindow) {
                return;
            }
            element = manager.element();
            if ((manager[IS_ELEMENT] = isElement(element))) {
                manager.tagName = tag(element);
                testIframe(manager);
                markCustom(manager);
            }
        },
        markGlobal = function (manager) {
            var isAccessable, element = manager.element();
            manager.isWindow = isWindow(element);
            if (!manager.isWindow || !manager.owner) {
                return;
            }
            manager.remark(ACCESSABLE, (isAccessable = !!wraptry(function () {
                return element[DOCUMENT];
            })));
            manager.isTop = !!(window && element === window.top);
            manager.setAddress();
            // either the window is null, (we're detached),
            // or it is an unfriendly window
            if (!isAccessable) {
                return;
            }
            if (manager.isTop) {
                // tests do never fail on top window because it always
                // exists otherwise this code would not run
                return;
            }
            // more accessable tests
            manager.remark(ACCESSABLE, manager.sameOrigin());
        },
        test = function (manager, owner) {
            var element = manager.element();
            markGlobal(manager);
            markElement(manager);
            manager.isDocument = BOOLEAN_FALSE;
            manager.isFragment = BOOLEAN_FALSE;
            manager.unmark(ATTACHED);
            if (manager.isWindow) {
                manager.mark(ATTACHED);
                return;
            }
            manager.isDocument = isDocument(element);
            manager.isFragment = isFragment(element);
            if (manager.isDocument || manager.isFragment) {
                manager.mark(ATTACHED);
                return;
            }
            manager.remark(ATTACHED, isAttached(manager, owner));
        },
        registeredElementName = function (name, manager) {
            return capitalize(ELEMENT) + HYPHEN + manager.documentId + HYPHEN + name;
        },
        iframeContent = function (head, body) {
            return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="user-scalable=no,width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' + head + '</head><body>' + body + '</body></html>';
        },
        filtersParentNotMe = function (parent) {
            return function (element) {
                return element[PARENT_NODE] === parent;
            };
        },
        query = function (str, ctx, manager) {
            var directSelector, elements, context = ctx || doc_,
                returnsArray = returns.first;
            if (str === 'body') {
                return [context.body];
            }
            if (str === 'head') {
                return [context.head];
            }
            if (manager && str[0] === '>') {
                directSelector = BOOLEAN_TRUE;
                str = manager.queryString() + str;
            }
            elements = context.querySelectorAll(str);
            if (directSelector) {
                return dataReconstructor(elements, filtersParentNotMe(context));
            } else {
                return toArray(returnsArray(elements));
            }
        },
        DOMA_SETUP = factories.DOMA_SETUP = function (doc_) {
            var registeredElements, $, setup, wrapped, manager = returnsManager(doc_, BOOLEAN_TRUE),
                unregisteredElements = factories.Registry(),
                expanders = parse(stringify(_eventExpander)),
                cachedMotionEvent, lastCalculatedMotionEvent = 0,
                cachedMotionCalculation = {},
                registeredConstructors = {},
                registeredElementOptions = {},
                defaultMotion = function () {
                    cachedMotionEvent = NULL;
                    return {
                        x: 0,
                        y: 0,
                        z: 0,
                        motionX: 0,
                        motionY: 0,
                        motionZ: 0,
                        interval: 1,
                        rotationRate: 0,
                        alpha: 0,
                        beta: 0,
                        gamma: 0,
                        absolute: 0
                    };
                };
            if (manager.documentId) {
                return manager.$;
            }
            registeredElements = clone(validTagsNamesHash);
            setup = function (e) {
                manager.DOMContentLoadedEvent = e;
                manager.mark('ready');
            };
            $ = function (sel, ctx) {
                var context = ctx || manager;
                return DOMA(sel, context, BOOLEAN_FALSE, manager === context, manager);
            };
            manager.documentId = manager.id = uniqueId('doc');
            wrapped = extend(wrap({
                $: $,
                makeTree: makeTree,
                makeBranch: makeBranch,
                createElements: createElements,
                createElement: createElement,
                createDocumentFragment: createDocumentFragment,
                registeredElementName: registeredElementName,
                fragment: function () {
                    return returnsManager(fragment(NULL, manager), manager);
                }
            }, function (handler) {
                return function (one) {
                    return handler(one, manager);
                };
            }), {
                events: {
                    custom: {},
                    expanders: {},
                    lists: wrap({
                        base: Events,
                        svg: SVGEvent,
                        keyboard: KeyboardEvent,
                        gamepad: GamePadEvent,
                        composition: CompositionEvent,
                        mouse: MouseEvents,
                        touch: TouchEvents,
                        device: DeviceEvents,
                        focus: FocusEvent,
                        time: TimeEvent,
                        animation: AnimationEvent,
                        audioProcessing: AudioProcessingEvent,
                        ui: UIEvents,
                        progress: ProgressEvent,
                        all: AllEvents
                    }, function (value, key) {
                        return parse(stringify(value));
                    })
                },
                supports: {},
                registeredConstructors: registeredConstructors,
                registeredElementOptions: registeredElementOptions,
                returnsManager: function (item) {
                    return item === manager || item === manager[TARGET] ? manager : returnsManager(item, manager);
                },
                // createElement: function (one, two, three) {
                //     return createElement(one, two, three, manager);
                // },
                expandEvent: function (passedEvent, actualEvent) {
                    var expanders = manager.events.expanders;
                    duff(toArray(actualEvent, SPACE), function (actualEvent) {
                        duff(toArray(passedEvent, SPACE), function (passedEvent) {
                            expanders[passedEvent] = expanders[passedEvent] || [];
                            if (indexOf(expanders[passedEvent], actualEvent) === -1) {
                                expanders[passedEvent].push(actualEvent);
                            }
                        });
                    });
                    return manager;
                },
                customEvent: function (key, value) {
                    duff(toArray(key, SPACE), function (key) {
                        manager.events.custom[key] = value;
                    });
                    return manager;
                },
                iframeContent: iframeContent,
                orderEventsByHeirarchy: BOOLEAN_TRUE,
                data: factories.Associator(),
                documentId: manager.documentId,
                document: manager,
                devicePixelRatio: devicePixelRatio,
                constructor: DOMA[CONSTRUCTOR],
                registeredElements: registeredElements,
                templateSettings: {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                },
                stashMotionEvent: function (evnt) {
                    cachedMotionEvent = evnt;
                },
                motion: function () {
                    var originalEvent, acc, acc_, someData;
                    if (!cachedMotionEvent) {
                        return defaultMotion();
                    }
                    if (lastCalculatedMotionEvent >= cachedMotionEvent.timestamp) {
                        return cachedMotionCalculation;
                    }
                    lastCalculatedMotionEvent = now();
                    originalEvent = cachedMotionEvent.originalEvent;
                    acc = originalEvent.acceleration || ((acc_ = originalEvent.accelerationIncludingGravity) && {
                        x: acc_.x - 9.81,
                        y: acc_.y - 9.81,
                        z: acc_.z - 9.81
                    });
                    if (acc && isNumber(acc.x)) {
                        cachedMotionCalculation.x = acc.x;
                        cachedMotionCalculation.y = acc.y;
                        cachedMotionCalculation.z = acc.z;
                        cachedMotionCalculation.interval = originalEvent.interval;
                        cachedMotionCalculation.rotationRate = originalEvent.rotationRate;
                        someData = BOOLEAN_TRUE;
                    }
                    if (originalEvent.alpha != NULL) {
                        cachedMotionCalculation.alpha = originalEvent.alpha;
                        cachedMotionCalculation.beta = originalEvent.beta;
                        cachedMotionCalculation.gamma = originalEvent.gamma;
                        cachedMotionCalculation.absolute = originalEvent.absolute;
                        someData = BOOLEAN_TRUE;
                    }
                    if (!someData) {
                        return defaultMotion();
                    }
                    return cachedMotionCalculation;
                },
                // shared across all documents running this version
                plugin: function (handler) {
                    plugins.push(handler);
                    duff(allSetups, function (setup) {
                        handler(setup);
                    });
                    return this;
                },
                compile: function (id, string) {
                    return compile(id, string, manager);
                },
                collectTemplates: function () {
                    return $('script[id]').each(function (script) {
                        compile(script.element().id, script.html(), manager);
                    }).remove();
                },
                unregisteredElement: function (manager) {
                    unregisteredElements.keep(manager.registeredElementName(), manager.id, manager);
                },
                registerElement: function (name, options_) {
                    var generatedTagName, creation, group, wasDefined, options = options_ || {},
                        lastKey = [],
                        extendss = options.extends,
                        events = options.events,
                        prototype = options[PROTOTYPE],
                        destruction = options.destruction,
                        newName = manager.registeredElementName(name);
                    if (registeredElements[name]) {
                        if (registeredElements[name] === BOOLEAN_TRUE) {
                            exception({
                                message: 'custom element names must not be used natively by browsers'
                            });
                        } else {
                            exception({
                                message: 'custom element names can only be registered once per document'
                            });
                        }
                    } else {
                        registeredElements[name] = extendss ? registeredElements[extendss] : DIV;
                    }
                    options.creation = (extendss ? _.flows(registeredElementOptions[extendss].creation, options.creation || noop) : options.creation) || noop;
                    registeredElementOptions[name] = options;
                    registeredConstructors[name] = (extendss ? (registeredConstructors[extendss] || DomManager) : DomManager).extend(capitalize(camelCase(name)), extend({}, prototype));
                    return registeredConstructors[name];
                }
            });
            extend(manager, wrapped);
            extend($, wrapped);
            runSupport(manager.supports, manager);
            setupDomContentLoaded(setup, manager);
            return $;
        },
        testWithHandler = function (win, evntname, handler, failure) {
            duff(toArray(evntname, SPACE), function (evntname) {
                if (win.addEventListener) {
                    win.addEventListener(evntname, handler);
                    win.removeEventListener(evntname, handler);
                } else {
                    handler(failure);
                }
            });
        },
        runSupport = function (supported, manager) {
            var windowManager = manager.window();
            var windowElement = windowManager.element();
            supported.deviceMotion = !!windowElement.DeviceMotionEvent;
            supported.deviceOrientation = !!windowElement.DeviceOrientationEvent;
            supported.motion = supported.deviceMotion || supported.deviceOrientation;
            testWithHandler(windowElement, 'deviceorientation devicemotion', function (e) {
                if (e.alpha === NULL) {
                    supported.motion = supported.deviceMotion = supported.deviceOrientation = BOOLEAN_FALSE;
                }
            }, {
                alpha: NULL
            });
        },
        styleManipulator = function (one, two) {
            var unCameled, styles, manager = this;
            if (!manager[LENGTH]()) {
                return manager;
            }
            if (isString(one) && two === UNDEFINED) {
                unCameled = unCamelCase(one);
                return (manager = manager.item(0)) && (styles = manager.getStyle()) && ((prefix = _.find(prefixedStyles[camelCase(one)], function (prefix) {
                    return styles[prefix + unCameled] !== UNDEFINED;
                })) ? styles[prefix + unCameled] : styles[prefix + unCameled]);
            } else {
                manager.each(unmarkChange(intendedIteration(one, two, applyStyle)));
                return manager;
            }
        },
        getValueCurried = getValue(returnsFirst),
        setValueCurried = setValue(domIterates),
        manager_query = function (selector) {
            var manager = this;
            var target = manager.element();
            return $(query(selector, target, manager), target);
        },
        isAppendable = function (els) {
            return els.isValidDomManager || isElement(els) || isFragment(els);
        },
        iframeChangeHandler = function () {
            testIframe(this);
        },
        childByTraversal = function (manager, parent, element, idxChange_, ask, isString) {
            var target, found,
                idxChange = idxChange_,
                children = collectChildren(parent),
                startIndex = indexOf(children, element);
            if (isString) {
                idxChange = idxChange || 1;
                target = element;
                while (target && !found) {
                    target = children[(startIndex = (startIndex += idxChange))];
                    found = matches(target, ask);
                }
            } else {
                target = element;
                target = children[startIndex];
                target = children[startIndex + idxChange];
            }
            return target && manager.owner.returnsManager(target);
        },
        managerHorizontalTraverser = function (method, property, _idxChange_) {
            return function (_idxChange) {
                var stringResult, direction = _idxChange_,
                    parent, children, currentIndex, startIndex, target, idxChange = _idxChange || _idxChange_,
                    manager = this,
                    element = manager.element(),
                    traversed = element[property];
                if (!(stringResult = isString(idxChange)) && property && !traversed) {
                    return manager.owner.returnsManager(traversed);
                }
                if (!(parent = element[PARENT_NODE]) && !traversed) {
                    return;
                }
                return childByTraversal(manager, parent, element, direction, idxChange, stringResult);
            };
        },
        collectCustom = function (manager, markedListener) {
            var element = manager.element();
            return (manager[IS_ELEMENT] && manager.is(markedListener ? CUSTOM_LISTENER : CUSTOM) ? [element] : []).concat(query(CUSTOM_ATTRIBUTE, element, manager));
        },
        reconstruct = function (string, context) {
            var fragment = context.createDocumentFragment();
            if (!string) {
                return fragment;
            }
            var objects = parse(string);
            var contextDocument = context.element();
            each(toArray(objects), function (object) {
                var element = contextDocument.createElement(object.tagName);
                var frag = reconstruct(object.children, context);
                element.appendChild(frag);
                each(object.attributes, function (value, key) {
                    attributeApi.write(element, unCamelCase(key), value);
                });
                fragment.appendChild(element);
            });
            return fragment;
        },
        IS_TRUSTED = 'isTrusted',
        FULLSCREEN = 'fullscreen',
        fixHooks = {
            // Includes some event props shared by KeyEvent and MouseEvent
            props: toArray("altKey,bubbles,cancelable,ctrlKey,currentTarget,eventPhase,metaKey,relatedTarget,shiftKey,target,timeStamp,view,which,x,y,deltaX,deltaY"),
            fixedHooks: {},
            keyHooks: {
                props: toArray("char,charCode,key,keyCode"),
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
                reaction: function (evnt) {
                    evnt.origin.owner.stashMotionEvent(evnt);
                }
            },
            mouseHooks: {
                props: toArray("button,buttons,clientX,clientY,offsetX,offsetY,pageX,pageY,screenX,screenY,toElement"),
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
            make: function (evnt, originalEvent, options) {
                var acc, acc_, doc, target, val, i, prop, copy, type = originalEvent.type,
                    // Create a writable copy of the event object and normalize some properties
                    fixHook = fixHooks.fixedHooks[type],
                    origin = options.origin;
                if (!fixHook) {
                    fixHooks.fixedHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : rforceEvent.test(type) ? this.forceHooks : motionMorph.test(type) ? this.motionHooks : {};
                }
                copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
                i = copy[LENGTH];
                duff(copy, function (prop) {
                    var val = originalEvent[prop];
                    if (val != NULL) {
                        evnt[prop] = val;
                    }
                });
                evnt.originalType = type;
                // Support: Cordova 2.5 (WebKit) (#13255)
                // All events should have a target; Cordova deviceready doesn't
                // ie also does not have a target... so use current target
                target = evnt.target || (evnt.view ? evnt.view.event.currentTarget : event && event.currentTarget) || evnt.delegateTarget.element();
                if (!target) {
                    target = evnt.target = doc;
                }
                // Support: Safari 6.0+, Chrome<28
                // Target should not be a text node (#504, #13143)
                if (target[NODE_TYPE] === 3) {
                    evnt.target = target[PARENT_NODE];
                }
                (fixHook.filter || noop)(evnt, originalEvent);
                type = distilledEventName[originalEvent.type] || originalEvent.type;
                cachedObjectEventConstructor.call(evnt, options.origin, parse(originalEvent.data), type, NULL, evnt.timeStamp);
                if (evnt.type === FULLSCREEN + CHANGE) {
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
                        evnt.remark(FULLSCREEN, (doc.fullScreen || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.fullscreenElement) ? BOOLEAN_TRUE : BOOLEAN_FALSE);
                    }
                }
                evnt[IS_TRUSTED] = _.has(originalEvent, IS_TRUSTED) ? originalEvent[IS_TRUSTED] : !DO_NOT_TRUST;
                (fixHook.reaction || noop)(evnt, originalEvent);
            }
        },
        cachedObjectEventConstructor = factories.ObjectEvent[CONSTRUCTOR],
        DomEvent = factories.DomEvent = factories.ObjectEvent.extend('DomEvent', {
            AT_TARGET: 1,
            constructor: function (evnt, opts) {
                var e = this;
                if (DomEvent.isInstance(evnt)) {
                    return evnt;
                }
                e.originalEvent = evnt;
                if (!has(evnt.target) || !has(evnt.currentTarget)) {
                    e.delegateTarget = opts.origin;
                } else {
                    e.delegateTarget = opts.origin.owner.returnsManager(opts.target);
                }
                fixHooks.make(e, evnt, opts);
                e.capturing = opts.capturing === UNDEFINED ? isCapturing(e) : opts.capturing;
                return e;
            },
            motion: function () {
                var acc, acc_, cached, evnt = this,
                    owner = evnt.origin.owner,
                    motion = owner.motion();
                return motion;
            },
            preventDefault: function () {
                var e = this.originalEvent;
                this[DEFAULT_PREVENTED] = BOOLEAN_TRUE;
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
            },
            stopPropagation: function () {
                var e = this.originalEvent;
                this[PROPAGATION_STOPPED] = BOOLEAN_TRUE;
                if (e && e.stopPropagation) {
                    e.stopPropagation();
                }
            },
            stopImmediatePropagation: function () {
                var e = this.originalEvent;
                this[IMMEDIATE_PROP_STOPPED] = BOOLEAN_TRUE;
                if (e && e.stopImmediatePropagation) {
                    e.stopImmediatePropagation();
                }
                this.stopPropagation();
            }
        }),
        removeEvent = function (evnt, name, mainHandler, capturing) {
            var el = evnt.origin.element();
            if (el.removeEventListener) {
                el.removeEventListener(name, mainHandler[capturing], capturing);
            } else {
                el.detachEvent(name, mainHandler[capturing]);
            }
            delete mainHandler[capturing];
        },
        DomEventsDirective = factories.EventsDirective.extend('DomEventsDirective', {
            remove: function (list, evnt) {
                var events = this,
                    elementHandlers = events.elementHandlers,
                    name = list.name,
                    mainHandler = elementHandlers[name],
                    capturing = mainHandler.capturing;
                list.remove(evnt);
                if (capturing) {
                    --mainHandler[CAPTURE_COUNT];
                    if (!mainHandler[CAPTURE_COUNT]) {
                        removeEvent(evnt, name, mainHandler, capturing);
                    }
                } else {
                    if (evnt.selector) {
                        mainHandler[DELEGATE_COUNT]--;
                    }
                    if (list[LENGTH]() === mainHandler[CAPTURE_COUNT]) {
                        removeEvent(evnt, name, mainHandler, capturing);
                    }
                }
            },
            add: function (list, evnt) {
                var foundDuplicate, delegateCount, obj, eventHandler, hadMainHandler, domTarget, events = this,
                    el = evnt.element,
                    i = 0,
                    // needs an extra hash to care for the actual event hanlders that get attached to dom
                    elementHandlers = events.elementHandlers = events.elementHandlers || {},
                    name = list.name,
                    mainHandler = elementHandlers[name],
                    capture = evnt.capturing,
                    items = list.unwrap(),
                    customEvents = evnt.origin.owner.events.custom;
                for (; i < items[LENGTH] && !foundDuplicate; i++) {
                    obj = items[i];
                    foundDuplicate = evnt.capturing === evnt.capturing && evnt.handler === obj.handler && obj.group === evnt.group && evnt.selector === obj.selector && evnt.passedName === obj.passedName;
                }
                if (foundDuplicate) {
                    return;
                }
                hadMainHandler = mainHandler;
                // brand new event stack
                if (!mainHandler) {
                    mainHandler = elementHandlers[name] = {
                        delegateCount: 0,
                        captureCount: 0,
                        events: events,
                        currentEvent: NULL,
                        capturing: capture
                    };
                }
                evnt.mainHandler = mainHandler;
                if (!mainHandler[capture]) {
                    // i don't have that handler attached to the dom yet
                    domTarget = evnt.domTarget;
                    eventHandler = mainHandler[capture] = function (e) {
                        return eventDispatcher(domTarget, e.type, e, capture);
                    };
                }
                if (evnt.capturing) {
                    list.insertAt(evnt, mainHandler[CAPTURE_COUNT]);
                    ++mainHandler[CAPTURE_COUNT];
                } else {
                    if (evnt.selector) {
                        delegateCount = mainHandler[DELEGATE_COUNT];
                        ++mainHandler[DELEGATE_COUNT];
                        if (delegateCount) {
                            list.insertAt(evnt, mainHandler[CAPTURE_COUNT] + delegateCount);
                        } else {
                            list.insertAt(evnt, mainHandler[CAPTURE_COUNT]);
                        }
                    } else {
                        list.unwrap().push(evnt);
                    }
                }
                duff(evnt.nameStack, function (name) {
                    evnt.fn = (customEvents[name] || returns.first)(evnt.fn, name, evnt) || evnt.fn;
                });
                if (eventHandler) {
                    el = evnt.origin.element();
                    if (el.addEventListener) {
                        el.addEventListener(evnt.domName, eventHandler, capture);
                    } else {
                        if (capture) {
                            return;
                        }
                        el.attachEvent(evnt.domName, eventHandler);
                    }
                }
            },
            create: function (origin, original, type, opts) {
                return DomEvent(original, {
                    target: origin.target,
                    origin: origin,
                    capturing: opts.capturing
                });
            },
            queue: function (stack, handler, evnt) {
                if (evnt[PROPAGATION_STOPPED] && evnt.currentTarget !== handler.temporaryTarget) {
                    evnt[PROPAGATION_HALTED] = BOOLEAN_TRUE;
                    return BOOLEAN_FALSE;
                }
                evnt.currentTarget = handler.temporaryTarget;
                handler.mainHandler.currentEvent = evnt;
                stack.push(handler);
                return BOOLEAN_TRUE;
            },
            unQueue: function (stack, handler, evnt) {
                evnt.currentTarget = handler.currentTarget = NULL;
                handler.mainHandler.currentEvent = NULL;
                stack.pop();
                return this;
            },
            cancelled: function (list_, evnt, last) {
                var mainHandler, delegateCount, first, events = this;
                if (!list_[LENGTH]()) {
                    return events;
                }
                first = list_.first();
                mainHandler = first.mainHandler;
                delegateCount = mainHandler[DELEGATE_COUNT];
                if (!delegateCount || delegateCount < last) {
                    return events;
                }
                while (last <= delegateCount) {
                    first = list_[last];
                    first.temporaryTarget = NULL;
                    ++last;
                }
                return events;
            },
            nextBubble: function (start, collected) {
                var parent, element = start.element();
                if (!start[IS_ELEMENT] || element[PARENT_NODE]) {
                    return BOOLEAN_FALSE;
                }
                return start.parent(function (element) {
                    if (element[__ELID__]) {
                        parent = start.owner.returnsManager(element);
                        if (parent.is(CUSTOM_LISTENER)) {
                            return [parent, BOOLEAN_TRUE];
                        }
                    }
                    return [element[PARENT_NODE], BOOLEAN_FALSE];
                });
            },
            subset: function (list_, evnt) {
                var parent, found, target, sumCount, element, counter, el, afterwards, selector, branch, first, mainHandler, delegateCount, captureCount, i = 0,
                    j = 0,
                    list = [],
                    manager = evnt.origin;
                if (!list_[LENGTH]) {
                    return [];
                }
                first = list_[0];
                mainHandler = first.mainHandler;
                captureCount = mainHandler[CAPTURE_COUNT];
                delegateCount = mainHandler[DELEGATE_COUNT];
                if (evnt.capturing) {
                    return list_.slice(0, captureCount);
                }
                // sumCount = delegateCount - captureCount;
                manager = evnt.origin;
                el = manager.element();
                // only take the target so we don't try to make managers for everyone
                target = evnt.target;
                // there are no delegated events, so just return everything after capture
                if (!delegateCount || evnt.target === el) {
                    return list_.slice(captureCount);
                }
                sumCount = captureCount + delegateCount;
                i = captureCount;
                afterwards = list_.slice(sumCount);
                while (i < sumCount) {
                    first = list_[i];
                    ++i;
                    selector = first.selector;
                    counter = -1;
                    parent = target;
                    while (!found && parent && isElement(parent) && parent !== el) {
                        ++counter;
                        if (matches(parent, selector)) {
                            found = parent;
                            // hold on to the temporary target
                            first.temporaryTarget = found;
                            // how far up did you have to go before you got to the top
                            first.parentNodeNumber = counter;
                            if (manager.owner.orderEventsByHeirarchy) {
                                if (!(j = list[LENGTH])) {
                                    list.push(first);
                                } else {
                                    while (first && list[--j]) {
                                        if (list[j].parentNodeNumber <= first.parentNodeNumber) {
                                            list.splice(j + 1, 0, first);
                                            first = NULL;
                                        }
                                    }
                                }
                            } else {
                                list.push(first);
                            }
                        }
                        parent = parent[PARENT_NODE];
                    }
                }
                return list.concat(afterwards);
            }
        }),
        windowIsVisible = function (windo_, perspective) {
            var notVisible = BOOLEAN_FALSE,
                windo = windo_;
            while (!windo.isTop && !notVisible) {
                windo = perspective.returnsManager(windo.element().parent);
                if (windo.iframe && windo.is(ACCESSABLE)) {
                    notVisible = !windo.iframe.visible();
                }
            }
            return !notVisible;
        },
        getStringManager = function (events, where) {
            var attrs = events.directive(ATTRIBUTES),
                found = attrs[where] = attrs[where] || StringManager();
            return found;
        },
        dimensionFinder = function (element, doc, win) {
            return function (num) {
                var ret, manager = this[ITEM](num);
                if (manager[IS_ELEMENT]) {
                    ret = clientRect(manager.element())[element];
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
        historyResult = app.extendDirective('Registry', 'History'),
        registerAs = function (manager, data, owner) {
            var historyDirective, name, Wrapper, registeredAs = manager[REGISTERED_AS];
            if (!manager.is(CUSTOM)) {
                return manager;
            }
            name = manager.owner.registeredElementName(registeredAs);
            Wrapper = manager.owner.registeredConstructors[registeredAs];
            if (!Wrapper) {
                exception({
                    message: 'custom elements must be registered before they can be used'
                });
            }
            manager = new Wrapper[CONSTRUCTOR](manager, data, owner);
            return manager;
        },
        removeHandler = function (fragment, handler) {
            var el, parent, manager = this,
                cachedRemoving = manager.is(REMOVING) || BOOLEAN_FALSE;
            if (cachedRemoving || !(el = manager.element()) || !(parent = el[PARENT_NODE])) {
                // can't remove because already removed
                return manager;
            }
            manager.mark(REMOVING);
            if (manager.isIframe && handler && isFunction(handler)) {
                manager.owner.window().element().setTimeout(bind(handler, NULL, manager));
            }
            if (fragment) {
                fragment.appendChild(el);
            } else {
                parent.removeChild(el);
            }
            dispatchDetached([el], manager.owner);
            manager.remark(REMOVING, cachedRemoving);
            return manager;
        },
        DomManager = factories.DomManager = factories.Events.extend(DOM_MANAGER_STRING, extend({}, classApi, {
            'directive:creation:EventManager': DomEventsDirective,
            isValidDomManager: BOOLEAN_TRUE,
            $: manager_query,
            querySelectorAll: manager_query,
            queryString: function () {
                var string = '';
                var json = this.toJSON(BOOLEAN_TRUE);
                var attributes = json.attributes;
                string += json.tagName;
                if (attributes.id) {
                    string += ('#' + attributes.id);
                }
                if (attributes[CLASS]) {
                    string += (PERIOD + attributes[CLASS].split(SPACE).join(PERIOD));
                }
                return string;
            },
            registeredElementName: function () {
                return this.owner.registeredElementName(this[REGISTERED_AS]);
            },
            // getValue: getValueCurried,
            hasValue: hasValue(domContextFind),
            addValue: addValue(domIterates),
            removeValue: removeValue(domIterates),
            toggleValue: toggleValue(domIterates),
            changeValue: changeValue(domIterates),
            on: addEventListener,
            once: addEventListenerOnce,
            off: removeEventListener,
            append: appendChild,
            appendChild: appendChild,
            prepend: prependChild,
            insertBefore: insertBefore,
            insertAfter: insertAfter,
            getAttribute: getValueCurried,
            setAttribute: setValueCurried,
            removeAttribute: attributeParody(REMOVE),
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            html: innardManipulator(INNER_HTML),
            // outerHTML: innardManipulator(OUTER_HTML),
            text: innardManipulator(INNER_TEXT),
            // style: styleManipulator,
            css: styleManipulator,
            next: managerHorizontalTraverser('next', 'nextElementSibling', 1),
            prev: managerHorizontalTraverser('prev', 'previousElementSibling', -1),
            skip: managerHorizontalTraverser('skip', NULL, 0),
            height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            siblings: function (filtr) {
                var original = this,
                    filter = createDomFilter(filtr);
                return original.parent().children(function (manager, index, list) {
                    return manager !== original && filter(manager, index, list);
                });
            },
            constructor: function (el, hash, owner_) {
                var registeredOptions, owner = owner_,
                    manager = this;
                if (DomManager.isInstance(el)) {
                    // extend what we already know
                    hash[DOM_MANAGER_STRING] = manager;
                    extend(manager, el);
                    // run it through it's scoped constructor
                    registeredOptions = owner.registeredElementOptions[manager[REGISTERED_AS]];
                    registeredOptions.creation.call(manager, manager);
                    manager.on(registeredOptions.events);
                    manager.on('destroy', registeredOptions.destruction);
                    return manager;
                }
                manager[TARGET] = el;
                test(manager, owner);
                if (manager[IS_ELEMENT] || manager.isFragment) {
                    hash[DOM_MANAGER_STRING] = manager;
                    owner = ensure(el.ownerDocument, BOOLEAN_TRUE);
                    if (manager[IS_ELEMENT]) {
                        manager.id = el[__ELID__];
                    }
                } else {
                    if (manager.isDocument) {
                        owner = manager;
                    } else {
                        hash[DOM_MANAGER_STRING] = manager;
                    }
                }
                manager.owner = owner || BOOLEAN_FALSE;
                if (manager.isIframe) {
                    manager.on(ATTRIBUTE_CHANGE + ':src detach attach', iframeChangeHandler);
                }
                if (manager.isWindow) {
                    markGlobal(manager);
                }
                if (manager[IS_ELEMENT]) {
                    if (manager[REGISTERED_AS] && manager[REGISTERED_AS] !== BOOLEAN_TRUE) {
                        wraptry(function () {
                            manager = registerAs(manager, hash, owner);
                        });
                    }
                    if (has(manager, REGISTERED_AS)) {
                        delete manager[REGISTERED_AS];
                    }
                }
                return manager;
            },
            clone: function () {
                var manager = this;
                if (!manager[IS_ELEMENT]) {
                    return {};
                }
                return makeBranch(manager.element()[OUTER_HTML], manager.owner);
            },
            element: function () {
                return this[TARGET];
            },
            elements: function () {
                return [this[TARGET]];
            },
            length: function () {
                return 1;
            },
            wrap: function (list) {
                return this.owner.$(list || this);
            },
            unwrap: function () {
                return [this];
            },
            parent: (function () {
                var finder = function (manager, fn, original) {
                        var rets, found, parentManager = manager,
                            parentElement = parentManager.element(),
                            next = original;
                        while (parentElement && !found) {
                            rets = fn(parentElement, original, next);
                            parentElement = rets[0];
                            found = rets[1];
                            next = rets[2];
                        }
                        if (found) {
                            return parentManager.owner.returnsManager(parentElement);
                        }
                    },
                    number = function (element, original, next) {
                        next -= 1;
                        if (next < 0 || !isFinite(next) || isNaN(next)) {
                            next = 0;
                        }
                        return [element[PARENT_NODE], !next, next];
                    },
                    string = function (element, original, next) {
                        var parent = element[PARENT_NODE];
                        return [parent, matches(parent, original)];
                    },
                    speshal = {
                        document: function (element, original, next) {
                            var parent = element[PARENT_NODE];
                            if (isDocument(parent)) {
                                return [parent, BOOLEAN_TRUE];
                            } else {
                                if (isElement(parent)) {
                                    return [parent[PARENT_NODE], BOOLEAN_FALSE];
                                } else {
                                    if (isFragment(parent)) {
                                        return [NULL, BOOLEAN_FALSE];
                                    }
                                }
                            }
                        },
                        window: function (element, original, next, origin) {
                            var parent, defaultView = element[DEFAULT_VIEW];
                            if (defaultView) {
                                return [defaultView, BOOLEAN_TRUE];
                            }
                            if ((parent = element[PARENT_NODE])) {
                                return [parent, BOOLEAN_FALSE];
                            } else {
                                return [BOOLEAN_FALSE, BOOLEAN_FALSE];
                            }
                        },
                        iframe: function (element, original, next) {
                            var found, parent = element,
                                elementIsWindow = isWindow(element);
                            if (elementIsWindow) {
                                if (parent === parent.top) {
                                    return [NULL, BOOLEAN_FALSE];
                                } else {
                                    found = wraptry(function () {
                                        return parent.frameElement;
                                    });
                                    return [found, !!found];
                                }
                            } else {
                                return [element[DEFAULT_VIEW]] || element[PARENT_NODE];
                            }
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
                        return finder(manager, original);
                    } else {
                        if (!iterator) {
                            iterator = number;
                            original = 1;
                        }
                        return finder(manager, iterator, original);
                    }
                };
            }()),
            contains: function (element_) {
                var managerElement, target, element = element_,
                    manager = this;
                if (isWindow(element)) {
                    return BOOLEAN_FALSE;
                }
                if (isString(element)) {
                    return !!query(element, manager.element(), manager)[LENGTH];
                }
                if (element.isValidDOMA) {
                    return !!element.find(manager.contains, manager);
                }
                target = manager.owner.returnsManager(element);
                if (target.isDocument) {
                    return target.window() === manager;
                }
                managerElement = manager.element();
                return !!target.parent(function (node) {
                    var parentNode = node[PARENT_NODE];
                    return [parentNode, parentNode === managerElement];
                });
            },
            insertAt: function (els, index) {
                var manager = this,
                    owner = manager.owner,
                    fragmentManager = isAppendable(els) ? owner.returnsManager(els) : owner.$(els).fragment(),
                    fragment = fragmentManager.element(),
                    children = index == NULL ? NULL : manager.children(),
                    child = children && children.item(index) || NULL,
                    element = child && child.element() || NULL,
                    managerElement = manager && manager.element(),
                    returns = fragmentManager.children(),
                    fragmentChildren = collectCustom(fragmentManager, BOOLEAN_TRUE),
                    detachNotify = dispatchDetached(fragmentChildren, owner),
                    returnValue = managerElement && managerElement.insertBefore(fragment, element),
                    notify = isAttached(managerElement, owner) && dispatchAttached(fragmentChildren, owner);
                return returns;
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
            setAddress: function (address) {
                var manager = this;
                address = manager.address = address || manager.address || uuid();
                return address;
            },
            emit: function (message_, referrer_, handler) {
                var message, post, windo = this.window(),
                    element = windo.element();
                if (windo.is(ACCESSABLE)) {
                    message = parse(message_);
                    if (handler) {
                        handler({
                            // this can be expanded a bit when you get some time
                            srcElement: element,
                            timeStamp: _.now(),
                            data: function () {
                                return message;
                            }
                        });
                        return this;
                    }
                }
                wraptry(function () {
                    // do not parse message so it can be sent as is
                    if (!referrer_) {
                        console.error('missing referrer: ' + windo.address);
                    } else {
                        element.postMessage(message_, referrer_);
                    }
                });
                return this;
            },
            sameOrigin: function () {
                var parsedReference, manager = this,
                    element = manager.element(),
                    windo = manager.owner.window(),
                    windoElement = windo.element();
                if (windo === manager) {
                    return BOOLEAN_TRUE;
                }
                if (manager.is(ACCESSABLE)) {
                    parsedReference = reference(element[LOCATION].href);
                    if (!parsedReference && manager.iframe) {
                        parsedReference = reference(manager.iframe.src());
                    }
                    return !parsedReference || parsedReference === reference(windoElement[LOCATION].href);
                }
                return BOOLEAN_FALSE;
            },
            children: function (eq, memo) {
                var filter, result, manager = this,
                    children = collectChildren(manager.element());
                if (eq === UNDEFINED) {
                    return memo ? ((children = map(children, manager.owner.returnsManager, manager.owner)) && memo.isFragment ? memo.append(children) : (memo.push.apply(memo, children) ? memo : memo)) : manager.wrap(children);
                } else {
                    filter = createDomFilter(eq);
                    result = foldl(children, function (memo, child, idx, children) {
                        if (filter(child, idx, children)) {
                            memo.push(manager.owner.returnsManager(child));
                        }
                        return memo;
                    }, memo || []);
                }
                return memo ? result : manager.wrap(result);
            },
            visible: function () {
                var client, element, styles, owner, windo, windoElement, innerHeight, innerWidth, manager = this;
                if (!manager.is(ATTACHED)) {
                    return BOOLEAN_FALSE;
                }
                styles = manager.getStyle();
                if (+styles.opacity === 0 || styles.display === NONE || styles[HEIGHT] === ZERO_PIXELS || styles[WIDTH] === ZERO_PIXELS || styles.visibility === HIDDEN) {
                    return BOOLEAN_FALSE;
                }
                element = manager.element();
                client = element.getBoundingClientRect();
                if (!client[HEIGHT] || !client[WIDTH]) {
                    return BOOLEAN_FALSE;
                }
                windoElement = (manager.element().ownerDocument || {}).defaultView;
                if (!windoElement) {
                    return BOOLEAN_TRUE;
                }
                innerHeight = windoElement[INNER_HEIGHT];
                innerWidth = windoElement[INNER_WIDTH];
                if (innerHeight < client.top || innerWidth < client.left || client.right < 0 || client.bottom < 0) {
                    return BOOLEAN_FALSE;
                }
                windo = manager.owner.returnsManager(windoElement);
                return windo.isTop ? BOOLEAN_TRUE : windowIsVisible(windo, manager.owner);
            },
            hide: function () {
                return this.applyStyle(DISPLAY, NONE);
            },
            show: function () {
                return this.applyStyle(DISPLAY, 'block');
            },
            applyStyle: function (key, value, important) {
                applyStyle(key, value, this, important);
                return this;
            },
            getStyle: function (eq) {
                var returnValue = {},
                    manager = this,
                    first = manager.element();
                if (first && manager[IS_ELEMENT]) {
                    returnValue = getComputed(first, manager.owner.element());
                }
                return returnValue;
            },
            remove: removeHandler,
            removeChild: removeHandler,
            frame: function (head, body, passedContent) {
                var manager = this,
                    content = head || '';
                if (!passedContent && (body || content.slice(0, 10).toLowerCase() !== '<!doctype ')) {
                    content = manager.owner.iframeContent(content, body);
                }
                if (manager.isIframe) {
                    if (manager.is(ATTACHED)) {
                        manager.html(content);
                    } else {
                        manager.cachedContent = content;
                    }
                    return manager;
                } else {
                    return manager;
                }
            },
            // rework how to destroy elements
            destroy: function (handler) {
                var customName, manager = this,
                    registeredAs = manager[REGISTERED_AS],
                    element = manager.element();
                if (manager.is(DESTROYED)) {
                    return manager;
                }
                manager.mark(DESTROYED);
                if (manager.isIframe) {
                    manager.owner.data.remove(element.contentWindow);
                }
                manager.remove(NULL, handler);
                if (registeredAs) {
                    customName = manager.owner.registeredElementName(registeredAs);
                    manager.directiveDestruction(customName);
                }
                manager[DISPATCH_EVENT](DESTROY);
                // destroy events
                manager.directiveDestruction(EVENTS);
                // remove from global hash
                manager.owner.data.remove(element);
                manager[STOP_LISTENING]();
                return manager;
            },
            item: function () {
                return this;
            },
            each: function (fn, ctx) {
                var manager = this,
                    wrapped = [manager],
                    result = ctx ? fn.call(ctx, manager, 0, wrapped) : fn(manager, 0, wrapped);
                return wrapped;
            },
            find: function (fn) {
                var manager = this;
                return fn(manager, 0, [manager]) ? manager : UNDEFINED;
            },
            client: function () {
                return clientRect(this.element());
            },
            box: function (context) {
                return box(this.element(), context);
            },
            flow: function (context) {
                return flow(this.element(), context);
            },
            dispatchEvent: function (name, e, capturing_) {
                var ret, cachedTrust = DO_NOT_TRUST;
                DO_NOT_TRUST = BOOLEAN_TRUE;
                ret = eventDispatcher(this, name, e, capturing_);
                DO_NOT_TRUST = cachedTrust;
                return ret;
            },
            toJSON: function (preventDeep) {
                var previous, temporaryFragment, childrenLength, children, obj, manager = this,
                    owner = manager.owner,
                    node = manager.element();
                if (manager.isWindow || manager.isDocument) {
                    return {};
                }
                return fromJSON(node, preventDeep);
            }
        }, wrap(directAttributes, function (attr, api) {
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
        }), wrap(toArray('add,addBack,elements,push,fragment'), function (key) {
            return function (one, two, three) {
                return this.wrap()[key](one, two, three);
            };
        }))),
        fromJSON = function (node, preventDeep) {
            var children, childrenLength, obj = {
                tagName: tag(node),
                comment: BOOLEAN_FALSE,
                text: BOOLEAN_FALSE
            };
            duff(node.attributes, function (attr) {
                var attributes = obj.attributes = obj.attributes || {};
                attributes[camelCase(attr[LOCAL_NAME])] = attr.nodeValue;
            });
            if (preventDeep) {
                return obj;
            }
            children = node.childNodes;
            if (!(childrenLength = children[LENGTH])) {
                return obj;
            }
            obj.children = map(children, function (child) {
                if (isElement(child)) {
                    return fromJSON(child, preventDeep);
                }
                if (child.nodeType === 3) {
                    return {
                        tag: BOOLEAN_FALSE,
                        comment: BOOLEAN_FALSE,
                        text: BOOLEAN_TRUE,
                        content: child.textContent
                    };
                }
                if (child.nodeType === 8) {
                    return {
                        tag: BOOLEAN_FALSE,
                        comment: BOOLEAN_TRUE,
                        text: BOOLEAN_FALSE,
                        content: child.textContent
                    };
                }
                return {
                    err: BOOLEAN_TRUE
                };
            });
            return obj;
        },
        _removeEventListener = function (manager, name, group, selector, handler, capture_) {
            var capture = !!capture_,
                directive = manager.directive(EVENTS),
                removeFromList = function (list, name) {
                    return list.obliteration(function (obj) {
                        if ((!name || name === obj.passedName) && (!handler || obj.handler === handler) && (!group || obj.group === group) && (!selector || obj.selector === selector)) {
                            directive.detach(obj);
                        }
                    });
                };
            return name ? duff(toArray(name, SPACE), eventExpander(manager.owner.events.expanders, function (name, passedName) {
                removeFromList(directive[HANDLERS][name], passedName);
            })) : each(directive[HANDLERS], passesFirstArgument(removeFromList));
        },
        /**
         * @class DOMA
         * @augments Model
         * @augments Collection
         */
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
        canBeProcessed = function (item) {
            return isWindow(item) || isElement(item) || isDocument(item) || isFragment(item);
        },
        collectChildren = function (element) {
            return toArray(element.children || element.childNodes);
        },
        returnsManager = function (element, owner) {
            return element && !isWindow(element) && element.isValidDomManager ? element : ensure(element, owner);
        },
        exportResult = _.publicize({
            covers: covers,
            center: center,
            closer: closer,
            fetch: fetch,
            distance: distance,
            escape: escape,
            unescape: unescape,
            box: box,
            isElement: isElement,
            isWindow: isWindow,
            isDocument: isDocument,
            isFragment: isFragment,
            unitToNumber: unitToNumber,
            numberToUnit: numberToUnit
        }),
        setupDomContentLoaded = function (handler, documentManager) {
            var bound = bind(handler, documentManager),
                windo = documentManager.window(),
                domHandler = function (e) {
                    documentManager.off('DOMContentLoaded', domHandler);
                    windo.off('load', domHandler);
                    documentManager.$(CUSTOM_ATTRIBUTE).each(documentManager.returnsManager);
                    bound(documentManager.$, e);
                };
            if (documentManager.is('ready')) {
                bound(documentManager.$, documentManager.DOMContentLoadedEvent);
            } else {
                documentManager.on('DOMContentLoaded', domHandler);
                windo.on('load', domHandler);
            }
            documentManager.mark('setup');
            return documentManager;
        },
        applyToEach = function (method) {
            return function (one, two, three, four, five, six) {
                return this.each(function (manager) {
                    manager[method](one, two, three, four, five, six);
                });
            };
        },
        allEachMethods = toArray('destroy,show,hide,style,remove,on,off,once,addEventListener,removeEventListener,dispatchEvent').concat(allDirectMethods),
        firstMethods = toArray('tag,element,client,box,flow'),
        applyToFirst = function (method) {
            var shouldBeContext = method !== 'tag';
            return function (one, two) {
                var element = this.item(one);
                return element && element[method](shouldBeContext ? this.context : two);
            };
        },
        readMethods = toArray('isWindow,isElement,isDocument,isFragment'),
        applyToTarget = function (property) {
            return function (one) {
                var element = this.item(one);
                return element && element[property];
            };
        },
        DOMA = factories.DOMA = factories.Collection.extend('DOMA', extend({}, classApi, {
            /**
             * @func
             * @name DOMA#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMA instance
             * @returns {DOMA} instance
             */
            isValidDOMA: BOOLEAN_TRUE,
            // destroy: function (handler_) {
            //     var handler = isFunction(handler_) ? handler_ : NULL;
            //     return this.each(function (manager) {
            //         manager.destroy(handler);
            //     });
            // },
            constructor: function (str, ctx, isValid, validContext, documentContext) {
                var isArrayResult, els = str,
                    dom = this,
                    context = dom.context = validContext ? ctx.item(0) : documentContext,
                    owner = dom.owner = documentContext,
                    unwrapped = context.element();
                if (str && !isWindow(str) && str.isValidDOMA) {
                    return str;
                }
                if (isFunction(str)) {
                    if (isDocument(unwrapped)) {
                        return setupDomContentLoaded(str, owner).wrap();
                    }
                } else {
                    if (!isValid) {
                        if (isString(str)) {
                            if (str[0] === '<') {
                                els = makeTree(str, owner);
                            } else {
                                els = map(query(str, unwrapped), owner.returnsManager, owner);
                            }
                        } else {
                            els = str;
                            if (DomManager.isInstance(els)) {
                                els = [els];
                            } else {
                                if (Collection.isInstance(els)) {
                                    els = els.unwrap();
                                }
                                if (canBeProcessed(els)) {
                                    els = [owner.returnsManager(els)];
                                } else {
                                    els = els && map(els, owner.returnsManager, owner);
                                }
                            }
                        }
                    }
                    dom.reset(els);
                }
                return dom;
            },
            setValue: setValue(domIterates),
            hasValue: hasValue(domContextFind),
            addValue: addValue(domIterates),
            removeValue: removeValue(domIterates),
            toggleValue: toggleValue(domIterates),
            changeValue: changeValue(domIterates),
            add: attachPrevious(function (context, query) {
                var found = context.owner.$(query);
                return concatUnique(context.unwrap(), found.unwrap());
            }),
            addBack: attachPrevious(function (context, selector) {
                var previous = context._previous;
                if (!previous) {
                    return context.unwrap().concat([]);
                }
                if (selector) {
                    previous = previous.filter(selector);
                }
                return context.unwrap().concat(previous.unwrap());
            }),
            wrap: function () {
                return this;
            },
            push: function () {
                var owner = this.context.owner;
                this.items.push.apply(this.items, foldl(arguments, function (memo, el) {
                    if (!el) {
                        return memo;
                    }
                    if (isWindow(el)) {
                        memo.push(el);
                    } else {
                        memo = memo.concat(!isWindow(el) && isFunction(el.unwrap) ? el.unwrap() : owner.returnsManager(el));
                    }
                    return memo;
                }, [], owner));
                return this;
            },
            elements: function () {
                // to array of DOMAanagers
                return this.mapCall(ELEMENT);
            },
            /**
             * @func
             * @name DOMA#isWin
             * @description asks if the first or specified index of the object is a window type object
             * @returns {Boolean}
             */
            /**
             * @func
             * @name DOMA#isDoc
             * @description asks if the first or specified index of the object is a document type object
             * @returns {Boolean}
             */
            fragment: function (els) {
                return this.context.returnsManager(fragment(els || this.unwrap(), this.context));
            },
            /**
             * @func
             * @name DOMA#filter
             * @param {String|Function|Object} filtr - filter variable that will filter by matching the object that is passed in, or by selector if it is a string, or simply with a custom function
             * @returns {DOMA} new DOMA instance object
             */
            filter: attachPrevious(function (context, filter) {
                return domFilter(context.unwrap(), filter);
            }),
            empty: attachPrevious(function (context, filtr) {
                var filter = createDomFilter(filtr);
                return dataReconstructor(context.unwrap(), unwrapsOnLoop(function (memo, manager, idx, list) {
                    return !filter(manager, idx, list) && manager.remove();
                }));
            }),
            /**
             * @func
             * @name DOMA#find
             * @param {String} str - string to use query to find against
             * @returns {DOMA} matching elements
             */
            $: attachPrevious(function (context, str) {
                var matchers = [],
                    push = function (el) {
                        matchers.push(context.owner.returnsManager(el));
                    };
                // look into foldl so we do not get duplicate elements
                return duff(context.unwrap(), function (manager) {
                    duff(query(str, manager.element()), push);
                }) && matchers;
            }),
            /**
             * @func
             * @name DOMA#children
             * @param {Number} [eq] - index of the children to gather. If none is provided, then all children will be added
             * @returns {DOMA} all / matching children
             */
            children: attachPrevious(function (context, eq) {
                return foldl(context.unwrap(), function (memo, manager) {
                    return manager.children(eq, memo);
                }, []);
            }),
            /**
             * @func
             * @name DOMA#once
             * @param {String} space delimited list of event names to attach handlers to
             * @param {Function} fn - handler to put on the event loop
             * @returns {DOMA} instance
             */
            /**
             * @func
             * @name DOMA#css
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMA} instance
             */
            css: styleManipulator,
            // style: styleManipulator,
            /**
             * @func
             * @name DOMA#allDom
             * @returns {Boolean} value indicating whether or not there were any non dom elements found in the collection
             */
            allElements: function () {
                return !!(this[LENGTH]() && !find(this.unwrap(), function (manager) {
                    return !manager[IS_ELEMENT];
                }));
            },
            /**
             * @func
             * @name DOMA#height
             * @returns {Number} height of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            /**
             * @func
             * @name DOMA#width
             * @returns {Number} width of the first object, adjusting for the different types of possible objects such as dom element, document or window
             */
            width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            /**
             * @func
             * @name DOMA#data
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {Object|*} can return the value that is asked for by the initial function call
             */
            /**
             * @func
             * @name DOMA#attr
             * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
             * @returns {DOMA | *} if multiple attributes were requested then a plain hash is returned, otherwise the DOMA instance is returned
             */
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            /**
             * @func
             * @name DOMA#eq
             * @param {Number|Array} [num=0] - index or list of indexes to create a new DOMA element with.
             * @returns {DOMA} instance
             */
            eq: attachPrevious(function (context, num) {
                return eq(context.unwrap(), num);
            }),
            /**
             * @func
             * @name DOMA#box
             * @param {Number} [num=0] - index to get the boxmodel of
             */
            /**
             * @func
             * @name DOMA#end
             * @returns {DOMA} object that started the traversal chain
             */
            end: function () {
                var that = this;
                while (that._previous) {
                    that = that._previous;
                }
                return that;
            },
            getAttribute: getValueCurried,
            setAttribute: setValueCurried,
            /**
             * @func
             * @name DOMA#append
             */
            append: function (els, clone) {
                return this.insertAt(els, NULL, clone);
            },
            prepend: function (els, clone) {
                return this.insertAt(els, 0, clone);
            },
            insertBefore: insertBefore,
            appendTo: function (target) {
                $(target).append(this);
                return this;
            },
            /**
             * @func
             * @name DOMA#next
             * @returns {DOMA} instance
             */
            next: horizontalTraverser('next', 1),
            /**
             * @func
             * @name DOMA#previous
             * @returns {DOMA} instance
             */
            prev: horizontalTraverser('prev', -1),
            /**
             * @func
             * @name DOMA#skip
             * @returns {DOMA} instance
             */
            skip: horizontalTraverser('skip', 0),
            siblings: attachPrevious(function (context, filtr) {
                return mappedConcat(context, function (manager) {
                    return manager.siblings(filtr).unwrap();
                });
            }),
            /**
             * @func
             * @name DOMA#insertAt
             * @returns {DOMA} instance
             */
            insertAt: function (els_, index, clone) {
                var manager = this,
                    owner = manager.owner,
                    els = isAppendable(els_) ? this.context.returnsManager(els_) : owner.$(els_).fragment();
                return this.each(function (manager) {
                    var elements = els;
                    if (clone) {
                        elements = elements.clone();
                    }
                    manager.insertAt(elements, index);
                });
            },
            replaceWith: attachPrevious(function (context, els_, shouldClone_) {
                var isStringResult, els, shouldClone = !!shouldClone_,
                    owner = context.owner;
                if (!(isStringResult = isString(element))) {
                    els = isAppendable(els_) ? owner.returnsManager(els_) : owner.$(els_).fragment();
                }
                return mappedConcat(context, function (manager, index) {
                    var elements = els_;
                    if (!manager[IS_ELEMENT]) {
                        return [];
                    }
                    if (isStringResult) {
                        elements = context.owner.$(els_);
                    } else {
                        if (clone) {
                            elements = els.clone();
                        } else {
                            if (index) {
                                return [];
                            }
                        }
                    }
                    parent = manager.parent();
                    parent.insertAt(elements, parent.children().indexOf(manager));
                    manager.remove();
                    return elements.unwrap();
                });
            }),
            contains: function (els) {
                return !!this.find(function (manager) {
                    return manager.contains(els);
                });
            },
            clone: attachPrevious(function (context) {
                return context.foldl(function (memo, manager) {
                    if (manager[IS_ELEMENT]) {
                        memo.push(manager.clone());
                    }
                    return memo;
                });
            }),
            /**
             * @func
             * @name DOMA#parent
             * @param {Number} [count=1] - number of elements to go up in the parent chain
             * @returns {DOMA} instance of collected, unique parents
             */
            parent: attachPrevious(function (context, original) {
                // ensure unique
                var hash = {};
                return context.foldl(function (memo, manager) {
                    var parent;
                    if ((parent = manager.parent(original)) && !hash[parent[TARGET][__ELID__]]) {
                        hash[parent[TARGET][__ELID__]] = parent;
                        memo.push(parent);
                    }
                    return memo;
                }, []);
            }),
            /**
             * @func
             * @name DOMA#has
             * @param {Node|Array} els - list of elements to check the current instance against
             * @returns {Boolean} whether or not the current doma element has all of the elements that were passed in
             */
            has: function (els) {
                var doma = this,
                    collection = Collection(els),
                    length = collection[LENGTH]();
                return !!length && collection.find(function (el) {
                    return doma.indexOf(el) === -1;
                });
            },
            /**
             * @func
             * @name DOMA#html
             * @returns {DOMA} instance
             */
            html: htmlTextManipulator(HTML),
            /**
             * @func
             * @name DOMA#text
             * @returns {DOMA} instance
             */
            text: htmlTextManipulator(TEXT),
            /**
             * @func
             * @name DOMA#childOf
             */
            map: function (handler, context) {
                return Collection(map(this.unwrap(), handler, context));
            },
            toJSON: function () {
                return this.results(TO_JSON).unwrap();
            },
            toString: function () {
                return stringify(this);
            }
        }, wrap(allEachMethods, applyToEach), wrap(firstMethods, applyToFirst), wrap(readMethods, applyToTarget))),
        allSetups = [],
        plugins = [];
    app.undefine(function (app, windo) {
        var setup = DOMA_SETUP(windo[DOCUMENT]);
        allSetups.push(setup);
        windo.DOMA = windo.DOMA || setup;
        windo.$ = has(windo, '$') ? windo.$ : setup;
        duff(plugins, function (plugin) {
            plugin(setup);
        });
        return setup;
    });
    // collect all templates with an id
    $.collectTemplates();
    // register all custom elements...
    // everything that's created after this should go through the DomManager to be marked appropriately
    // define a hash for attribute caching
    app.defineDirective(ATTRIBUTES, function () {
        return {};
    });
});