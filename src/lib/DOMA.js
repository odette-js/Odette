var ATTACHED = 'attached',
    IFRAME = 'iframe',
    LOCAL_NAME = 'localName',
    CHILD_NODES = 'childNodes',
    FRAGMENT = 'fragment',
    TAG_NAME = 'tagName',
    NODE_TYPE = 'nodeType',
    PARENT_NODE = 'parentNode',
    ATTRIBUTES = 'Attributes',
    DOM_MANAGER_STRING = 'DomManager',
    DESTROYED = DESTROY + 'ed',
    CUSTOM = 'custom',
    REMOVING = 'removing',
    ACCESSABLE = 'accessable',
    CUSTOM_LISTENER = CUSTOM + 'Listener',
    UPPER_CHILD = 'Child',
    APPEND_CHILD = 'append' + UPPER_CHILD,
    REMOVE = 'remove',
    REMOVE_CHILD = REMOVE + UPPER_CHILD,
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
    CUSTOM_KEY = 'is',
    CLASS__NAME = (CLASS + HYPHEN + NAME),
    FONT_SIZE = 'fontSize',
    DEFAULT_VIEW = 'defaultView',
    DIV = 'div',
    makeDataAttr = function (key, value) {
        return '[' + (value == NULL ? key : (key + '="' + value + '"')) + ']';
    },
    CUSTOM_ATTRIBUTE = makeDataAttr(CUSTOM_KEY),
    devicePixelRatio = (win.devicePixelRatio || 1),
    propsList = toArray('type,href,className,height,width,id,tabIndex,title,alt,innerHTML,outerHTML,textContent'),
    propsHash = wrap(propsList, BOOLEAN_TRUE),
    Events = toArray('abort,afterprint,beforeprint,blocked,cached,canplay,canplaythrough,change,chargingchange,chargingtimechange,checking,close,complete,dischargingtimechange,DOMContentLoaded,downloading,durationchange,emptied,ended,error,fullscreenchange,fullscreenerror,input,invalid,languagechange,levelchange,loadeddata,loadedmetadata,message,noupdate,obsolete,offline,online,open,pagehide,pageshow,paste,pause,pointerlockchange,pointerlockerror,play,playing,ratechange,reset,seeked,seeking,stalled,storage,submit,success,suspend,timeupdate,updateready,upgradeneeded,versionchange,visibilitychange'),
    SVGEvent = toArray('SVGAbort,SVGError,SVGLoad,SVGResize,SVGScroll,SVGUnload,SVGZoom,volumechange,waiting'),
    KeyboardEvent = toArray('keydown,keypress,keyup'),
    GamePadEvent = toArray('gamepadconnected,gamepadisconnected'),
    CompositionEvents = toArray('compositionend,compositionstart,compositionupdate,drag,dragend,dragenter,dragleave,dragover,dragstart,drop'),
    MouseEvents = toArray('click,contextmenu,dblclick,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,show,wheel'),
    TouchEvents = toArray('touchcancel,touchend,touchenter,touchleave,touchmove,touchstart'),
    DeviceEvents = toArray('devicemotion,deviceorientation,deviceproximity,devicelight'),
    FocusEvents = toArray('blur,focus'),
    TimeEvents = toArray('beginEvent,endEvent,repeatEvent'),
    AnimationEvents = toArray('animationend,animationiteration,animationstart,transitionend'),
    AudioProcessingEvents = toArray('audioprocess,complete'),
    UIEvents = toArray('abort,error,hashchange,load,orientationchange,readystatechange,resize,scroll,select,unload,beforeunload'),
    ProgressEvent = toArray('abort,error,load,loadend,loadstart,popstate,progress,timeout'),
    AllEvents = concatUnique(Events, SVGEvent, KeyboardEvent, CompositionEvents, GamePadEvent, MouseEvents, TouchEvents, DeviceEvents, FocusEvents, TimeEvents, AnimationEvents, AudioProcessingEvents, UIEvents, ProgressEvent),
    knownPrefixes = toArray('-o-,-ms-,-moz-,-webkit-,mso-,-xv-,-atsc-,-wap-,-khtml-,-apple-,prince-,-ah-,-hp-,-ro-,-rim-,-tc-'),
    validTagNames = toArray('a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rb,rp,rt,rtc,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr'),
    validTagsNamesHash = wrap(validTagNames, BOOLEAN_TRUE),
    ALL_EVENTS_HASH = wrap(AllEvents, BOOLEAN_TRUE),
    knownPrefixesHash = wrap(knownPrefixes, BOOLEAN_TRUE),
    getClosestWindow = function (windo_) {
        var windo = windo_ || win;
        return isWindow(windo) ? windo : (windo && windo[DEFAULT_VIEW] ? windo[DEFAULT_VIEW] : (windo.ownerGlobal ? windo.ownerGlobal : DOMA(windo).parent(WINDOW)[ITEM](0) || win));
    },
    getComputed = function (el, ctx) {
        var ret = getClosestWindow(ctx).getComputedStyle(el);
        return ret ? ret : getClosestWindow(el).getComputedStyle(el) || clone(el[STYLE]) || {};
    },
    allStyles = getComputed(doc[BODY], win),
    createAttributeFromTag = function (tag) {
        return '[' + CUSTOM_KEY + '="' + tag + '"]';
    },
    tag = function (el, str) {
        var tag;
        if (!el || !isElement(el)) {
            return BOOLEAN_FALSE;
        }
        tag = el[LOCAL_NAME].toLowerCase();
        return str ? tag === str.toLowerCase() : tag;
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
    styleKebabCase = cacheable(function (styleKey) {
        var kebabed = kebabCase(styleKey);
        if (styleKey[0] >= 'A' && styleKey[0] <= 'Z') {
            kebabed = '-' + kebabed;
        }
        return kebabed;
    }),
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
                styleName = kebabCase(n);
            }
            kebabCase(styleName);
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
    allowsPassiveEvents = function () {
        return !!wraptry(function () {
            var supportsPassive = BOOLEAN_FALSE;
            var opts = Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = BOOLEAN_TRUE;
                }
            });
            window.addEventListener('test', NULL, opts);
            return supportsPassive;
        });
    },
    convertStyleValue = function (key, value) {
        return +value !== +value ? value : (timeBasedCss[key] ? value + 'ms' : (!numberBasedCss[key] ? value + PIXELS : value));
    },
    updateStyleWithImportant = function (string, key_, value) {
        var newStyles, found, key = kebabCase(key_);
        return (newStyles = foldl(string.split(';'), function (memo, item_, index, items) {
            var item = item_.trim(),
                itemSplit = item.split(COLON),
                property = itemSplit[0].trim(),
                shifted = itemSplit.shift(),
                setValue = itemSplit.join(COLON).trim();
            if (property === key) {
                found = BOOLEAN_TRUE;
                setValue = value + ' !important';
            }
            if (key === property) {
                memo.push(property + ': ' + setValue);
            } else {
                if ((!item_ && !index) || (index === items[LENGTH] - 1 && !found)) {
                    memo.push(key + ': ' + value + ' !important');
                } else {
                    //
                }
            }
            return memo;
        }, []).join('; ')) ? newStyles + ';' : newStyles;
    },
    updateStyle = function (element, key_, value_) {
        var changed, key = key_,
            value = value_ !== '' ? convertStyleValue(key, value_) : value_;
        duff(prefixedStyles[camelCase(key)], function (prefix) {
            var styleKey = prefix + kebabCase(key),
                styleVal = element[STYLE][styleKey];
            if (styleVal !== value) {
                element[STYLE][styleKey] = value;
                changed = BOOLEAN_TRUE;
            }
        });
        return changed;
    },
    applyStyle = function (element, key_, value_, important_) {
        var newStyles, found, cached, changed, updatedStyle,
            key = key_,
            value = value_,
            important = important_;
        if (!isElement(element)) {
            return BOOLEAN_FALSE;
        }
        cached = attributeApi.read(element, STYLE);
        if (isObject(key_)) {
            important = value_;
            value = NULL;
        }
        if (important) {
            // write with importance
            intendedObject(key, value, function (key, value) {
                updatedStyle = updateStyleWithImportant(element, key, value);
            });
            return updateStyle !== cached;
        } else {
            intendedObject(key, value, function (key_, value_) {
                changed = updateStyle(element, key_, value_) ? BOOLEAN_TRUE : changed;
            });
        }
        return changed;
    },
    writeAttribute = function (el, key, val_) {
        var val = val_;
        if (val === BOOLEAN_FALSE || val == NULL) {
            removeAttribute(el, key);
        } else {
            if (isObject(val_)) {
                if (key === STYLE) {
                    if (!el[STYLE]) {
                        return;
                    }
                    applyStyle(el, val);
                    return;
                } else {
                    val = foldl(val_, function (memo, value, key) {
                        if (value) {
                            memo.push(key);
                        }
                    }).join(SPACE);
                }
            }
            if (val !== BOOLEAN_FALSE && val != NULL) {
                el.setAttribute(key, (val === BOOLEAN_TRUE ? EMPTY_STRING : val) + EMPTY_STRING);
            }
        }
    },
    registeredElementName = function (name, manager) {
        return capitalize(ELEMENT) + HYPHEN + manager[__ELID__] + HYPHEN + name;
    },
    iframeContent = function (head, body) {
        return '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="user-scalable=no,width=device-width,initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">' + head + '</head><body>' + body + '</body></html>';
    },
    filtersParentNotMe = function (parent) {
        return function (element) {
            return element[PARENT_NODE] === parent;
        };
    },
    returnsSelector = function (string, owner) {
        var registeredElements = owner.registeredElements;
        return registeredElements[string] === BOOLEAN_TRUE ? string : createAttributeFromTag(string);
    },
    convertSelector = function (str, owner) {
        // removes custom tag names and replaces them with [is="tag"]
        // if anyone knows some regexp that would be better than this, then take a stab at it
        return map(toArray(str, SPACE), function (level) {
            return level.replace(/^(\S*?)([\.|\#|\[])/i, function (match_) {
                var match = match_;
                var last = match[LENGTH] - 1;
                return last ? (returnsSelector(match.slice(0, last), owner) + match.slice(last)) : match;
            });
        }).join(SPACE);
    },
    directSuperAccessor = function (context, key) {
        return context[key];
    },
    superElementsHash = {
        body: directSuperAccessor,
        head: directSuperAccessor,
        document: function (context) {
            return context;
        },
        window: function (context) {
            return context.defaultView;
        }
    },
    dataReconstructor = function (list, fn) {
        return foldl(list, function (memo, arg1, arg2, arg3) {
            if (fn(arg1, arg2, arg3)) {
                memo.push(arg1);
            }
            return memo;
        }, []);
    },
    // takes string to query for, subset of tree to query for and manager so it can always get to the document
    query = function (str_, ctx, manager) {
        var superElement, directSelector, elements, str = (str_ || EMPTY_STRING).trim(),
            context = ctx,
            returnsArray = returns.first,
            owner = manager.owner;
        if (!str) {
            return [];
        }
        if (manager && manager === owner) {
            if ((superElement = superElementsHash[str])) {
                // assume context is window since (manager === owner)
                return [superElement(context, str)];
            }
        }
        if (manager && str[0] === '>') {
            directSelector = BOOLEAN_TRUE;
            str = manager.queryString() + str;
        }
        str = convertSelector(str, owner);
        elements = context.querySelectorAll(str);
        if (directSelector) {
            return dataReconstructor(elements, filtersParentNotMe(context));
        } else {
            return toArray(elements);
        }
    },
    matchesSelector = function (element, selector, owner) {
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
        return indexOf(query(selector, parent, owner), element) !== -1;
    },
    readAttribute = function (el, key) {
        var coerced, val = el.getAttribute(key);
        return convertAttributeValue(val);
    },
    cautiousConvertValue = function (generated) {
        var converted = +generated;
        return generated[LENGTH] && converted === converted && converted + EMPTY_STRING === generated ? converted : generated;
    },
    convertAttributeValue = function (val_) {
        var val = val_;
        if (val === EMPTY_STRING) {
            return BOOLEAN_TRUE;
        } else {
            return val == NULL ? BOOLEAN_FALSE : cautiousConvertValue(val);
        }
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
    appendChild = function (parent, target) {
        return target && parent.appendChild && parent.appendChild(target);
    },
    removeChild = function (el, target) {
        var result = el && (target ? appendChild(target, el) : el.parentNode && el.parentNode.removeChild(el));
    },
    readProperty = function (el, property) {
        return el[property];
    },
    writeProperty = function (el, property, value) {
        if (value == NULL) {
            return removeProperty(el, property);
        }
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
    baseNodeToJSON = function (node) {
        var obj = {
            tagName: tag(node),
            comment: BOOLEAN_FALSE,
            text: BOOLEAN_FALSE
        };
        duff(node.attributes, function (attr) {
            var attributes = obj.attributes = obj.attributes || {};
            attributes[camelCase(attr[LOCAL_NAME])] = attr.value;
        });
        return obj;
    },
    commentJSON = function (text) {
        return {
            tag: BOOLEAN_FALSE,
            comment: BOOLEAN_TRUE,
            text: BOOLEAN_FALSE,
            content: text
        };
    },
    textJSON = function (text) {
        return {
            tag: BOOLEAN_FALSE,
            comment: BOOLEAN_FALSE,
            text: BOOLEAN_TRUE,
            content: text
        };
    },
    finalInsertBefore = function (parent, el1, el2) {
        return el1 && parent.insertBefore && parent.insertBefore(el1, el2);
    },
    insertBefore = function (parent, inserting, target) {
        var children;
        if (isObject(target)) {
            finalInsertBefore(parent, inserting, target);
        } else {
            if (isNumber(target)) {
                children = parent[CHILD_NODES];
                target = children[LENGTH] > target ? children[target] : BOOLEAN_FALSE;
                if (target) {
                    finalInsertBefore(parent, inserting, target);
                } else {
                    appendChild(parent, inserting);
                }
            } else {
                if (target) {
                    // handle query string
                } else {
                    appendChild(parent, inserting);
                }
            }
        }
    },
    collectAttr = function (memo, attribute, future) {
        var attributeKey = attribute[LOCAL_NAME];
        if (future) {
            memo.attrsA[attributeKey] = BOOLEAN_TRUE;
            memo.accessB[attributeKey] = attribute.value;
        } else {
            memo.attrsA[attributeKey] = BOOLEAN_TRUE;
            memo.accessA[attributeKey] = attribute.value;
        }
        if (memo.hash[attributeKey]) {
            return;
        }
        memo.hash[attributeKey] = BOOLEAN_TRUE;
        memo.list.push(attributeKey);
    },
    returnsJSONNodeType = function (tagName) {
        return tagName === 'text' ? 3 : 1;
    },
    checkNeedForCustom = function (el) {
        return el[__ELID__] && attributeApi.read(el, 'is') !== BOOLEAN_FALSE;
    },
    diffAttributes = function (a, b, diffs, context) {
        var bKeys, aAttributes = a.attributes,
            aLength = aAttributes.length,
            bLength = (bKeys = keys(b[1])).length,
            attrs = foldl({
                length: Math.max(aLength, bLength)
            }, function (memo, voided, index) {
                var key;
                if (memo.aLength > index) {
                    collectAttr(memo, aAttributes[index]);
                }
                if (memo.bLength > index) {
                    key = bKeys[index];
                    collectAttr(memo, {
                        localName: kebabCase(key),
                        value: b[1][key]
                    }, BOOLEAN_TRUE);
                }
            }, {
                list: [],
                hash: {},
                attrsA: {},
                accessA: {},
                attrsB: {},
                accessB: {},
                aLength: aLength,
                bLength: bLength
            }),
            anElId = a[__ELID__],
            updates;
        duff(attrs.list, function (key) {
            if (attrs.accessA[key] !== attrs.accessB[key]) {
                updates = updates || {};
                updates[key] = attrs.accessB[key] === UNDEFINED ? NULL : attrs.accessB[key];
            }
        });
        if (!updates) {
            return;
        }
        diffs.updating.push(function () {
            var manager, props;
            each(updates, function (value, key) {
                if (!propsHash[key]) {
                    return;
                }
                delete updates[key];
                props = props || {};
                props[key] = value;
            });
            if (checkNeedForCustom(a)) {
                manager = context.returnsManager(a);
                if (keys(updates)[LENGTH]) {
                    manager.attr(updates);
                }
                if (props) {
                    manager.prop(props);
                }
            } else {
                each(updates, function (value, key) {
                    attributeApi.write(a, kebabCase(key), value);
                });
                each(props, function (value, key) {
                    propertyApi.write(a, kebabCase(key), value);
                });
            }
        });
    },
    collectVirtualKeys = function (virtualized, diff, previous_hash, level_, index_) {
        var groups, children = virtualized[2];
        var uniques = virtualized[3];
        var level = level_ || 0;
        var index = index_ || 0;
        if (uniques) {
            groups = toArray(uniques.group);
            if (uniques.key) {
                diff.ids[uniques.key] = {
                    virtual: virtualized,
                    level: level,
                    index: index,
                    group: groups[LENGTH] ? groups : NULL,
                    el: previous_hash[uniques.key]
                };
            }
        }
        duff(children, function (child, index) {
            collectVirtualKeys(child, diff, previous_hash, level + 1, index);
        });
    },
    computeStringDifference = function (a, b, context, diffs) {
        if (isString(b[2])) {
            if (a.innerHTML !== b[2]) {
                diffs.updating.push(function () {
                    if (checkNeedForCustom(a)) {
                        context.returnsManager(a).html(b[2]);
                    } else {
                        a.innerHTML = b[2];
                    }
                });
            }
            return BOOLEAN_TRUE;
        }
    },
    insertMapper = function (els, parent, context, i, hash) {
        var frag = doc.createDocumentFragment();
        duff(els, function (el) {
            context.deltas.create(el, frag, hash);
        });
        return {
            parent: parent,
            el: frag,
            index: i
        };
    },
    filtersAlreadyInserted = function (els, hash) {
        return _.filter(els, function (el) {
            var identifiers = el[3];
            if (identifiers && identifiers.key) {
                return !hash[identifiers.key];
            }
            return BOOLEAN_TRUE;
        });
    },
    diffChildren = function (a, b, hash, stopper, layer_level, diffs, context) {
        var aChildren = a.childNodes;
        var bChildren = b[2];
        var mutations = diffs.mutations;
        var keys = diffs.keys;
        // it was a string, so there's nothing more to compute in regards to children
        if (computeStringDifference(a, b, context, diffs)) {
            return diffs;
        }
        var aChildrenLength = aChildren && aChildren[LENGTH];
        var bChildrenLength = bChildren && bChildren[LENGTH];
        var maxLength = Math.max(aChildrenLength, bChildrenLength);
        var j, finished, bChild, removing, result, dontCreate, offset = 0,
            i = 0,
            focus = 0;
        if (!bChildren || isNumber(bChildren)) {
            return diffs;
        }
        for (; i < maxLength && !finished; i++) {
            if (aChildrenLength <= i) {
                // rethink this. it's a little weird
                diffs.inserting.push(insertMapper(filtersAlreadyInserted(toArray(bChildren).slice(i), hash), a, context, i, diffs.keys));
                return diffs;
            } else {
                if (b[2] && stopper(b)) {
                    // do not do children
                    if (bChildrenLength <= i) {
                        dontCreate = BOOLEAN_TRUE;
                        diffs.removing.push.apply(diffs.removing, toArray(aChildren).slice(i));
                        return diffs;
                    } else {
                        result = nodeComparison(aChildren[i], bChildren[i], hash, stopper, layer_level, i, diffs, context, a);
                        if (result === BOOLEAN_FALSE) {
                            diffs.removing.push(a);
                            diffs.inserting.push(insertMapper([b], a, context, i + offset, diffs.keys));
                        }
                    }
                }
            }
        }
        return diffs;
    },
    newDiff = function (context) {
        var diffs = {
            removing: [],
            updating: [],
            inserting: [],
            mutations: {
                remove: function () {
                    if (!diffs.removing[LENGTH]) {
                        return;
                    }
                    // maintains attach state on dommanager
                    context.$(diffs.removing).remove();
                    return BOOLEAN_TRUE;
                },
                update: function () {
                    // attributes and content
                    duff(diffs.updating, function (fn) {
                        fn();
                    });
                },
                insert: function () {
                    if (!diffs.inserting[LENGTH]) {
                        return;
                    }
                    diffs.inserting.sort(function (a, b) {
                        return a.index > b.index ? 1 : -1;
                    });
                    var target, index, currentFragment, actuallyInserting = [],
                        inserting = diffs.inserting.slice(0);
                    // group sections into document fragments
                    while (inserting[LENGTH]) {
                        // shift off of the inserting list
                        target = inserting.shift();
                        // if no index is defined
                        if (index === UNDEFINED) {
                            // define an index
                            index = target.index;
                            // set a current fragment
                            currentFragment = {
                                index: target.index,
                                el: context.createDocumentFragment(),
                                parent: target.parent
                            };
                            // push it to the final insert list
                            actuallyInserting.push(currentFragment);
                            // append the target element to the fragment
                            appendChild(currentFragment.el, target.el);
                        } else {
                            if (target.parent === currentFragment.parent && index + 1 === target.index) {
                                // append to current fragment
                                appendChild(currentFragment.el, target.el);
                                // update index
                                index = target.index;
                            } else {
                                // unshift target
                                inserting.unshift(target);
                                // reset index to undefined to start new document fragment
                                index = UNDEFINED;
                            }
                        }
                    }
                    duff(actuallyInserting, function (list, idx, lists) {
                        // maintains attach state on dom manager
                        context.returnsManager(list.parent).insertAt(list.el, list.index);
                    });
                    return BOOLEAN_TRUE;
                }
            },
            keys: {},
            ids: {},
            group: {},
            futureTree: {},
            futureHash: {}
        };
        return diffs;
    },
    // cannot start with a text node
    nodeComparison = function (a_, b_, hash_, stopper_, layer_level_, index_, diffs_, context, future_parent_) {
        var returns, resultant, current, inserting, identifyingKey, identified, first = !diffs_,
            a = a_,
            b = b_,
            index = index_ || 0,
            future_parent = future_parent_,
            diffs = diffs_ || newDiff(context),
            stopper = stopper_ || returnsTrue,
            keys = diffs.keys,
            mutations = diffs.mutations,
            layer_level = layer_level_ || 0,
            hash = hash_ || {},
            layerLength = b[LENGTH],
            identifiers = b[3],
            tagA = tag(a);
        if (first) {
            collectVirtualKeys(b, diffs, hash);
        }
        if (tagA === b[0] && a.nodeType === returnsJSONNodeType(b[0])) {
            if (identifiers && (identifyingKey = identifiers.key)) {
                current = hash[identifyingKey];
                identified = diffs.ids[identifyingKey];
                if (current) {
                    if (current === a) {
                        diffs.keys[identifyingKey] = current;
                    } else {
                        if (identified.virtual[0] === tagA) {
                            // has the effect of removing it at the same time as inserting it
                            diffs.removing.push(a);
                            identified.parent = future_parent;
                            diffs.inserting.push(identified);
                            a = diffs.keys[identifyingKey] = current;
                        } else {
                            diffs.removing.push(a);
                            diffs.inserting.push(insertMapper([b], future_parent, context, index, diffs.keys));
                            diffs.keys[identifyingKey] = a;
                            return diffs;
                        }
                    }
                } else {
                    diffs.inserting.push(insertMapper([b], future_parent, context, index, diffs.keys));
                    return diffs;
                }
            }
            // what is different.
            diffAttributes(a, b, diffs, context);
            return diffChildren(a, b, hash, stopper, layer_level + 1, diffs, context);
        } else {
            // instant fail
            if (first) {
                exception('at least the first node must match tagName and nodeType');
            }
            return BOOLEAN_FALSE;
        }
    },
    nodeToJSON = function (node, shouldStop_, includeComments) {
        var obj, children, childrenLength, shouldStop = shouldStop_ || noop;
        obj = baseNodeToJSON(node);
        if (obj.attributes && obj.attributes.is && obj.attributes.dataRenderer) {
            return {
                selfSufficient: BOOLEAN_TRUE
            };
        }
        if (!shouldStop(node, obj)) {
            return obj;
        }
        children = node.childNodes;
        if (!(childrenLength = children[LENGTH])) {
            return obj;
        }
        obj.children = foldl(children, function (memo, child) {
            if (isElement(child)) {
                memo.push(nodeToJSON(child, shouldStop, includeComments));
            } else if (child.nodeType === 3) {
                memo.push(textJSON(child.textContent));
            } else if (includeComments) {
                if (child.nodeType === 8) {
                    memo.push(commentJSON(child.textContent));
                } else {
                    memo.push({
                        err: BOOLEAN_TRUE
                    });
                }
            }
        }, []);
        return obj;
    },
    createDocumentFragment = function (nulled, context) {
        return context.is(DOCUMENT) && context.element().createDocumentFragment();
    },
    isElement = function (object) {
        return !!(object && isNumber(object[NODE_TYPE]) && object[NODE_TYPE] === object.ELEMENT_NODE);
    },
    isDocument = function (obj) {
        return obj && isNumber(obj[NODE_TYPE]) && obj[NODE_TYPE] === obj.DOCUMENT_NODE;
    },
    isFragment = function (frag) {
        return frag && frag[NODE_TYPE] === doc.DOCUMENT_FRAGMENT_NODE;
    },
    canBeProcessed = function (item) {
        return isWindow(item) || isElement(item) || isDocument(item) || isFragment(item);
    },
    collectChildren = function (element) {
        return toArray(element.children || element.childNodes);
    },
    openBlock = function (selector, total) {
        return once(function () {
            total.push(selector.join('') + ' {');
        });
    },
    closeBlock = function (total) {
        return once(function () {
            total.push(' }\n');
        });
    },
    buildCss = function (json, selector_, memo_, beforeAnyMore) {
        var result, baseSelector = selector_ || [],
            memo = memo_ || [],
            opensBlock = noop,
            closesBlock = noop;
        if (memo_) {
            opensBlock = openBlock(baseSelector, memo);
        }
        if (beforeAnyMore) {
            beforeAnyMore();
        }
        result = foldl(json, function (memo, block, key) {
            var cameled, trimmed = key.trim();
            // var media = trimmed[0] === '@';
            // if (media) {
            // return total_.concat(medium[trimmed.split(' ').shift()](json, trimmed, total));
            // handle one way... possible with an extendable handler?
            // } else {
            if (isObject(block)) {
                duff(toArray(trimmed, COMMA), function (trimmd_) {
                    trimmed = trimmd_.trim();
                    if (baseSelector[LENGTH]) {
                        if (trimmed[0] !== '&') {
                            trimmed = ' ' + trimmed;
                        } else {
                            trimmed = trimmed.slice(1);
                        }
                    }
                    opensBlock = openBlock(baseSelector, memo);
                    baseSelector.push(trimmed);
                    buildCss(block, baseSelector, memo, closesBlock);
                    baseSelector.pop();
                });
            } else {
                opensBlock();
                closesBlock = closeBlock(memo);
                // always on the same line
                // console.log(prefixedStyles);
                cameled = camelCase(trimmed);
                duff(prefixedStyles[cameled] || [''], function (prefix) {
                    memo.push('\n\t' + prefix + kebabCase(cameled) + ': ' + convertStyleValue(trimmed, block) + ';');
                });
            }
        }, memo);
        closesBlock(memo);
        return result.join('');
    },
    WeakMapRemap = function (instance, list) {
        duff(list, function (name) {
            var method = instance.get.bind(instance);
            instance[name] = function (element, identifier) {
                return method(element, identifier || this.identifier(element));
            };
        });
    },
    ElementalWeakMap = WeakMap.extend({
        constructor: function () {
            var map = this;
            WeakMapRemap(map, toArray('get,has,delete'));
            var set = map.set.bind(map);
            map.set = function (element, data, identifier) {
                return set(element, data, identifier || this.identifier(element));
            };
            map.super.apply(map, arguments);
        },
        identifier: function (el) {
            return el && (isWindow(el) ? BOOLEAN_FALSE : el[__ELID__]);
        }
    }),
    globalAssociator = ElementalWeakMap();
app.scope(function (app) {
    var noMatch = /(.)^/,
        ensure = function (el, owner) {
            var data, id, manager, associator, attach_id = BOOLEAN_TRUE;
            if (owner === BOOLEAN_TRUE) {
                data = globalAssociator.get(el, el[__ELID__]);
                associator = globalAssociator;
            } else {
                associator = globalAssociator;
                if (isWindow(el)) {
                    data = globalAssociator.get(el);
                    attach_id = id = BOOLEAN_FALSE;
                } else {
                    associator = owner.data;
                    id = el[__ELID__];
                    if (id) {
                        data = associator.get(el, id);
                    }
                }
            }
            if (id === UNDEFINED) {
                id = app.counter() + HYPHEN + now();
            }
            if (!data) {
                data = {};
                associator.set(el, data, id);
                if (attach_id) {
                    el[__ELID__] = id;
                }
            }
            if (!(manager = data[DOM_MANAGER_STRING])) {
                manager = DomManager(el, data, owner, id);
            }
            return manager;
        },
        templateGenerator = function (text_, templateSettings) {
            var render, template, trimmed, argument, settings = merge({}, templateSettings),
                text = text_,
                templateIsFunction = isFunction(text);
            if (templateIsFunction) {
                render = text;
            } else {
                trimmed = text.trim();
                if (trimmed[trimmed[LENGTH] - 1] !== ';') {
                    trimmed += ';';
                }
                trimmed = text;
                render = wraptry(function () {
                    return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('helpers', '_', blockWrapper(trimmed));
                });
            }
            return function (data, helpers) {
                return render.call(data, _, helpers);
            };
            // }
            // var matcher = RegExp([
            //     (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source
            // ].join('|') + '|$', 'g');
            // var index = 0;
            // var source = "__HTML__+='";
            // text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
            //     source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
            //     index = offset + match[LENGTH];
            //     if (escape) {
            //         source += "'+\n((__t=(this." + escape + "))==null?'':_.escape(__t))+\n'";
            //     } else if (interpolate) {
            //         source += "'+\n((__t=(this." + interpolate + "))==null?'':__t)+\n'";
            //     } else if (evaluate) {
            //         source += "';\n" + evaluate + "\n__HTML__+='";
            //     }
            //     // Adobe VMs need the match returned
            //     // to produce the correct offset.
            //     return match;
            // });
            // source += "';\n";
            // // If a variable is not specified, place data values in local scope.
            // // if (!settings.variable) {
            // source = 'with(this||{}){\n' + source + '}\n';
            // // }
            // source = "var __t,__HTML__='',__j=Array.prototype.join," + "print=function(){__HTML__+=__j.call(arguments,'');};\n" + source + 'return __HTML__;\n';
            // render = _.wraptry(function () {
            //     return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR(settings.variable || '_', source);
            // });
            // template = function (data) {
            //     return virtualize(render.call(data || {}, _));
            // };
            // // Provide the compiled source as a convenience for precompilation.
            // argument = settings.variable || 'obj';
            // template.source = 'function(' + argument + '){\n' + source + '}';
            // return template;
        },
        compile = function (id, template_, context) {
            var templateHandler, templateIsFunction, template, trimmed, templates = context.templates = context.templates || Collection();
            if (isFunction(id)) {
                return templateGenerator(id, context.templateSettings);
            }
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
        fetch = function (url) {
            return Promise(function (s, f) {
                var img = new Image();
                img.onload = s;
                img.onerror = img.ontimeout = img.oncancel = f;
                img.src = url;
            });
        },
        DO_NOT_TRUST = BOOLEAN_FALSE,
        triggersOnElement = function (el, key) {
            return ALL_EVENTS_HASH[whichever] && isFunction(el[whichever]) ? el[whichever]() : BOOLEAN_FALSE;
        },
        makeEachTrigger = function (attr, api, data) {
            var whichever = api || attr;
            return function (manager) {
                var el = manager.element();
                var ret, cachedTrust = DO_NOT_TRUST;
                DO_NOT_TRUST = BOOLEAN_TRUE;
                if (ALL_EVENTS_HASH[whichever] && isFunction(el[whichever])) {
                    el[whichever]();
                } else {
                    managerEventDispatcher(manager, whichever, data);
                }
                DO_NOT_TRUST = cachedTrust;
            };
        },
        triggerEventWrapper = function (attr_, api) {
            var attr = attr_ || api;
            return function (fn, fn2, capturing) {
                var doma = this;
                if (isFunction(fn) || isFunction(fn2)) {
                    doma.on(attr, fn, fn2, capturing);
                } else {
                    doma.each(makeEachTrigger(attr, api, fn));
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
                    makeEachTrigger(attr, api, fn)(manager);
                }
                return manager;
            };
        },
        StringManager = factories.StringManager,
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
        style = function (els, key, value) {
            if (!els[LENGTH]) {
                return;
            }
            intendedObject(key, value, function (key, value_) {
                bound(key, convertStyleValue(key, value_));
            });
        },
        box = function (el, ctx) {
            var computed, ret, pf = parseFloat,
                TEN = 10,
                ZERO = 0;
            if (!isElement(el)) {
                ret = {
                    borderBottom: ZERO,
                    borderRight: ZERO,
                    borderLeft: ZERO,
                    borderTop: ZERO,
                    paddingBottom: ZERO,
                    paddingRight: ZERO,
                    paddingLeft: ZERO,
                    paddingTop: ZERO,
                    marginBottom: ZERO,
                    marginRight: ZERO,
                    marginLeft: ZERO,
                    marginTop: ZERO,
                    height: ZERO,
                    width: ZERO
                };
                if (isWindow(el)) {
                    ret.height = el[INNER_HEIGHT];
                    ret.width = el[INNER_WIDTH];
                } else if (isDocument(el)) {
                    ret.height = el.scrollHeight;
                    ret.width = el.scrollWidth;
                }
                return ret;
            } else {
                if (el.parentNode) {
                    computed = getComputed(el, ctx);
                } else {
                    computed = {};
                }
                return {
                    borderBottom: pf(computed.borderBottomWidth, TEN) || ZERO,
                    borderRight: pf(computed.borderRightWidth, TEN) || ZERO,
                    borderLeft: pf(computed.borderLeftWidth, TEN) || ZERO,
                    borderTop: pf(computed.borderTopWidth, TEN) || ZERO,
                    paddingBottom: pf(computed.paddingBottom, TEN) || ZERO,
                    paddingRight: pf(computed.paddingRight, TEN) || ZERO,
                    paddingLeft: pf(computed.paddingLeft, TEN) || ZERO,
                    paddingTop: pf(computed.paddingTop, TEN) || ZERO,
                    marginBottom: pf(computed.marginBottom, TEN) || ZERO,
                    marginRight: pf(computed.marginRight, TEN) || ZERO,
                    marginLeft: pf(computed.marginLeft, TEN) || ZERO,
                    marginTop: pf(computed.marginTop, TEN) || ZERO,
                    top: pf(computed[TOP], TEN) || ZERO,
                    left: pf(computed[LEFT], TEN) || ZERO,
                    right: pf(computed[RIGHT], TEN) || ZERO,
                    bottom: pf(computed[BOTTOM], TEN) || ZERO,
                    width: pf(computed[WIDTH], TEN) || ZERO,
                    height: pf(computed[HEIGHT], TEN) || ZERO
                };
            }
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
        unitRemoval = function (str, unit) {
            return +(str.split(unit || 'px').join(EMPTY_STRING).trim()) || 0;
        },
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
        filterExpressions = {
            ':even': function (el, idx) {
                return (idx % 2);
            },
            ':odd': function (el, idx) {
                return ((idx + 1) % 2);
            }
        },
        convertUnit = {
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
                number = convertUnit[unit](num, el, winTop, styleAttr);
            }
            number = (number || 0);
            if (!returnNum) {
                number += unit;
            }
            return number;
        },
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
        diff = function (outputA, outputB, diffs_) {
            var opposition, element = this,
                view = element.view,
                first = !diffs_,
                diffs = diffs_ || [],
                target = outputA.length > elements.length ? (opposition = outputA) && outputB : (opposition = outputB) && outputA;
            _.foldl(target, function (diffs, element, index) {
                var correspondant = opposition[index];
                var tagNameA = element.tagName;
                var tagNameB = correspondant.tagName;
                if (tagNameA !== tagNameB) {
                    // swap node
                    return;
                }
                var isA = attributeApi.read(element, 'is');
                var isB = attributeApi.read(correspondant, 'is');
                if (isA || isB) {
                    // swap node
                    return;
                }
            });
            return diffs;
        },
        elementTextOrComment = wrap([1, 3, 8], BOOLEAN_TRUE),
        // {
        //     '1': BOOLEAN_TRUE,
        //     '3': BOOLEAN_TRUE,
        //     '8': BOOLEAN_TRUE
        // },
        createElement = function (tag_, manager, attributes_, children_) {
            var confirmedObject, foundElement, elementName, newElement, newManager, documnt = manager && manager.element(),
                registeredElements = manager && manager.registeredElements,
                attributes = attributes_,
                children = children_,
                tag = tag_;
            if (isObject(tag)) {
                children = tag.children;
                attributes = tag.attributes;
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
            // native create
            if (!tag) {
                exception('custom tag names must be registered before they can be used');
            }
            newElement = documnt.createElement(tag);
            if (foundElement && foundElement !== BOOLEAN_TRUE) {
                attributeApi.write(newElement, CUSTOM_KEY, tag);
            }
            newManager = manager.owner.returnsManager(newElement);
            if (!confirmedObject && !attributes && !children) {
                return newManager;
            }
            if (attributes) {
                newManager.attr(attributes);
            }
            if (!children) {
                return newManager;
            }
            if (isString(children)) {
                newManager.html(children);
            } else {
                newManager.append(reconstruct(children, manager));
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
            return div.children().remove().toArray();
        },
        makeBranch = function (str, manager) {
            return makeTree(str, manager)[0];
        },
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
                    els = els.toArray();
                }
                if (!isArrayLike(els)) {
                    els = els && toArray(els);
                }
                frag = context.createDocumentFragment();
                duff(els, function (manager_) {
                    var parentNode, manager = context.returnsManager(manager_),
                        el = manager.element();
                    if (!manager.is(ELEMENT) || manager.is(FRAGMENT)) {
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
                return string !== UNDEFINED ? dom.eachCall(attr, string) && dom : dom.results(attr).join(EMPTY_STRING);
            };
        },
        horizontalTraverser = function (method, _idxChange) {
            return attachPrevious(function (context, idxChange_) {
                var collected = [],
                    list = context.toArray(),
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
                key = kebabCase(_key),
                sliced = key.slice(0, 5);
            if (dataString !== sliced) {
                key = dataString + key;
            }
            return key;
        },
        styleAttributeManipulator = function (manager, key, value) {
            var element = manager.element();
            if (manager.is(ELEMENT)) {
                if (value === BOOLEAN_TRUE) {
                    return element[STYLE][key];
                } else {
                    element[STYLE][key] = value;
                }
            }
        },
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
        _eventExpander = foldl({
            resize: 'resize,orientationchange',
            ready: 'DOMContentLoaded',
            wheel: 'wheel,mousewheel',
            deviceorientation: 'deviceorientation,mozOrientation',
            fullscreenchange: 'webkitfullscreenchange,mozfullscreenchange,fullscreenchange,MSFullscreenChange',
            hover: 'mouseenter,mouseleave',
            forcewillbegin: 'mouseforcewillbegin,webkitmouseforcewillbegin',
            forcechange: 'mouseforcechange,webkitmouseforcechange',
            forcedown: 'mouseforcedown,webkitmouseforcedown',
            forceup: 'mouseforceup,webkitmouseforceup',
            force: 'mouseforcewillbegin,webkitmouseforcewillbegin,mouseforcechange,webkitmouseforcechange,mouseforcedown,webkitmouseforcedown,mouseforceup,webkitmouseforceup'
        }, function (memo, value, key) {
            memo[key] = toArray(value);
        }, {}),
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
                // prevents circular
                if (!hadInList) {
                    stack.push(name);
                }
                if (expanders[name] && !hadInList) {
                    duff(expanders[name], eventExpander(expanders, fn, stack.slice(0)));
                    stack.pop();
                    return BOOLEAN_TRUE;
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
        elementSwapper = {
            window: function (manager) {
                return manager.owner.window();
            },
            document: function (manager) {
                return manager.owner;
            }
        },
        _addEventListener = function (manager_, eventNames, group, selector_, handler, capture) {
            var events, selector = selector_,
                manager = elementSwapper[selector] ? ((selector = '') || elementSwapper[selector_](manager_)) : manager_,
                wasCustom = manager.is(CUSTOM),
                spaceList = toArray(eventNames, SPACE),
                handlesExpansion = function (name, passedName, nameStack) {
                    events = events || manager.directive(EVENT_MANAGER);
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
                },
                expansion = eventExpander(manager.owner.events.expanders, handlesExpansion);
            duff(spaceList, function (evnt) {
                if (expansion(evnt)) {
                    handlesExpansion(evnt, evnt, [evnt]);
                }
            });
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
        appendChildDomManager = function (el) {
            return this.insertAt(el, NULL);
        },
        prependChild = function (el) {
            return this.insertAt(el, 0);
        },
        sharedInsertBefore = function (els, index, clone) {
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
        getInnard = function (attribute) {
            return function (manager, index) {
                var windo, win, doc, parentElement, returnValue = EMPTY_STRING;
                if (manager.is(IFRAME)) {
                    testIframe(manager);
                    windo = manager.window();
                    if (windo && windo.is(ACCESSABLE)) {
                        parentElement = windo.element();
                        return wraptry(function () {
                            var doc = parentElement[DOCUMENT];
                            return doc.body ? doc.body[PARENT_NODE].outerHTML : EMPTY_STRING;
                        });
                    }
                } else {
                    if (manager.is(ELEMENT)) {
                        parentElement = manager.element();
                        return parentElement[attribute];
                    }
                }
                return EMPTY_STRING;
            };
        },
        setInnard = function (attribute, value, vars) {
            return function (manager, index) {
                var children, previous, cachedValue, win, doc, windo, doTheThing, parentElement,
                    writes = BOOLEAN_TRUE,
                    owner = manager.owner,
                    appliedvalue = value || EMPTY_STRING;
                if (manager.is(IFRAME)) {
                    windo = manager.window();
                    testIframe(manager);
                    if (windo.is(ACCESSABLE)) {
                        parentElement = windo.element();
                        doc = parentElement[DOCUMENT];
                        doc.open();
                        each(vars, function (value, key) {
                            parentElement[key] = value;
                        });
                        doc.write(toFunction(appliedvalue)(manager));
                        doc.close();
                        doTheThing = BOOLEAN_TRUE;
                    }
                } else {
                    if (manager.is(ELEMENT)) {
                        parentElement = manager.element();
                        if (attribute === INNER_HTML) {
                            if (isArray(appliedvalue)) {
                                writes = BOOLEAN_FALSE;
                                manager.render(appliedvalue);
                                appliedvalue = manager.html();
                            } else {
                                children = manager.$(CUSTOM_ATTRIBUTE).toArray();
                                previous = parentElement[attribute];
                            }
                        }
                        if (writes) {
                            previous = parentElement[attribute];
                            appliedvalue = toFunction(appliedvalue)(previous, index);
                            if (appliedvalue !== previous) {
                                parentElement[attribute] = appliedvalue;
                            }
                        }
                        if (children && children[LENGTH]) {
                            // detach old
                            dispatchDetached(children, owner);
                            // establish new
                        }
                        if (writes) {
                            manager.$(CUSTOM_ATTRIBUTE, parentElement);
                            if (previous !== appliedvalue) {
                                manager.dispatchEvent('contentChanged');
                            }
                        }
                    }
                }
            };
        },
        innardManipulator = function (attribute) {
            return function (value, vars) {
                var manager = this,
                    returnValue = manager;
                if (value === UNDEFINED) {
                    return manager.map(getInnard(attribute, manager)).join(EMPTY_STRING);
                } else {
                    manager.each(setInnard(attribute, value, vars));
                    return manager;
                }
            };
        },
        testIframe = function (manager, element_) {
            var src, contentWindow, contentWindowManager, element, cached;
            manager.remark(IFRAME, manager.tagName === IFRAME);
            if (!manager.is(IFRAME)) {
                return;
            }
            element = element_ || manager.element();
            src = element.src;
            contentWindow = element.contentWindow;
            manager.remark('windowReady', !!contentWindow);
            if (!contentWindow) {
                return;
            }
            contentWindowManager = manager.owner.returnsManager(contentWindow);
            contentWindowManager.iframe = manager;
            markGlobal(contentWindowManager, contentWindow, src);
            if (!(cached = manager.cachedContent) || !contentWindowManager.is(ACCESSABLE)) {
                manager.cachedContent = NULL;
                return;
            }
            // must be string
            manager.cachedContent = NULL;
            manager.html(cached ? cached.string : '', (cached ? cached.vars : {}));
        },
        cachedDispatch = factories.Events[CONSTRUCTOR][PROTOTYPE][DISPATCH_EVENT],
        RUNNING_EVENT = 'runningEvent',
        eventDispatcher = function (manager, name, e, capturing_, DO_NOT_TRUST) {
            var capturing = !!capturing_;
            manager.owner.mark(RUNNING_EVENT);
            var validated = validateEvent(e, manager.element(), name);
            var returnValue = cachedDispatch.call(manager, name, validated, {
                capturing: capturing
            });
            manager.owner.remark(RUNNING_EVENT, DO_NOT_TRUST);
            return returnValue;
        },
        nodeDocument = function (el) {
            return isElement(el) ? el.ownerDocument : (isDocument(el) ? el : (isWindow(el) ? el.document : document));
        },
        nodeWindow = function (el) {
            return isWindow(el) ? el : (isDocument(el) ? el.defaultView : (isElement(el) ? el.ownerDocument.defaultView : window));
        },
        elementEventDispatcher = function (el_, name, opts, doc_, view_) {
            var evnt, el = el_,
                doc = doc_ || nodeDocument(el),
                view = view_ || doc.defaultView;
            if (view.Event && !_.isIE) {
                evnt = new view.Event(name, (isBoolean(opts) ? {
                    bubbles: opts
                } : opts) || {});
            } else if (doc.createEvent) {
                evnt = doc.createEvent('HTMLEvents');
                evnt.initEvent(name, BOOLEAN_TRUE, BOOLEAN_TRUE);
            } else if (doc.createEventObject) { // IE < 9
                evnt = doc.createEventObject();
                evnt.eventType = name;
            }
            evnt.name = name;
            if (el.dispatchEvent) {
                el.dispatchEvent(evnt);
            } else if (el.fireEvent && htmlEvents['on' + name]) { // IE < 9
                el.fireEvent('on' + evnt.eventType, evnt);
                // can trigger only real event (e.g. 'click')
            } else if (el[name]) {
                el[name]();
            }
        },
        managerEventDispatcher = function (manager, name, opts) {
            var owner = manager.owner;
            elementEventDispatcher(manager.element(), name, opts, owner.element(), owner.window().element());
        },
        /*
         * missing these
         * @type {Object}
         */
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
        directEvents = toArray('blur,focus,focusin,focusout,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,mouseenter,mouseleave,change,select,submit,keydown,keypress,keyup,error,contextmenu'),
        // collected here so DOMA can do what it wants
        allDirectMethods = directEvents.concat(_.keys(videoDirectEvents), _.keys(directAttributes)),
        isAttached = function (element_, owner, passed_element_) {
            var isAttachedResult, parent, potential, manager = owner.returnsManager(element_),
                element = passed_element_ || manager.element();
            if ((isAttachedResult = manager.is(ATTACHED))) {
                return isAttachedResult;
            }
            if (manager.is(WINDOW)) {
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
        eachCall = _.eachCall,
        dispatchDomEvent = function (evnt, mark) {
            return function (list, owner) {
                var managers = [];
                // mark all managers first
                duff(list, function (element) {
                    var tagname = element[TAG_NAME].toLowerCase();
                    var registeredOptions = owner.registeredElementOptions[tagname] || {};
                    var autotriggers = registeredOptions.autotriggers || {};
                    if (autotriggers[evnt]) {
                        return;
                    }
                    var m = owner.returnsManager(element);
                    if (m.remark(ATTACHED, mark) && m.is(ELEMENT) && m.is(CUSTOM_LISTENER)) {
                        managers.push(m);
                    }
                });
                eachCall(managers, DISPATCH_EVENT, evnt);
            };
        },
        dispatchDetached = dispatchDomEvent('detach', BOOLEAN_FALSE),
        dispatchAttached = dispatchDomEvent('attach', BOOLEAN_TRUE),
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
        queueAttributeValues = function (attribute_, second_, third_, api_, domHappy_, merge, passedTrigger_) {
            var attribute = attribute_ === CLASS ? CLASSNAME : attribute_,
                domHappy = domHappy_ || kebabCase,
                api = api_,
                kebabCased = api.preventUnCamel ? attribute : domHappy(attribute),
                withClass = kebabCased === CLASSNAME || kebabCased === CLASS__NAME,
                trigger = (withClass ? (api = propertyApi) && (kebabCased = CLASSNAME) && CLASSNAME : passedTrigger_) || kebabCased;
            api = propsHash[camelCase(trigger)] ? propertyApi : attributeApi;
            return function (manager, idx) {
                var converted, generated, el = manager.element(),
                    read = api.read(el, kebabCased),
                    returnValue = manager,
                    attributeManager = ensureManager(manager, kebabCased, read);
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
                    manager.mark(ATTRIBUTES_CHANGING);
                    if (attributeManager.is(REMOVING)) {
                        attributeManager.unmark(REMOVING);
                        api.remove(el, kebabCased);
                        generated = BOOLEAN_FALSE;
                    } else {
                        generated = attributeManager.generate(SPACE);
                        api.write(el, kebabCased, cautiousConvertValue(generated));
                        if (generated === EMPTY_STRING) {
                            generated = BOOLEAN_TRUE;
                        }
                    }
                }
                if (generated !== read && manager.is(CUSTOM_LISTENER)) {
                    dispatchAttrChange(manager, trigger, read, generated);
                }
            };
        },
        dispatchAttrChange = function (manager, trigger, old, newish) {
            // manager.mark(ATTRIBUTES_CHANGING);
            return manager[DISPATCH_EVENT](ATTRIBUTE_CHANGE + COLON + trigger, {
                previous: old,
                current: convertAttributeValue(newish)
            });
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
        attrApi = getSetter(queueAttributeValues, attributeApi, kebabCase),
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
        // makeValueTarget = function (target, passed_, api, domaHappy) {
        //     var passed = passed_ || target;
        //     return _.foldl(toArray('add,remove,toggle,change,has,set'), function (memo, method_) {
        //         var method = method_ + 'Value';
        //         memo[method_ + capitalize(target)] = function (one, two) {
        //             return this[method](passed, one, two, api, domaHappy, target);
        //         };
        //         return memo;
        //     }, {});
        // },
        classApplicationWrapper = function (key, hasList, noList) {
            return function (element, list, second) {
                if (element.classList && element.classList[key] && !isIE) {
                    return hasList(element, list, second);
                } else {
                    return noList(element, toArray(element[CLASSNAME] ? element[CLASSNAME] : [], SPACE), list, second);
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
        arrayAdds = _.add,
        arrayRemoves = _.remove,
        // ua = (win.navigator && win.navigator.userAgent),
        isIE = !!(function () {
            var sAgent = window.navigator.userAgent;
            var Idx = sAgent.indexOf("MSIE");
            // If IE, return version number.
            if (Idx > 0) return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
            // If IE 11 then look for Updated user agent string.
            else if (!!navigator.userAgent.match(/Trident\/7\./)) return 11;
            else return 0; //It is not IE
        }()),
        classApiShim = {
            /**
             * This method adds the list or space delineated string to the target manager's element.
             * @method
             * @name DomManager # addClass
             * @example <caption>Add a spaces separated list of classes.</caption>
             * targetManager.addClass('item1 class2');
             * @example
             * targetManager.addClass(['item1', 'class2']);
             */
            add: classApplicationWrapper('add', function (element, list) {
                element.classList.add.apply(element.classList, list);
            }, function (element, current, list) {
                duff(list, passesFirstArgument(bind(arrayAdds, NULL, current)));
                element[CLASSNAME] = current.join(SPACE);
            }),
            /**
             * This method removes the list or space delineated string to the target manager's element.
             * @method
             * @name DomManager#removeClass
             * @example <caption>Remove a spaces separated list of classes.</caption>
             * targetManager.removeClass('item1 class2');
             * @example
             * targetManager.removeClass(['item1', 'class2']);
             */
            remove: classApplicationWrapper('remove', function (element, list) {
                element.classList.remove.apply(element.classList, list);
            }, function (element, current, list) {
                duff(list, passesFirstArgument(bind(arrayRemoves, NULL, current)));
                element[CLASSNAME] = current.join(SPACE);
            }),
            /**
             * This method toggles the list or space delineated string to the target manager's element. A second argument can be passed to toggle the class in a direction a truthy value will add the class, a falsey value will remove the class. Super useful if you want to direct the classes and you do not want any logic to clutter up your calls.
             * @param {String|Array} classes toggle the space delineated classes that are passed
             * @param {Boolean} [direction] direct the classes based on an external boolean. A boolean, not just truthy or falsy value to determine whether the class should be added or removed.
             * @method
             * @name DomManager#toggleClass
             * @example <caption>The following examples toggle the item1 and class2 classes.</caption>
             * targetManager.toggleClass('item1 class2');
             * @example <caption>Passing true adds classes.</caption>
             * targetManager.toggleClass(['item1', 'class2'], true); // equivalent to calling addClass
             * @example <caption>passing false removes classes.</caption>
             * targetManager.toggleClass('item1 class2', false); // equivalent to calling removeClass
             */
            toggle: classApplicationWrapper('toggler', noop, function (element, current, list, direction) {
                duff(list, passesFirstArgument(bind(toggles, NULL, current, direction)));
                element[CLASSNAME] = current.join(SPACE);
            }),
            /*
             *
             */
            contains: classApplicationWrapper('contains', function (element, list) {
                return !element.classList.contains.apply(element.classList, list);
            }, function (element, current, list) {
                return find(list, function (item) {
                    return !has(current, item, BOOLEAN_TRUE);
                });
            }),
            /**
             * This method both removes and adds classes at the same time, and in that order.
             * @method
             * @name DomManager#changeClass
             * @param {String|Array|Null} remove List of classes to remove from the element.
             * @param {String|Array|Null} add List of classes to add to the element.
             */
            change: classApplicationWrapper('add', function (element, list, second) {
                element.classList.remove.apply(element.classList, list);
                element.classList.add.apply(element.classList, toArray(second, SPACE));
            }, function (element, current, list, second) {
                duff(list, passesFirstArgument(bind(arrayRemoves, NULL, current)));
                duff(second, passesFirstArgument(bind(arrayAdds, NULL, current)));
                element[CLASSNAME] = current.join(SPACE);
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
        }, {
            /**
             * This method checks class attribute against the list or space delineated string to make sure all of the questioned classes are present. If one or more are missing the method will return false.
             * @method
             * @name DomManager#hasClass
             * @param  {String|Array} classes the classes to check against
             * @return {Boolean}
             * @example
             * target.hasClass('item1'); // true
             * @example <caption>Check for multiple classes at the same time.</caption>
             * target.hasClass('item1 item2 item3');
             * @example <caption>An array can also be passed.</caption>
             * target.hasClass(['item1', 'item2', 'item3']);
             */
            has: function (manipulator) {
                return function (classes) {
                    return !this.find(manipulator(toArray(classes, SPACE)));
                };
            }
        }), function (memo, handler, key) {
            memo[key + 'Class'] = handler(passer(key === 'has' ? 'contains' : key));
        }, {}),
        markCustom = function (manager, forceCustom, element_) {
            var resultant, isCustom, isCustomValue = manager.is(ELEMENT) && attributeApi.read(element_ || manager.element(), CUSTOM_KEY);
            // more efficient way to do this?
            manager.remark(CUSTOM, forceCustom || !!isCustomValue);
            if (manager.is(CUSTOM) && !isCustomValue) {
                isCustomValue = BOOLEAN_TRUE;
            }
            resultant = manager.is(ELEMENT) && writeAttribute(element_ || manager.element(), CUSTOM_KEY, isCustomValue);
            if (isCustomValue) {
                manager[REGISTERED_AS] = isCustomValue;
            }
        },
        markElement = function (manager, owner, element) {
            manager.unmark(ELEMENT);
            manager.unmark(IFRAME);
            manager[TAG_NAME] = BOOLEAN_FALSE;
            if (manager.is(WINDOW)) {
                return;
            }
            if ((manager.remark(ELEMENT, isElement(element)))) {
                manager.tagName = tag(element).toLowerCase();
                manager.owner = owner;
                testIframe(manager, element);
                markCustom(manager, BOOLEAN_FALSE, element);
            }
        },
        markGlobal = function (manager, element, src) {
            var isAccessable;
            manager.remark(WINDOW, isWindow(element));
            if (!manager.is(WINDOW) || !manager.owner) {
                return;
            }
            manager.remark(ACCESSABLE, (isAccessable = !!wraptry(function () {
                return element[DOCUMENT];
            })));
            manager.remark('topWindow', (element === element.top));
            manager.setAddress();
            // either the window is null, (we're detached),
            // or it is an unfriendly window
            if (!isAccessable) {
                return;
            }
            if (manager.is('topWindow')) {
                // tests do never fail on top window because it always
                // exists otherwise this code would not run
                return;
            }
            // more accessable tests
            manager.remark(ACCESSABLE, manager.sameOrigin());
        },
        test = function (manager, owner, element) {
            markGlobal(manager, element);
            markElement(manager, owner, element);
            manager.unmark(DOCUMENT);
            manager.unmark(FRAGMENT);
            manager.unmark(ATTACHED);
            if (manager.is(WINDOW)) {
                manager.mark(ATTACHED);
                return;
            }
            manager.remark(DOCUMENT, isDocument(element));
            manager.remark(FRAGMENT, isFragment(element));
            if (manager.is(DOCUMENT)) {
                manager.mark(ATTACHED);
                return;
            }
            if (manager.is(FRAGMENT)) {
                manager.unmark(ATTACHED);
                return;
            }
            manager.remark(ATTACHED, isAttached(manager, owner, element));
        },
        grabConstructor = function (key, windo) {
            var constrcktr;
            return (constrcktr = windo[key]) ? function (argument) {
                return new constrcktr(argument);
            } : factories[key];
        },
        DOMA_SETUP = factories.DOMA_SETUP = function (windo_) {
            var registeredElements, $, setup, wrapped, windo = windo_,
                doc = windo[DOCUMENT],
                manager = returnsManager(doc, BOOLEAN_TRUE),
                unregisteredElements = Registry(),
                expanders = cloneJSON(_eventExpander),
                cachedMotionEvent, lastCalculatedMotionEvent = 0,
                cachedMotionCalculation = {},
                registeredConstructors = {},
                registeredDomConstructors = {},
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
                },
                // autoTriggerAttrChange = unmarkChange(function (manager, idx) {
                //     return dispatchAttrChange(manager, key, old, newish);
                // }),
                registerElDefaultHandlers = {
                    create: function (e) {
                        var elManager = manager.owner.returnsManager(this);
                        elManager.mark('created');
                        return elManager.dispatchEvent('create', e);
                    },
                    attributeChange: function (key, old, newish) {
                        var elManager = manager.owner.returnsManager(this);
                        if (elManager.is(ATTRIBUTES_CHANGING)) {
                            return;
                        }
                        return unmarkChange(function (manager, idx) {
                            elManager.mark(ATTRIBUTES_CHANGING);
                            return dispatchAttrChange(elManager, key, old, newish);
                        })(elManager);
                    }
                },
                formsCallbacks = function (opts, list, autotriggers) {
                    return foldl(list, function (memo, evnt, item) {
                        var value = opts[evnt];
                        var val = !!value;
                        if (val) {
                            autotriggers[evnt] = val;
                            memo[item + 'Callback'] = (isFunction(value) ? {
                                value: value
                            } : (val ? (registerElDefaultHandlers[evnt] ? {
                                value: registerElDefaultHandlers[evnt]
                            } : {
                                value: function (e) {
                                    var m;
                                    if ((m = manager.data.get(this)) && (m = m[DOM_MANAGER_STRING])) {
                                        if (m.is('created')) {
                                            return m.dispatchEvent(evnt, e);
                                        }
                                    }
                                }
                            }) : (value || opts[item + 'Callback'])));
                        }
                    }, {});
                },
                remap = function (options) {
                    return foldl(options, function (memo, value, key) {
                        if (value === NULL) {
                            return;
                        }
                        memo[key] = isObject(value) ? value : {
                            value: value
                        };
                    }, {});
                },
                deltas = {
                    update: function (node, attrs, children, hash) {
                        var results;
                        each(attrs, function (value, key) {
                            if (propsHash[key]) {
                                propertyApi.write(node, kebabCase(key), value);
                            } else {
                                attributeApi.write(node, kebabCase(key), value);
                            }
                        });
                        results = isString(children) ? (node.innerHTML = children) : duff(children, function (child) {
                            appendChild(node, deltas.create(child, node, hash));
                        });
                        return node;
                    },
                    create: function (virtual, parent, hash) {
                        var key, data, created;
                        if (virtual[0] === 'text') {
                            parent.innerHTML += virtual[1];
                            return;
                        }
                        created = doc.createElement(virtual[0]);
                        data = virtual[3];
                        if (data && data.key) {
                            if (hash[data.key]) {
                                exception('can\'t have a non unique key at ' + data.key);
                            }
                            hash[data.key] = created;
                        }
                        parent.appendChild(deltas.update(created, virtual[1], virtual[2], hash));
                        return created;
                    },
                    resetHtml: function (target, newhtml, context) {
                        return function () {
                            context.owner.returnsManager(target).html(newhtml);
                        };
                    },
                    removeNodes: function (els, diffs) {
                        return function () {
                            var removableEls = _.filter(els, function (el) {
                                return !_.find(diffs.keys, function (element, key) {
                                    return element === el;
                                });
                            });
                            return removableEls[LENGTH] ? duff(removableEls, passesFirstArgument(removeChild)) : BOOLEAN_FALSE;
                        };
                    },
                    addNodes: function (parent, els, context, hash) {
                        var frag = doc.createDocumentFragment();
                        duff(els, function (el) {
                            deltas.create(el, frag, hash);
                        });
                        return function () {
                            parent.appendChild(frag);
                            return BOOLEAN_TRUE;
                        };
                    },
                    updateAttribute: function (element, key, value) {
                        return function () {
                            attributeApi.write(element, key, value);
                        };
                    },
                    replaceNode: function (a, b, index, hash, diffs, frag_) {
                        var frag = frag_,
                            parent = a[PARENT_NODE];
                        if (!frag) {
                            frag = doc.createDocumentFragment();
                            deltas.create(b, frag, hash);
                        }
                        return function () {
                            insertBefore(parent, frag, a);
                            var result = a[__ELID__] ? $(a).remove() : removeChild(a);
                        };
                    }
                };
            if (manager.is('constructed')) {
                return manager.$;
            }
            manager.remark('ie', isIE);
            registeredElements = clone(validTagsNamesHash);
            setup = function (e) {
                manager.DOMContentLoadedEvent = e;
                manager.mark('ready');
            };
            $ = function (sel, ctx) {
                var context = ctx || manager;
                return DOMA(sel, context, BOOLEAN_FALSE, manager === context, manager);
            };
            wrapped = extend([wrap({
                // $: $,
                createElements: createElements,
                createDocumentFragment: createDocumentFragment,
                registeredElementName: registeredElementName,
                fragment: function () {
                    return returnsManager(fragment(NULL, manager), manager);
                }
            }, function (handler) {
                return function (one) {
                    return handler(one, manager);
                };
            }), wrap({
                makeTree: makeTree,
                makeBranch: makeBranch,
                createElement: createElement,
                diff: diff,
                ready: setupDomContentLoaded
            }, function (handler) {
                return function (one, two, three) {
                    return handler(one, manager, two, three);
                };
            }), {
                $: $,
                buildCss: buildCss,
                nodeComparison: function (a, b, hash_, stopper) {
                    return nodeComparison(a, b, hash_, stopper, NULL, NULL, NULL, manager);
                },
                supports: {},
                deltas: deltas,
                registeredDomConstructors: registeredDomConstructors,
                registeredConstructors: registeredConstructors,
                registeredElementOptions: registeredElementOptions,
                iframeContent: iframeContent,
                ordersEventsByHierarchy: returns(BOOLEAN_TRUE),
                // data: factories.WeakMap(),
                document: manager,
                devicePixelRatio: devicePixelRatio,
                constructor: DOMA[CONSTRUCTOR],
                registeredElements: registeredElements,
                templateSettings: {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g
                },
                // WeakMap: factories.WeakMap, //
                WeakMap: grabConstructor('WeakMap', windo),
                ResizeObserver: grabConstructor('ResizeObserver', windo),
                events: {
                    custom: {},
                    expanders: cloneJSON(_eventExpander),
                    lists: wrap({
                        base: Events,
                        svg: SVGEvent,
                        keyboard: KeyboardEvent,
                        gamepad: GamePadEvent,
                        composition: CompositionEvents,
                        mouse: MouseEvents,
                        touch: TouchEvents,
                        device: DeviceEvents,
                        focus: FocusEvents,
                        time: TimeEvents,
                        animation: AnimationEvents,
                        audioProcessing: AudioProcessingEvents,
                        ui: UIEvents,
                        progress: ProgressEvent,
                        all: AllEvents
                    }, cloneJSON)
                },
                returnsManager: function (item) {
                    return item === manager || item === manager.element() ? manager : returnsManager(item, manager);
                },
                // hasManager: function (element) {
                //     var data, id;
                //     return (element && ((isWindow(element) || isDocument(element)) ? BOOLEAN_FALSE : id = element[__ELID__]) && (data = manager.data.get(element, id)) && data[DOM_MANAGER_STRING]);
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
                customAttribute: function (key) {
                    return key ? makeDataAttr(CUSTOM_KEY, key) : CUSTOM_ATTRIBUTE;
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
                        compile(script.prop(ID), script.html(), manager);
                    }).remove();
                },
                unregisteredElement: function (manager) {
                    unregisteredElements.keep(manager.registeredElementName(), manager[__ELID__], manager);
                },
                registerElement: function (name, options) {
                    var xtends, opts = options || {};
                    var manager = this;
                    var docManager = this.document;
                    var doc = docManager.element();
                    var events = merge({}, opts.events);
                    var managerFn = opts.managerFn || {};
                    // var sup = opts.super;
                    var autotriggers = {};
                    if (registeredElements[name]) {
                        if (registeredElements[name] === BOOLEAN_TRUE) {
                            exception('custom element names must not be used natively by browsers');
                        } else {
                            exception('custom element names can only be registered once per document');
                        }
                    } else {
                        registeredElements[name] = xtends ? registeredElements[xtends] : xtends;
                    }
                    delete opts.managerFn;
                    // delete managerFn.events;
                    managerFn.events = events;
                    var sup = opts.super || HTMLElement;
                    var constructor = opts.create;
                    var newproto = Object.create(sup[PROTOTYPE], remap(extend([newproto, opts.fn || {}, formsCallbacks(opts, {
                        created: 'create',
                        attached: 'attach',
                        detached: 'detach',
                        attributeChanged: 'attributeChange'
                    }, autotriggers)])));
                    newproto.fn = newproto;
                    var arg2 = {
                        prototype: newproto
                    };
                    if (xtends) {
                        arg2.extends = opts.extends;
                    }
                    // constructor
                    docManager.registeredElementOptions[name] = {
                        // events: events,
                        autotriggers: autotriggers
                    };
                    var constrktr = registeredConstructors[name] = DomManager.extend(capitalize(camelCase(name)), managerFn || {});
                    var con = doc.registerElement(name, arg2);
                    registeredDomConstructors[name] = con;
                    return constrktr;
                },
                script: function (url, attrs, inner) {
                    var script = manager.createElement('script', attrs);
                    // should this be head
                    return Promise(function (success, failure) {
                        var $body = manager.$('body').item(0);
                        var innard = inner || BOOLEAN_FALSE;
                        var src = url || BOOLEAN_FALSE;
                        if (src) {
                            $body.append(script);
                            script.src(src);
                            script.on({
                                load: success,
                                'error timeout cancel abort': failure
                            });
                        } else {
                            wraptry(function () {
                                script.html(innard);
                                success(innard);
                                $body.append(script);
                            }, function () {
                                failure(innard);
                            });
                        }
                    });
                },
                style: function (url, attrs, inner) {
                    return Promise(function (success, failure) {
                        var style, innard = inner || BOOLEAN_FALSE;
                        var src = url || BOOLEAN_FALSE;
                        var baseAttrs = {
                            type: 'text/css',
                            rel: 'stylesheet'
                        };
                        if (src) {
                            style = manager.createElement('link', extend([baseAttrs, attrs, {
                                href: url
                            }]));
                            manager.$('head').item(0).append(style);
                            $.HTTP({
                                type: 'get',
                                url: url
                            }).then(function () {
                                return style;
                            });
                        } else {
                            style = manager.createElement('style', merge(baseAttrs, attrs), innard);
                            manager.$('head').item(0).append(style);
                            success(style);
                        }
                    });
                }
            }]);
            var weak = wrapped.data = ElementalWeakMap();
            merge(manager, wrapped);
            merge($, wrapped);
            runSupport(manager.supports, manager);
            setupDomContentLoaded(setup, manager);
            manager.mark('constructed');
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
        styleManipulator = function (one, two, important) {
            var unCameled, styles, manager = this;
            if (!manager[LENGTH]()) {
                return manager;
            }
            if (isString(one) && two === UNDEFINED) {
                unCameled = kebabCase(one);
                return (manager = manager.item(0)) && (styles = manager.getStyle()) && ((prefix = find(prefixedStyles[camelCase(one)], function (prefix) {
                    return styles[prefix + unCameled] !== UNDEFINED;
                })) ? styles[prefix + unCameled] : styles[prefix + unCameled]);
            } else {
                manager.each(unmarkChange(function (manager) {
                    return applyStyle(manager.element(), one, two, important);
                }));
                return manager;
            }
        },
        getValueCurried = getValue(returnsFirst),
        setValueCurried = setValue(domIterates),
        manager_query = function (selector) {
            var manager = this;
            var target = manager.element();
            return manager.owner.$(isArrayLike(selector) ? selector : query(selector, target, manager), target);
        },
        isAppendable = function (els) {
            return els.isValidDomManager ? (els.is('element') || els.is('fragment')) : (isElement(els) || isFragment(els));
        },
        iframeChangeHandler = function () {
            var windo;
            if ((windo = this.window())) {
                windo.unmark(ACCESSABLE);
                testIframe(this);
            }
        },
        childByTraversal = function (manager, parent, element, idxChange_, ask_, isString) {
            var target, found,
                idxChange = idxChange_,
                children = collectChildren(parent),
                startIndex = indexOf(children, element),
                ask = ask_;
            if (isString) {
                idxChange = idxChange || 1;
                target = element;
                ask = convertSelector(ask, manager.owner);
                while (target && !found) {
                    target = children[(startIndex = (startIndex += idxChange))];
                    found = matchesSelector(target, ask, parent.owner);
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
            return (manager.is(ELEMENT) && manager.is(markedListener ? CUSTOM_LISTENER : CUSTOM) ? [element] : []).concat(query(CUSTOM_ATTRIBUTE, element, manager));
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
                    attributeApi.write(element, kebabCase(key), value);
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
                cachedObjectEventConstructor.call(evnt, parse(originalEvent.data), options.origin, type, NULL, evnt.timeStamp);
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
                evnt.target = origin.owner.returnsManager(evnt.target);
                if (evnt.toElement) {
                    evnt.toElement = origin.owner.returnsManager(evnt.toElement);
                }
                if (evnt.view) {
                    evnt.view = origin.owner.returnsManager(evnt.view);
                }
                evnt.remark('trusted', _.has(originalEvent, IS_TRUSTED) ? originalEvent[IS_TRUSTED] : !DO_NOT_TRUST);
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
                var evnt = this,
                    owner = evnt.origin.owner;
                return owner.motion();
            },
            preventDefault: function () {
                var e = this.originalEvent;
                this[DEFAULT_PREVENTED] = BOOLEAN_TRUE;
                if (e && e.preventDefault) {
                    e.preventDefault();
                }
            },
            trusted: function () {
                return this.isTrusted;
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
        DomEventsManager = factories.EventsManager.extend('DomEventsManager', {
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
                    items = list.toArray(),
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
                        list.toArray().push(evnt);
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
                if (!start.is(ELEMENT) || element[PARENT_NODE]) {
                    return BOOLEAN_FALSE;
                }
                return start.parent(function (element) {
                    if (start.element() !== element) {
                        if (element[__ELID__]) {
                            parent = start.owner.returnsManager(element);
                            if (parent.is(CUSTOM_LISTENER)) {
                                return [parent, BOOLEAN_TRUE];
                            }
                        }
                    }
                    return [element[PARENT_NODE], BOOLEAN_FALSE];
                });
            },
            subset: function (list_, evnt) {
                var ordersEventsByHierarchy, parent, found, target, sumCount, element, counter, el, afterwards, selector, branch, first, mainHandler, delegateCount, captureCount, i = 0,
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
                target = evnt.target.element();
                // there are no delegated events, so just return everything after capture
                if (!delegateCount || target === el) {
                    return list_.slice(captureCount);
                }
                sumCount = captureCount + delegateCount;
                i = captureCount;
                afterwards = list_.slice(sumCount);
                ordersEventsByHierarchy = manager.ordersEventsByHierarchy();
                while (i < sumCount) {
                    first = list_[i];
                    ++i;
                    selector = first.selector;
                    counter = -1;
                    parent = target;
                    while (!found && parent && isElement(parent) && parent !== el) {
                        ++counter;
                        if (matchesSelector(parent, selector, manager.owner)) {
                            found = parent;
                            // hold on to the temporary target
                            first.temporaryTarget = found;
                            // how far up did you have to go before you got to the top
                            first.parentNodeNumber = counter;
                            if (ordersEventsByHierarchy) {
                                if (!(j = list[LENGTH])) {
                                    list.push(first);
                                } else {
                                    while (first && j && list[--j]) {
                                        if (list[j].parentNodeNumber <= first.parentNodeNumber) {
                                            list.splice(j + 1, 0, first);
                                            first = NULL;
                                        } else {
                                            if (!j) {
                                                list.unshift(first);
                                            }
                                        }
                                    }
                                }
                            } else {
                                list.push(first);
                            }
                        }
                        parent = parent[PARENT_NODE];
                    }
                    found = NULL;
                }
                return list.concat(afterwards);
            }
        }),
        windowIsVisible = function (windo_, perspective) {
            var notVisible = BOOLEAN_FALSE,
                windo = windo_;
            while (!windo.is('topWindow') && !notVisible) {
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
        dimensionFinder = function (element, doc, win, usescrolling) {
            return function (num) {
                var ret, body, documnt, manager = this[ITEM](num);
                if (!manager) {
                    return 0;
                }
                if (manager.is(ELEMENT)) {
                    ret = clientRect(manager.element())[element];
                } else {
                    if (manager.is(DOCUMENT) && (documnt = manager.element()) && (usescrolling ? (body = (documnt && (documnt.scrollingElement || documnt[BODY]))) : (body = documnt[BODY]))) {
                        ret = body[doc];
                    } else {
                        if (manager.is(WINDOW) && manager.is(ACCESSABLE)) {
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
                exception('custom elements must be registered before they can be used');
            }
            manager = new Wrapper[CONSTRUCTOR](manager, data, owner);
            return manager;
        },
        removeHandler = function (fragment, handler) {
            var el, timeoutId, parent, manager = this,
                cachedRemoving = manager.is(REMOVING) || BOOLEAN_FALSE;
            if (cachedRemoving || !(el = manager.element()) || !(parent = el[PARENT_NODE])) {
                // can't remove because already removed
                return manager;
            }
            manager.mark(REMOVING);
            if (manager.is(IFRAME) && handler && isFunction(handler)) {
                // use the parent window's setTimeout
                // do we need a way to cancel it if it gets reattached?
                manager.owner.window().element().setTimeout(bind(handler, manager, manager));
            }
            removeChild(el, fragment);
            dispatchDetached([el], manager.owner);
            manager.remark(REMOVING, cachedRemoving);
            return manager;
        },
        dommanagerunwrapper = function () {
            return [this];
        },
        parentGenerator = GeneratorMaker(function (value, counter) {
            return counter ? value[PARENT_NODE] : value;
        }),
        /**
         * Manager for DOM elements, as well as documents and windows. Odette's DomManager is a very powerful abstraction of the DOM api. It abstracts a variety of tests as well as tasks away from you so you don't have to worry about them, such as events on attachment, detachment, contentChanges, attributeChanges, destruction and more. To access a DomManager, simply query the dom using the {@link DOMA} and find the element that you would like to manipulate through any of the methods that the doma provides. A simple one is [item]{@link DOMA#item} which will return the element in that location on the list of possible DomManagers
         * @class  DomManager
         * @example
         * var $body = $('body');
         * var bodyManager = $body.index(0); // DomManager
         */
        DomManager = factories[DOM_MANAGER_STRING] = factories.Events.extend(DOM_MANAGER_STRING, extend([{}, classApi,
            /**
             * @lends DomManager.prototype
             */
            {
                variable: function (key) {
                    var el = this.element();
                    return this.is('window') ? (this.is('accessable') ? el[key] : UNDEFINED) : this[key];
                },
                'directive:creation:EventManager': DomEventsManager,
                /**
                 * Flag to let other objects know that this is a valid dom manager
                 * @private
                 * @type {Boolean}
                 */
                isValidDomManager: BOOLEAN_TRUE,
                /**
                 * The query symbol ($) is used to query elements inside of the current context. When this function is called, the target is queried using querySelectorAll and the query string is passed in. When the elements are returned, they are wrapped in a {@link DOMA} object.
                 * @method
                 * @param {String} selector selector used to gather dom nodes.
                 * @returns {DOMA}
                 * @example
                 * var spansUnderManager = domManager.$('span');
                 * @example <caption>The result variable contains all of the li tags under the second div in the body.</caption>
                 * var $divs = bodyManager.$('div'); // all the divs under body
                 * var secondDivManager = $divs.index(1);
                 * var result = secondDivManager.$('li'); // all of the li's under the second div
                 */
                $: manager_query,
                querySelectorAll: manager_query,
                /**
                 * Describes how event delegation should order the events it is managing. This method is a proxy for the Document's manager. That being said, this can be overwritten and will be called at the beginning of every event loop, so you can modify how events are ordered for that manager live.
                 * @return {Boolean}
                 * @example
                 * manager.ordersEventsByHierarchy();
                 */
                ordersEventsByHierarchy: function () {
                    return this.owner.ordersEventsByHierarchy();
                },
                /**
                 * Gives the most specific query string that it can based on attributes without going to any parents.
                 * @return {String}
                 */
                queryString: function () {
                    var clas, json = baseNodeToJSON(this.element()),
                        string = json.tagName;
                    return foldl(json.attributes, function (string, attr, key) {
                        if (key === ID || key === CLASS) {
                            return string;
                        }
                        return string + makeDataAttr(key, attr);
                    }, string);
                },
                render: function (els) {
                    var result, el = this.element();
                    var diff = this.owner.nodeComparison(el, [el.localName, this.attributes(), els]);
                    var mutations = diff.mutations;
                    var memo = BOOLEAN_FALSE;
                    // if it's a function, then do it last
                    result = mutations.remove() || memo;
                    result = mutations.update() || result;
                    result = mutations.insert() || result;
                    diff.changed = result;
                    this[DISPATCH_EVENT](RENDER, diff);
                    return diff;
                },
                registeredElementName: function () {
                    return this.owner.registeredElementName(this[REGISTERED_AS]);
                },
                /**
                 * Iterate over the attributes of the element. When no arguments are passed, the attributes are simply collected and returned on an object.
                 * @param  {Function} [fun] iterates over each attribute on the element.
                 * @return {DomManager}
                 * @example <caption>Get the attributes as an object.</caption>
                 * var attrHash = domManager.attributes();
                 * @example
                 * domManager.attributes(function (value, attr) {
                 *     // exposes attr without camelCasing it
                 * });
                 */
                attributes: function (fun) {
                    var memo, bound, manager = this;
                    var element = manager.element();
                    var elementAttributes = element.attributes;
                    if (!fun) {
                        memo = {};
                        duff(elementAttributes, function (attribute) {
                            memo[attribute.localName] = attribute.value;
                        });
                        return memo;
                    }
                    bound = bindTo(fun, manager);
                    duff(elementAttributes, function (attribute) {
                        bound(attribute.value, attribute.localName);
                    });
                    return manager;
                },
                /**
                 * Check if the element has a value in it's attribute list.
                 * @method
                 * @name DomManager#hasValue
                 * @param {String} attribute name of the attribute that the checked value is being held under
                 * @param {String} value value of the attribute that is being checked for
                 * @example {@lang xml}
                 * <div data-tags="here there"></div>
                 * @example {@lang javascript}
                 * manager.hasValue("data-tags", "there"); // true
                 */
                hasValue: hasValue(domContextFind),
                /**
                 * To add a single value to an attribute that already has many values, you can simply call the addValue method. This method uses the AttributeManager to back it's attributes.
                 * @method
                 * @example
                 * // <body>;
                 * bodyManager.addValue('data-here', 'one');
                 * // body -> <body data-here="one two">
                 * bodyManager.addValue('data-here', 'two');
                 */
                addValue: addValue(domIterates),
                /**
                 * To remove a single value to an attribute that already has many values, you can simply call the addValue method. This method uses the AttributeManager to back it's attributes and can accept multiple values.
                 * @method
                 * @example <caption>consider the following html.</caption> {@lang xml}
                 * <body data-here="one two">
                 * @example
                 * body.removeValue('data-here', 'one');
                 */
                removeValue: removeValue(domIterates),
                /**
                 * Toggles a singular value of an attribute in a list.
                 * @method
                 * @param {Boolean} [direction] pass an optional true or false value to direct the toggle (like a lightswitch)
                 * @example <caption>consider the following html.</caption> {@lang xml}
                 * <div data-directions="s w"></div>
                 * @example
                 * div.toggleValue('dataDirections', 'n w');
                 * @example {@lang xml}
                 * <div data-directions="s n"></div>
                 */
                toggleValue: toggleValue(domIterates),
                /**
                 * The changeValue method takes up to 3 arguments. First the attribute to change, the second is the list of values to remove, and the third is the list of values to add to the attribute.
                 * @method
                 * @example {@lang xml}
                 * <div id="unique-id" data-special="one two three four five"><div>
                 * @description To change the values in the data-special attribute all we need to do is call changeValue with the appropriate inputs. Lets remove three and five, and add threepointfive and seven. We can even choose to pass a space delineated string, or an array with our appropriate values.
                 * @example
                 * var specialManager = $('#unique-id').index(0);
                 * specialManager.changeValue('data-special', ['three', 'five'], 'threepointfive seven');
                 * @example {@lang xml}
                 * <div id="unique-id" data-special="one two four threepointfive seven"><div>
                 */
                changeValue: changeValue(domIterates),
                /**
                 * Attaches an event listeners to the target manager.
                 * @method
                 * @param {String} eventname name of the event you are targeting
                 * @param {String|Function} [target] define a delegate target
                 * @param {Function} [callback] handler for when the event is triggered
                 * @param {Boolean} [capture] whether or not the event will be captured. Captured events cannot have delegate targets.
                 * @returns {DomManager}
                 */
                on: addEventListener,
                addEventListener: addEventListener,
                once: addEventListenerOnce,
                listenTo: function (other, key, handler) {
                    var context = this,
                        registry = context.directive(REGISTRY);
                    if (!other) {
                        return context;
                    }
                    intendedObject(key, handler, function (key, handlr_) {
                        var handlr = isString(handlr_) ? context[handlr_] : handlr_;
                        if (!isFunction(handlr)) {
                            return;
                        }
                        duff(toArray(key, SPACE), function (key) {
                            var bound, handlers = registry.get('boundHandlers-' + other.__elid__, key, function () {
                                return [];
                            });
                            if (!find(handlers, function (item) {
                                    return item.fn === handlr;
                                })) {
                                handlers.push({
                                    fn: handlr,
                                    bound: (bound = bind(handlr, context))
                                });
                                other.on(key, context.__elid__, bound);
                            }
                        });
                    });
                    return context;
                },
                stopListening: function (other, key, handler) {
                    var context = this;
                    if (!other) {
                        return context;
                    }
                    var namespace = context.__elid__;
                    intendedObject(key, handler, function (key, handler_) {
                        var handler = isString(handler_) ? context[handler_] : handler_;
                        if (!key && !handler) {
                            duff(keys(context.directive(REGISTRY).group('boundHandlers-' + other.__elid__)), function (list, key) {
                                other.off(key, namespace);
                            });
                        } else if (key && handler) {
                            // take a specific one off
                            duff(toArray(key, SPACE), function (unbounded) {
                                var found, handlers = registry.get('boundHandlers-' + other.__elid__, key, function () {
                                    return [];
                                });
                                if ((found = find(handlers, function (item) {
                                        return item.fn === unbounded;
                                    }))) {
                                    other.off(item, namespace, found.bound);
                                }
                            });
                        } else if (key) {
                            duff(toArray(key, SPACE), function (unbounded) {
                                // take all the handlers that match this key off
                                other.off(key, namespace);
                            });
                        } else if (handler) {
                            // take all the keys that match this handler off
                            duff(keys(context.directive(REGISTRY).group('boundHandlers-' + other.__elid__)), function (list, key) {
                                find(list, function (item) {
                                    if (item.fn !== handler) {
                                        return;
                                    }
                                    return other.off(key, namespace, item.bound);
                                });
                            });
                        }
                    });
                    return context;
                },
                /**
                 * Removes event handlers that match the parameters passed into the method.
                 * @method
                 * @param {String} eventname name of the event you are targeting
                 * @param {String|Function} [target] define a delegate target
                 * @param {Function} [callback] handler for when the event is triggered
                 * @param {Boolean} [capture] whether or not the event will be captured. Captured events cannot have delegate targets.
                 * @returns {DomManager}
                 * @example <caption>add and then remove an event handler</caption>
                 * var handleIt = function () {
                 *     console.log('handled');
                 * };
                 * bodyManager.on('handle', handleIt);
                 * bodyManager.dispatchEvent('handle'); // logs "handled"
                 * bodyManager.off('handle', handleIt);
                 * bodyManager.dispatchEvent('handle'); // ... nothing happens
                 */
                off: removeEventListener,
                removeEventListener: removeEventListener,
                /**
                 * Append elements to the target context by calling this method.
                 * @method
                 * @param {Collection|DomManager|DOMA|Node|String} elements what to append to the manager.
                 * @example <caption>A new div is created with the [createElement] method and appended to the body.</caption>
                 * var newDiv = $.createElement('div');
                 * bodyManager.append(newDiv);
                 * newDiv.parent() === bodyManager; // true
                 */
                append: appendChildDomManager,
                appendChild: appendChildDomManager,
                /**
                 * Uses insertAt method to prepend the passed in elements and managers' elements to the target manager's element.
                 * @method
                 * @param {String|Node|DomManager|Array|Collection|DOMA} elements elements to prepend to target
                 * @example <caption>The following example creates a new element, prepends it to the target, and then checks to make sure it is there by getting the first child.</caption>
                 * var newDiv = $.createElement('div');
                 * targetManager.prepend(newDiv);
                 * targetManager.children().item(0) === newDiv; // true
                 */
                prepend: prependChild,
                insertBefore: sharedInsertBefore,
                insertAfter: insertAfter,
                /**
                 * Gets the value of the attribute that is passed into this method. Basically a parody of the native getAttribute function... except it will automatically parse any object or number or boolean for you.
                 * @method
                 * @param {String} attr attribute to access
                 * @return {String|Number|Object} Tries to parse result of reading the attribute.
                 * @example <caption>Numbers and Objects are automatically detected and parsed.</caption>
                 * targetManager.getAttribute('data-number');
                 */
                getAttribute: getValueCurried,
                /**
                 * Wipe the values from whatever attribute is passed in and replace them with the second argument.
                 * @method
                 * @param {String} attr attribute to access
                 * @return {String|Number|Object} Tries to parse result of reading the attribute.
                 * @example <caption>Numbers and Objects are automatically detected and parsed.</caption>
                 * targetManager.getAttribute('data-number');
                 */
                setAttribute: setValueCurried,
                /**
                 * Remove an attribute from the manager's element.
                 * @method
                 * @param {String|Array} [attr] attribute you wish to remove.
                 * @example <caption>consider the following code</caption> {@lang xml}
                 * <div data-some="attr"></div>
                 * @example <caption>pass a camelcased or non camelCased version of the attribute you would like to remove</caption>
                 * targetManager.removeAttribute('dataSome');
                 * @example <caption>the attribute has been successfully removed.</caption> {@lang xml}
                 * <div></div>
                 */
                removeAttribute: attributeParody(REMOVE),
                /**
                 * Convenience function for setting and getting attributes on the target element.
                 * @func
                 * @name DOMA#attr
                 * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
                 * @returns {DOMA | *} if multiple attributes were requested then a plain hash is returned, otherwise the DOMA instance is returned
                 * @example
                 * newDiv.attr({
                 *     name: "michael"
                 * }); // <div name="michael">
                 */
                attr: attrApi(domIterates),
                /**
                 * The data method is a convenience method for wrapping attribute changes around data attributes. Simply pass an object or key value pairs into the function and the method will take care of unCamelCasing it for you and applying it with a "data-" prefix after running it through [kebabCase]{@link _.kebabCase}.
                 * @method
                 * @returns {this|String}
                 */
                data: dataApi(domIterates),
                /**
                 * Convenience method for setting and getting properties on the target element.
                 * @method
                 * @returns {this|String}
                 * @example <caption>Set the property "name" of the div to "michael"</caption>
                 * div.prop({
                 *     name: "michael"
                 * }); // <div name="michael">
                 */
                prop: propApi(domIterates),
                /**
                 * Use the html method to get and set the innerHTML of the target element.
                 * @method
                 * @param {String} contents string to set on the target
                 * @return {String|DomManager}
                 * @example <caption>Sets the inner contents of the html</caption>
                 * targetElement.html('<div></div>');
                 */
                html: innardManipulator(INNER_HTML),
                /**
                 * Use the text method to get and set the textContent of the target element.
                 * @method
                 * @param {String} contents string to set on the target
                 * @return {String|DomManager}
                 * @example <caption>Sets the text of the target element.</caption>
                 * target.html('<div></div>');
                 */
                text: innardManipulator(INNER_TEXT),
                /**
                 * The css method is a convenience function for setting and retrieving values off of the style api.
                 * @method
                 * @name DOMA#css
                 * @param {...*} splat of objects and key value pairs that create a single object to be applied to the element
                 * @returns {DOMA}
                 * @example <caption>To change the opacity for instance from 1 to 0.5, simply use the following code on your target DomManager.</caption>
                 * targetManager.css('opacity', 0.5);
                 * @description Many styles can be applied at the same time by passing an object instead of key value pairs. Below is an example of an element being centered with the absolute position method. Don't worry, those numbered values will converted into pixel values they are applied.
                 * @example
                 * targetManager.css({
                 *     position: 'absolute',
                 *     top: 0,
                 *     right: 0,
                 *     bottom: 0,
                 *     left: 0,
                 *     margin: 'auto'
                 * });
                 */
                css: styleManipulator,
                /**
                 * Gets the next element that matches the selector. Or just gets the next sibling in the sequence.
                 * @method
                 * @param {String|Function} [filter] filters the next sibling. The default value is a function that returns true.
                 * @example <caption>Get the manager's next sibling.</caption>
                 * manager.next();
                 * @example <caption>Get the next sibling anchor tag from this element.</caption>
                 * manager.next('a');
                 * @example
                 * manager.next(function () {
                 *     return true; // or some crazy logic
                 * });
                 */
                next: managerHorizontalTraverser('next', 'nextElementSibling', 1),
                /**
                 * Gets the next element that matches the selector. Or just gets the next sibling in the sequence.
                 * @method
                 * @example <caption>Get the previous sibling.</caption>
                 * manager.prev();
                 * @example <caption>Get the span just before this element.</caption>
                 * manager.prev("span");
                 */
                prev: managerHorizontalTraverser('prev', 'previousElementSibling', -1),
                /**
                 * Uses the same code that backs next and previous. A number (count of elements to skip) or a string must be passed
                 * @method
                 * @param {Number} steps how many siblings should be skipped. Negative numbers iterate through siblings negatively.
                 * @example <caption>returns manager of element 2 siblings ahead</caption>
                 * targetManager.skip(2);
                 * @example <caption>returns manager of element 2 siblings behind</caption>
                 * targetManager.skip(-2);
                 */
                skip: managerHorizontalTraverser('skip', NULL, 0),
                height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
                width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
                scrollLeft: dimensionFinder('scrollLeft', 'scrollLeft', 'pageXOffset', BOOLEAN_TRUE),
                scrollTop: dimensionFinder('scrollTop', 'scrollTop', 'pageYOffset', BOOLEAN_TRUE),
                /**
                 * The siblings method returns all siblings that are not the current manager and meet the filter passed in as the first argument.
                 * @param  {Number|String|Function} filtr a filter to selectively collect the siblings
                 * @return {DOMA}
                 * @example <caption>the following line returns all of the div's siblings without the div present in the Collection.</caption>
                 * div.siblings();
                 */
                siblings: function (filtr) {
                    var original = this,
                        filter = createDomFilter(filtr, original.owner);
                    return original.parent().children(function (manager, index, list) {
                        return manager !== original && filter(manager, index, list);
                    });
                },
                /**
                 * Returns the element that belongs to that manager.
                 * @return {Node}
                 * @example <caption>Get the element that the dom manager is associated with.</caption>
                 * bodyManager.element(); // <body></body>
                 */
                element: function () {
                    return this[TARGET];
                },
                /**
                 * Parody method of the {@link DOMA} that simply returns the element in an array.
                 * @return {Array}
                 * @example <caption>returns the node as an array just like the {@link DOMA}</caption>
                 * bodyManager.elements(); // [<body></body>]
                 */
                elements: function () {
                    return [this.element()];
                },
                chain: function (filter, stopsBefore) {
                    var next, list = [],
                        manager = this,
                        filtr = negate(createDomFilter(filter, manager.owner)),
                        pg = parentGenerator(manager.element(), NULL, filtr);
                    while (!(next = pg.next()).done) {
                        list.push(manager.owner.returnsManager(next.value));
                    }
                    if (!stopsBefore && next.value) {
                        list.push(manager.owner.returnsManager(next.value));
                    }
                    return manager.wrap(list);
                },
                constructor: function (el, hash, owner_, elid) {
                    var elId, view, ownerElId, ownerDoc, registeredOptions, isDocument, owner = owner_,
                        manager = this;
                    if (!el) {
                        exception('DomManager target must be an element, document, documentfragment, or window');
                    }
                    if (DomManager.isInstance(el)) {
                        // extend what we already know
                        hash[DOM_MANAGER_STRING] = manager;
                        merge(manager, el);
                        // run it through it's scoped constructor
                        registeredOptions = owner.registeredElementOptions[manager[REGISTERED_AS]];
                        manager.on(manager.events);
                        return manager;
                    }
                    manager[__ELID__] = elid;
                    test(manager, owner, el);
                    hash[DOM_MANAGER_STRING] = manager;
                    if (manager.is(ELEMENT) || manager.is(FRAGMENT)) {
                        ownerDoc = el.ownerDocument;
                        // el[__ELID__] = elid;
                        if (!(ownerElId = ownerDoc[__ELID__]) || !ensure(ownerDoc, BOOLEAN_TRUE)) {
                            app.run(ownerDoc.defaultView, noop);
                        }
                        owner = ensure(ownerDoc, BOOLEAN_TRUE);
                    } else {
                        if ((isDocument = manager.is(DOCUMENT))) {
                            owner = owner === BOOLEAN_TRUE ? manager : owner;
                            // el[__ELID__] = elid;
                        }
                    }
                    manager.owner = owner || BOOLEAN_FALSE;
                    manager[TARGET] = el;
                    if (manager.is(IFRAME)) {
                        manager.on(ATTRIBUTE_CHANGE + ':src detach attach', iframeChangeHandler);
                    }
                    if (manager.is(WINDOW)) {
                        markGlobal(manager, el);
                    }
                    if (manager.is(ELEMENT)) {
                        if (!attributeApi.read(el, 'is')) {
                            attributeApi.write(el, 'is', BOOLEAN_TRUE);
                        }
                        if (!validTagsNamesHash[manager[TAG_NAME]]) {
                            manager[REGISTERED_AS] = manager[TAG_NAME];
                            manager.mark(CUSTOM);
                        }
                        if (manager[REGISTERED_AS] && manager[REGISTERED_AS] !== BOOLEAN_TRUE) {
                            manager = wraptry(function () {
                                return registerAs(manager, hash, owner);
                            }) || manager;
                        }
                        if (has(manager, REGISTERED_AS)) {
                            delete manager[REGISTERED_AS];
                        }
                    }
                    return manager;
                },
                clone: function () {
                    var manager = this;
                    if (!manager.is(ELEMENT)) {
                        return {};
                    }
                    return makeBranch(manager.element()[OUTER_HTML], manager.owner);
                },
                /**
                 * Always returns 1 since it is basically just a parody of the Collection's {@link Collection#length} method.
                 * @return {Number} will always be 1 unless the function is overwritten.
                 * @example
                 * manager.length(); // 1
                 */
                length: returns(1),
                wrap: function (list) {
                    return this.owner.$(list || this);
                },
                unwrap: dommanagerunwrapper,
                /**
                 * Parody method that simply wraps the dom manager in an array so that it produces the same result as the {@link DOMA}.
                 * @method
                 * @example <caption>the div list in this case is just to wrap the {@link DomManager} in an array.</caption>
                 * var divList = div.unwrap();
                 */
                toArray: dommanagerunwrapper,
                /**
                 * Returns the first matching parent of target manager. If no argument is passed, the direct parent will be returned. A function can be passed, through the method, but it must return a tuple with the parent at the first index, and a boolean at the second index to continue or terminate the loop.
                 * @example <caption>gets the body's parent (the html element)</caption>
                 * bodyManager.parent();
                 * @example <caption>pass a string to check for and filter the element. Works a lot like closest in jQuery.</caption>
                 * bodyManager.parent('document').is("document"); // true
                 * bodyManager.parent('window').is("window"); // true
                 * bodyManager.parent('iframe').tag(); // "iframe"
                 */
                parent: (function () {
                    var finder = function (manager, fn, original) {
                            var rets, found, parentManager = manager,
                                owner = manager.owner,
                                parentElement = parentManager.element(),
                                next = original;
                            while (parentElement && !found) {
                                rets = fn(parentElement, original, next, owner);
                                parentElement = rets[0];
                                found = rets[1];
                                next = rets[2];
                            }
                            if (found && parentElement) {
                                return owner.returnsManager(parentElement);
                            }
                        },
                        number = function (element, original, next) {
                            next -= 1;
                            if (next < 0 || !isFinite(next) || isNaN(next)) {
                                next = 0;
                            }
                            return [element[PARENT_NODE], !next, next];
                        },
                        string = function (element, original_, next, owner) {
                            var parent = element[PARENT_NODE];
                            var original = convertSelector(original_, owner);
                            return [parent, matchesSelector(parent, original, owner)];
                        },
                        speshal = {
                            document: function (element, original, next) {
                                var parent = element[PARENT_NODE];
                                if (isDocument(parent)) {
                                    return [parent, BOOLEAN_TRUE];
                                } else {
                                    if (isElement(parent)) {
                                        return [parent, BOOLEAN_FALSE];
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
                /**
                 * Returns a boolean based on whether or not the elements passed into the method are inside of target element. Also, a [parent]{@link DomManager#parent} type function can be passed to discern whether or not the parent is in fact the parent you are looking for.
                 * @param  {String|Node|DomManager|DOMA} el check to see if the manager in question contains the element
                 * @return {Boolean}
                 * @example <caption>The body in this case contains at least one div.</caption>
                 * bodyManager.contains('div'); // true
                 * @example <caption>A DomManager (as well as a node) can be passed</caption>
                 * bodyManager.contains($('div').index(0)); // true
                 * @example <caption>Because the new div has not been appended to anything, it is not contained in the body.</caption>
                 * bodyManager.contains($.createElement('div')); // false
                 */
                contains: function (el) {
                    var managerElement, target, element = el,
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
                    if (target.is(DOCUMENT)) {
                        return target.window() === manager;
                    }
                    managerElement = manager.element();
                    return !!target.parent(function (node) {
                        var parentNode = node[PARENT_NODE];
                        return [parentNode, parentNode === managerElement];
                    });
                },
                /**
                 * The insertAt method is the main handler that will be abstracted by append, prepend and others. It handles node insertion at whatever index is passed into the method as the second argument.
                 * @param  {String|Node|Manager|DOMA|Collection} els elements to insert at the given index
                 * @param  {Number|Null} index Where to put the elements
                 * @return {DOMA} children (first layer) that were just inserted
                 * @example <caption>insert a div by it's manager at the 4rd index</caption>
                 * bodyManager.insertAt(divManager, 3);
                 * @example <caption>appends a newly created div</caption>
                 * divManager.insertAt('<div/>');
                 */
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
                        returnValue = managerElement && insertBefore(managerElement, fragment, element),
                        notify = isAttached(managerElement, owner) && dispatchAttached(fragmentChildren, owner);
                    return returns;
                },
                /**
                 * Returns the manager of the window associated with the element. If this method is called on the document, then it will reach up to it's parent window. If it is called on a window, then it will return said window. If it is called on any element that is not an iframe, then it will get the window of the owner document. If it is called on an iframe then it will grab the content window of said iframe. This method is used internally for the emit and other methods.
                 * @returns {DomManager}
                 * @example <caption>The window of the body is returned (<code>bodyManager.element().parentNode.parentNode.defaultView</code>)</caption>
                 * bodyManager.window();
                 * @example <caption>The window inside of the iframe is returned (<code>iframeManager.element().contentWindow</code>)</caption>
                 * iframeManager.window();
                 * @example <caption>The window that the element is in is returned (<code>divManager.owner.element().defaultView</code>)</caption>
                 * divManager.window();
                 * @example <caption>The window returns it's self <code>windowManager.element()</code></caption>
                 * windowManager.window();
                 */
                window: function () {
                    var manager = this;
                    if (manager.is(WINDOW)) {
                        // yay we're here!
                        return manager;
                    }
                    if (manager.is(DOCUMENT)) {
                        // it's a document, so return the manager relative to the inside
                        return manager.owner.returnsManager(manager.element().defaultView);
                    }
                    if (manager.is(IFRAME)) {
                        // it's an iframe, so return the manager relative to the outside
                        return manager.is(ATTACHED) && (windo = manager.element().contentWindow) && manager.owner.returnsManager(windo);
                    }
                    // it's an element so go up
                    return manager.owner.window();
                },
                /**
                 * Method is called automatically during Manager construction. It creates a unique id for the window to post emit messages to.
                 * @param {String} [address] the id that will be used for the window to receive post messages.
                 * @returns {String} the address that was set. different if there was no param passed.
                 */
                setAddress: function (address) {
                    var manager = this;
                    address = manager.address = address || manager.address || uuid();
                    return address;
                },
                /**
                 * Post message abstraction for window objects. Be sure to pass a function, because if the window is friendly, the DomManager will pass an object that resembles an event back throught that function to be handled by the same side.
                 * @param  {String} message Usually a stringified object that is sent across the window
                 * @param  {String} [referrer] second argument of the post message method of the window.
                 * @param  {Function} [handler] redirect when the window is friendly.
                 * @return {this}
                 * @example <caption>Handle both sides of the equation by using this methodology.</caption>
                 * $('iframe').index(0).emit({
                 *     coded: "messages"
                 * }, 'http://odette-js.github.io', function (fake_evnt) {
                 *     // nevermind, i've got this
                 * });
                 */
                emit: function (message, referrer, handler) {
                    var msg, post, element, stringified, windo = this.window();
                    if (!windo.is(WINDOW)) {
                        return this;
                    }
                    element = windo.element();
                    stringified = stringify(message);
                    if (windo.is(ACCESSABLE)) {
                        msg = parse(stringified);
                        (handler || receivePostMessage)({
                            // this can be expanded a bit when you get some time
                            srcElement: element,
                            timeStamp: _.now(),
                            data: function () {
                                return msg;
                            }
                        });
                        return this;
                    }
                    wraptry(function () {
                        // do not parse message so it can be sent as is
                        if (!referrer) {
                            exception('missing referrer: ' + windo.address);
                        } else {
                            element.postMessage(stringified, referrer);
                        }
                    });
                    return this;
                },
                /**
                 * Check the window's origin against it's owner document. This is the document that the DomManager was created for, not necessarily the document of the window.
                 * @example <caption>this example is of code that ran and is registered against the insides of an unfriendly iframe</caption>
                 * $.returnsManager(window).sameOrigin(); // true
                 * $.returnsManager(window.top).sameOrigin(); // false
                 */
                sameOrigin: function () {
                    var parsedReference, manager = this,
                        element = manager.element(),
                        windo = manager.owner.window(),
                        windoElement = windo.element();
                    if (windo === manager) {
                        return BOOLEAN_TRUE;
                    }
                    if (manager.is(ACCESSABLE)) {
                        parsedReference = reference(wraptry(function () {
                            var frame;
                            return (frame = element.frameElement) ? frame.src : BOOLEAN_FALSE;
                        }) || element[LOCATION].href);
                        if (!parsedReference && manager.iframe) {
                            parsedReference = reference(manager.iframe.src());
                        }
                        return !parsedReference || parsedReference === reference(windoElement[LOCATION].href);
                    }
                    return BOOLEAN_FALSE;
                },
                /**
                 * Method to return all of the direct children of the target element. While the list of children is being iterated over, it can also be filtered by passing in a string to act as a query selector, a number to only get that element, or a function for custom filtering.
                 * @param  {String|Number|Function} eq How to filter the children. Null values return collect all.
                 * @param  {Object|DocumentFragment} memo push all children to this param, or if it is a document fragment, all children will be appended
                 * @return {DOMA}
                 * @example <caption>Consider the following markup.</caption> {@lang xml}
                 * <div id="top-level">
                 *     <div class="item-0"></div>
                 *     <div class="item-1" data-marker></div>
                 *     <div class="item-2"></div>
                 *     <div class="item-3" data-marker></div>
                 *     <div class="item-4"></div>
                 * </div>
                 * @example <caption>We might want to select for the children in a variety of ways.</caption>
                 * var topLevelManager = $('#top-level');
                 * var $allChildren = topLevelManager.children(); // length 5
                 * var $thirdChild = topLevelManager.children(2); // length 1
                 * var $markerChildren = topLevelManager.children('[data-marker]'); // length 2
                 * var $evenChildren = topLevelManager.children(function (manager, index) {
                 *     return !(index % 2);
                 * }); // length 3
                 */
                children: function (eq, memo) {
                    var filter, resultant, manager = this,
                        children = collectChildren(manager.element());
                    if (eq == NULL) {
                        return memo ? ((children = map(children, manager.owner.returnsManager, manager.owner)) && result(memo, 'is', FRAGMENT) ? memo.append(children) : (memo.push.apply(memo, children) ? memo : memo)) : manager.wrap(children);
                    } else {
                        filter = createDomFilter(eq, manager.owner);
                        resultant = foldl(children, function (memo, child, idx, children) {
                            if (filter(child, idx, children)) {
                                memo.push(manager.owner.returnsManager(child));
                            }
                            return memo;
                        }, memo || []);
                    }
                    return memo ? resultant : manager.wrap(resultant);
                },
                /**
                 * Runs a series of checks to determine if the element in question is visible. It will first check the attachment status, then various css properties, as well as the client rect of the element. Finally, if the element is inside of an iframe, it will do it's best to discern the element's visibility.
                 * @return {Boolean}
                 * @example <caption>elements that are not in the document, or elements that have a 0 height or width, or have styles like display none, visiblity none, or opacity 0 would all result in false.</caption>
                 * visibleBody.append(divManager);
                 * divManager.visible(); // true
                 * @example <caption>elements that are not attached to the dom are not visible.</caption>
                 * divManager.remove();
                 * divManager.visible(); // false
                 */
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
                    return windo.is('topWindow') ? BOOLEAN_TRUE : windowIsVisible(windo, manager.owner);
                },
                /**
                 * Quick abstraction for an applyStyle call with the arguments display, and none.
                 * @return {this}
                 * @example <caption>hides the element</caption>
                 * manager.hide();
                 */
                hide: function () {
                    return this.applyStyle(DISPLAY, NONE);
                },
                /**
                 * Quick abstraction for an applyStyle call with the arguments display, and block.
                 * @return {this}
                 * @example <caption>hides the element</caption>
                 * manager.show();
                 */
                show: function () {
                    return this.applyStyle(DISPLAY, 'block');
                },
                /**
                 * Applies a singular style to the target element.
                 * @param  {String} style css property to be applied
                 * @param  {String|Number} value value of the property being applied
                 * @param  {Boolean} important whether to apply important flag with the style
                 * @return {this}
                 * @example <caption>Hides the body</caption>
                 * bodyManager.applyStyle('display', 'none');
                 * @example <caption>Shows the body with the important flag</caption>
                 * bodyManager.applyStyle('opacity', 1, true);
                 * @example <caption>Hides the body</caption>
                 * bodyManager.applyStyle({
                 *     opacity: 1,
                 *     display: "block",
                 *     visibility: "visible"
                 * });
                 */
                applyStyle: function (style, value, important) {
                    applyStyle(this.element(), style, value, important);
                    return this;
                },
                /**
                 * A convenience method for retrieving styles from an element.
                 * @return {String}
                 * @example <caption>considering the following html</caption> {@lang xml}
                 * <div style="display: block;"></div>
                 * @example
                 * targetManager.getStyle('display'); // "block"
                 */
                getStyle: function (eq) {
                    var returnValue = {},
                        manager = this,
                        first = manager.element();
                    if (first && manager.is(ELEMENT)) {
                        returnValue = getComputed(first, manager.owner.element());
                    }
                    return returnValue;
                },
                /**
                 * Removes the dom node from its parent. First optional argument can be a document fragment that the target manager's element will be appended to. The second, optional, argument can be a function that is run asynchronously after the dom element is removed from the dom.
                 * @method
                 * @param {Function} [callback] to run after the element has been removed from the dom. (most useful for iframes when code can be stopped mid-execution)
                 * @example <caption>When an element is removed it no longer has a parent.</caption>
                 * divInBody.remove();
                 * divInBody.parent(); // undefined
                 */
                remove: removeHandler,
                removeChild: removeHandler,
                /**
                 * The frame method helps you create the base string for an iframe. You can either pass it the full string (with doctype) or the head and the body in one or two arguments. If the head and body are separate, the method will automatically add some helpful meta tags to the head to reduce redundancy.
                 * @param  {String} head define the head or the entire document with this param
                 * @param  {String|Object} body if string, this param will be understood to be the body. Pass an object if the head contains the entire document.
                 * @param  {Object} passedContent The variables that should be set on the window just before the frame string is inserted into the iframe.
                 * @return {this}
                 * @example <caption>sets the iframe content and the "_" variable to an empty object.</caption>
                 * manager.frame('<link rel="stylesheet" href="./css/main.css">', //
                 *     '<div class="my-container"></div>\n\t\t<script>console.log(_);</script>', {
                 *     _: {}
                 * });
                 * @example <caption>The call above would produce the following html inside of an iframe.</caption> {@lang xml}
                 * <!DOCTYPE html>
                 * <html>
                 *     <head>
                 *         <meta charset="utf-8">
                 *         <meta name="viewport" content="user-scalable=no,width=device-width,initial-scale=1">
                 *         <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
                 *         <link rel="stylesheet" href="./css/main.css">
                 *     </head>
                 *     <body>
                 *         <div class="my-container"></div>
                 *         <script>console.log(_);</script> <!-- logs {} -->
                 *     </body>
                 * </html>
                 */
                frame: function (head, body, passedContent) {
                    var manager = this,
                        content = head || '',
                        bod = isString(body) ? body : '',
                        passed = !passedContent && isObject(body) ? body : NULL;
                    if (!passedContent && (bod || content.slice(0, 10).toLowerCase() !== '<!doctype ')) {
                        content = manager.owner.iframeContent(content, body);
                    }
                    var sharedVars = isObject(passedContent) ? passedContent : (isObject(body) ? body : {});
                    if (manager.is(IFRAME)) {
                        if (manager.is(ATTACHED)) {
                            manager.html(content, sharedVars);
                        } else {
                            manager.cachedContent = {
                                string: content,
                                vars: sharedVars
                            };
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
                    if (manager.is(IFRAME)) {
                        manager.owner.data.delete(element.contentWindow);
                    }
                    manager.remove(NULL, handler);
                    if (registeredAs) {
                        customName = manager.owner.registeredElementName(registeredAs);
                        manager.directiveDestruction(customName);
                    }
                    manager[DISPATCH_EVENT](DESTROY);
                    // destroy events
                    manager.directiveDestruction(EVENT_MANAGER);
                    // remove from global hash
                    manager.owner.data.delete(element);
                    manager[STOP_LISTENING]();
                    return manager;
                },
                item: function () {
                    return this;
                },
                /**
                 * A parody method to allow a DomManager share internal methods with the {@link DOMA}
                 * @param  {Function} fn the callback that will iterate over this single DomManager
                 * @param  {Object} context the this of the callback
                 * @return {Array}
                 * @example <caption>pseudo iterate over the DomManager in question</caption>
                 * @example
                 * bodyManager.each(function (manager, index) {
                 *     manager === bodyManager; // true
                 *     index === 0; // true
                 * });
                 */
                each: function (fn, context) {
                    var manager = this,
                        wrapped = [manager],
                        result = context ? fn.call(context, manager, 0, wrapped) : fn(manager, 0, wrapped);
                    return wrapped;
                },
                map: function (fn, context) {
                    return [bind(fn, context, this, 0, [])()];
                },
                /**
                 * Parody method of the {@link DOMA} that fake iterates with the single manager.
                 * @param  {Function} fn callback to iterate over the pseudo collection.
                 * @param {Object} [context] context in which the callback will run
                 * @return {Null|DomManager} if truthy value is returned from callback, DomManager is returned, otherwise undefined. Operates just like {@link _.find}
                 * @example <caption>Return the manager when the result is truthy</caption>
                 * bodyManager.find(function (manager, index) {
                 *     manager === bodyManager; // true
                 *     index === 0; // true
                 *     return !index;
                 * }); // bodyManager
                 */
                find: function (fn, context) {
                    var manager = this,
                        list = [manager];
                    return fn.call(context || list, manager, 0, list) ? manager : UNDEFINED;
                },
                /**
                 * Returns the boundingClientRect of the target element. Extendes it onto a basic object to make sure only the values come through.
                 * @return {Object}
                 * @example
                 * bodyManager.client();
                 * // {
                 * //     top: 0,
                 * //     left: 0,
                 * //     right: 0,
                 * //     bottom: 0,
                 * //     height: 701,
                 * //     width: 1280
                 * // }
                 */
                client: function () {
                    return clientRect(this.element());
                },
                /**
                 * Gets the box model that it can with the information it has available. If the target element is not attached it will return an object with all 0s. If it is attached then it will get the computed styles as well as the bounding client rect to give the most accurate representation possible.
                 * @param  {Window} [context] if the manager is in another window from your element, then a context may need to be passed to ensure the boundingClient rect does not return a nullable
                 * @return {Object}
                 * @example
                 * var boxModel = bodyManager.box();
                 * // {
                 * //     borderLeft: 0,
                 * //     borderRight: 0,
                 * //     borderTop: 0,
                 * //     bottom: 701,
                 * //     height: 701,
                 * //     left: 0,
                 * //     marginBottom: 0,
                 * //     marginLeft: 0,
                 * //     marginRight: 0,
                 * //     marginTop: 0,
                 * //     paddingBottom: 0,
                 * //     paddingLeft: 0,
                 * //     paddingRight: 0,
                 * //     paddingTop: 0,
                 * //     right: 1280,
                 * //     top: 0,
                 * //     width: 1280
                 * // };
                 */
                box: function (context) {
                    return box(this.element(), context);
                },
                /**
                 * Gets the flow rect of the target element.
                 * @param  {Window} context Set a context for pulling flow data off of the element associated with the dom manager.
                 * @return {Object}
                 * @example use the context associated with the element
                 * bodyManager.flow();
                 */
                flow: function (context) {
                    return flow(this.element(), context);
                },
                /**
                 * A wrapper around the {@link Events#dispatchEvent} method, which marks the event object as trust worthy or not.
                 * @param  {String} name name of the event to be dispatched
                 * @param  {Object} data data associated with the event
                 * @param  {Boolean} capturing_ tells the event to dispatch as capturing (true) or as bubbling (false)
                 * @return {this}
                 * @example
                 * targetManager.on('click', function (e) {
                 *     console.log(e.is('trusted'));
                 * });
                 * targetManager.dispatchEvent('click'); // logs false
                 * targetManager.click(); // logs false
                 * // ...
                 * // native click -> logs true
                 */
                dispatchEvent: function (name, e, capturing_) {
                    var cachedTrust = DO_NOT_TRUST;
                    DO_NOT_TRUST = BOOLEAN_TRUE;
                    managerEventDispatcher(this, name, capturing_);
                    DO_NOT_TRUST = cachedTrust;
                    return this;
                },
                /**
                 * Turns the dom into a serializable object that can be reparsed and recreated at a later time.
                 * @param  {Boolean} shallow only go shallow on the iteration
                 * @return {Object} serializable object
                 * @example <caption>the call below produces the commented out object from a blank div with no attributes and no children</caption>
                 * div.toJSON();
                 * // {
                 * //     children: [],
                 * //     attributes: {},
                 * //     tagName: "div"
                 * // }
                 */
                toJSON: function (shallow) {
                    var previous, temporaryFragment, childrenLength, children, obj, manager = this,
                        owner = manager.owner,
                        node = manager.element();
                    if (manager.is(WINDOW) || manager.is(DOCUMENT)) {
                        exception('cannot serialize documents and windows');
                    }
                    return nodeToJSON(node, shallow === UNDEFINED ? returnsTrue : (isFunction(shallow) ? shallow : returns(shallow)), BOOLEAN_TRUE);
                }
            },
            wrap(directAttributes, function (attr, api) {
                if (!attr) {
                    attr = api;
                }
                return function (string) {
                    var element, item, manager = this;
                    if (string !== UNDEFINED) {
                        // write, so trigger is possible
                        return manager.attr(attr, string);
                    }
                    return (element = manager.element()) && element[attr];
                };
            }), wrap(videoDirectEvents, triggerEventWrapperManager), wrap(directEvents, function (attr) {
                return triggerEventWrapperManager(attr);
            }), wrap(toArray('add,addBack,elements,push,fragment'), function (key) {
                return function (one, two, three) {
                    return this.wrap()[key](one, two, three);
                };
            })
        ])),
        _removeEventListener = function (manager_, name, group, selector_, handler, capture_) {
            var selector = selector_,
                manager = elementSwapper[selector] ? ((selector = '') || elementSwapper[selector_](manager_)) : manager_,
                capture = !!capture_,
                directive = manager.directive(EVENT_MANAGER),
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
        createDomFilter = function (filtr_, owner, negative) {
            var filtr = filtr_;
            return isFunction(filtr) ? filtr : (isString(filtr) ? (filterExpressions[filtr] || (filtr = convertSelector(filtr, owner)) && function (item) {
                return matchesSelector(item, filtr, owner);
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
        domFilter = function (items, filtr, owner) {
            var filter = createDomFilter(filtr, owner);
            return dataReconstructor(items, unwrapsOnLoop(filter));
        },
        returnsManager = function (element, owner) {
            return element && !isWindow(element) && element.isValidDomManager ? element : ensure(element, owner);
        },
        exportResult = _.publicize({
            isIE: isIE,
            nodeDocument: nodeDocument,
            nodeWindow: nodeWindow,
            elementEventDispatcher: elementEventDispatcher,
            allowsPassiveEvents: allowsPassiveEvents(),
            buildCss: buildCss,
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
            convertUnit: convertUnit
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
        allEachMethods = toArray(DESTROY + ',show,hide,style,remove,on,off,once,addEventListener,removeEventListener,dispatchEvent').concat(allDirectMethods),
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
        /**
         * DOMA is the document object model abstraction. A wrapper for the dom objects available in the browser's window. Operates off of the assumption that all dom interactions should be normalized, and efficient as possible.
         * @class DOMA
         */
        DOMA = factories.DOMA = factories.Collection.extend('DOMA', extend([{}, classApi, {
            isValidDOMA: BOOLEAN_TRUE,
            /**
             * DOMA constructor
             * @name DOMA#constructor
             * @param {String | Node | Function} str - string to query the dom with, or a function to run on document load, or an element to wrap in a DOMA instance
             * @returns {DOMA} instance
             */
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
                        if (!str) {} else if (isString(str)) {
                            if (str[0] === '<') {
                                els = makeTree(str, owner);
                            } else {
                                els = map(query(str, unwrapped, context), owner.returnsManager, owner);
                            }
                        } else {
                            els = str;
                            if (DomManager.isInstance(els)) {
                                els = [els];
                            } else {
                                if (Collection.isInstance(els)) {
                                    els = els.toArray();
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
            /**
             * Sets value of an attribute on the DomManagers. Replaces all values in a space delineated list.
             * @method
             * @param {String|Object} key property key or object to set multiple values.
             * @param {*} value value of the property to be set.
             * @returns {this}
             */
            setValue: setValue(domIterates),
            /**
             * Checks properties for singular value. If value is found in space delineated list, then Boolean true is returned. Otherwise false is returned. DOMA will check all elements and will only return true if all have passed attribute, value pairs.
             * @method
             * @param {String|Object} key attribute to check under for a specific value.
             * @param {*} value value to pass if key was not passed as object.
             * @returns {Boolean}
             */
            hasValue: hasValue(domContextFind),
            /**
             * Adds a value to the given attribute if the value does not already exist under that attribute.
             * @method
             * @param {String|Object} key attribute to check and add if a value is not already there.
             * @param {*} value value to add if key was not passed as an object.
             * @return {this}
             */
            addValue: addValue(domIterates),
            removeValue: removeValue(domIterates),
            toggleValue: toggleValue(domIterates),
            changeValue: changeValue(domIterates),
            add: attachPrevious(function (context, query) {
                var found = context.owner.$(query);
                return concatUnique(context.toArray(), found.toArray());
            }),
            addBack: attachPrevious(function (context, selector) {
                var previous = context._previous;
                if (!previous) {
                    return context.toArray().concat([]);
                }
                if (selector) {
                    previous = previous.filter(selector);
                }
                return context.toArray().concat(previous.toArray());
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
                        memo = memo.concat(!isWindow(el) && isFunction(el.unwrap) ? el.toArray() : owner.returnsManager(el));
                    }
                    return memo;
                }, [], owner));
                return this;
            },
            elements: function () {
                // to array of elements
                return this.results(ELEMENT);
            },
            fragment: function (els) {
                return this.context.returnsManager(fragment(els || this.toArray(), this.context));
            },
            chain: function (filtr) {
                var empty = [];
                return this.owner.$(empty.concat.apply(empty, this.map(function (item) {
                    return item.chain(filtr).toArray();
                }).toArray()));
            },
            filter: attachPrevious(function (context, filter) {
                return domFilter(context.toArray(), filter, context.owner);
            }),
            empty: attachPrevious(function (context, filtr) {
                var filter = createDomFilter(filtr, context.owner);
                return dataReconstructor(context.toArray(), unwrapsOnLoop(function (memo, manager, idx, list) {
                    return !filter(manager, idx, list) && manager.remove();
                }));
            }),
            $: attachPrevious(function (context, str) {
                var matchers = [],
                    push = function (el) {
                        matchers.push(context.owner.returnsManager(el));
                    };
                // look into foldl so we do not get duplicate elements
                return duff(context.toArray(), function (manager) {
                    duff(query(str, manager.element(), manager), push);
                }) && matchers;
            }),
            children: attachPrevious(function (context, eq) {
                // this should be rewritten as context.foldl
                return foldl(context.toArray(), function (memo, manager) {
                    return manager.children(eq, memo);
                }, []);
            }),
            css: styleManipulator,
            allElements: function () {
                return !!(this[LENGTH]() && !find(this.toArray(), function (manager) {
                    return !manager.is(ELEMENT);
                }));
            },
            height: dimensionFinder(HEIGHT, 'scrollHeight', INNER_HEIGHT),
            width: dimensionFinder(WIDTH, 'scrollWidth', INNER_WIDTH),
            scrollLeft: dimensionFinder('scrollLeft', 'scrollLeft', 'pageXOffset', BOOLEAN_TRUE),
            scrollTop: dimensionFinder('scrollTop', 'scrollTop', 'pageYOffset', BOOLEAN_TRUE),
            attr: attrApi(domIterates),
            data: dataApi(domIterates),
            prop: propApi(domIterates),
            eq: attachPrevious(function (context, num) {
                return eq(context.toArray(), num);
            }),
            end: function () {
                var that = this;
                while (that._previous) {
                    that = that._previous;
                }
                return that;
            },
            getAttribute: getValueCurried,
            setAttribute: setValueCurried,
            append: function (els, clone) {
                return this.insertAt(els, NULL, clone);
            },
            prepend: function (els, clone) {
                return this.insertAt(els, 0, clone);
            },
            insertBefore: sharedInsertBefore,
            appendTo: function (target) {
                $(target).append(this);
                return this;
            },
            next: horizontalTraverser('next', 1),
            prev: horizontalTraverser('prev', -1),
            skip: horizontalTraverser('skip', 0),
            siblings: attachPrevious(function (context, filtr) {
                return mappedConcat(context, function (manager) {
                    return manager.siblings(filtr).toArray();
                });
            }),
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
                    if (!manager.is(ELEMENT)) {
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
                    return elements.toArray();
                });
            }),
            contains: function (els) {
                return !!this.find(function (manager) {
                    return manager.contains(els);
                });
            },
            clone: attachPrevious(function (context) {
                return context.foldl(function (memo, manager) {
                    if (manager.is(ELEMENT)) {
                        memo.push(manager.clone());
                    }
                    return memo;
                });
            }),
            parent: attachPrevious(function (context, original) {
                // ensure unique
                var hash = {};
                return context.foldl(function (memo, manager) {
                    var parent;
                    if ((parent = manager.parent(original)) && !hash[parent.element()[__ELID__]]) {
                        hash[parent.element()[__ELID__]] = parent;
                        memo.push(parent);
                    }
                    return memo;
                }, []);
            }),
            has: function (els) {
                var doma = this,
                    collection = Collection(els),
                    length = collection[LENGTH]();
                return !!length && collection.find(function (el) {
                    return doma.indexOf(el) === -1;
                });
            },
            html: innardManipulator(INNER_HTML),
            text: innardManipulator(INNER_TEXT),
            map: function (handler, context) {
                return Collection(map(this.toArray(), handler, context));
            },
            toJSON: function () {
                return this.results(TO_JSON).toArray();
            },
            toString: function () {
                return stringify(this);
            }
        }, wrap(allEachMethods, applyToEach), wrap(firstMethods, applyToFirst), wrap(readMethods, applyToTarget)])),
        allSetups = [],
        plugins = [];
    app.undefine(function (app, windo, passed) {
        var setup = DOMA_SETUP(windo);
        setup.HTTP = setup.document.HTTP = passed.HTTP;
        allSetups.push(setup);
        duff(plugins, function (plugin) {
            plugin(setup);
        });
        setup.collectTemplates();
        passed.$ = setup;
        return setup;
    });
    // collect all templates with an id
    // register all custom elements...
    // everything that's created after this should go through the DomManager to be marked appropriately
    // define a hash for attribute caching
    app.defineDirective(ATTRIBUTES, returns.object);
});