application.scope().module('Buster', function (module, app, _, factories, $) {
    var blank, isReceiving = 0,
        get = _.get,
        duff = _.duff,
        collection = factories.Collection,
        gapSplit = _.gapSplit,
        associator = _.associator,
        unitsToNum = _.unitsToNum,
        roundFloat = _.roundFloat,
        isFunction = _.isFunction,
        extend = _.extend,
        console = _.console,
        reference = _.reference,
        now = _.now,
        parse = _.parse,
        foldl = _.foldl,
        stringify = _.stringify,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        infin = 32767,
        nInfin = -infin - 1,
        ATTRIBUTES = 'attributes',
        COMPONENT = 'component',
        COMPONENTS = COMPONENT + 's',
        RESPONSE_OPTIONS = 'responseOptions',
        PARENT = 'parent',
        LENGTH = 'length',
        HEIGHT = 'height',
        WIDTH = 'width',
        BOTTOM = 'bottom',
        RIGHT = 'right',
        LEFT = 'left',
        TOP = 'top',
        DISPATCH_EVENT = 'dispatchEvent',
        MARGIN_BOTTOM = 'marginBottom',
        MARGIN_RIGHT = 'marginRight',
        MIN_HEIGHT = 'minHeight',
        MAX_HEIGHT = 'maxHeight',
        MIN_WIDTH = 'minWidth',
        MAX_WIDTH = 'minWidth',
        BEFORE_RESPONDED = 'before:responded',
        QUEUED_MESSAGE_INDEX = 'queuedMessageIndex',
        pI = _.pI,
        _setupInit = function (e) {
            var i, currentCheck, src, parentEl, frameWin, frameEl, allFrames, tippyTop, spFacts, spOFacts, shouldRespond, sameSide, topDoc, wrapper, buster = this,
                frame = e.frame,
                data = e.data(),
                packet = data.packet,
                responder = e.responder,
                attrs = get(buster),
                parts = buster.parts;
            if (app.topAccess) {
                tippyTop = window[TOP];
                topDoc = tippyTop.document;
                wrapper = topDoc.body;
            }
            if (!frame) {
                if (!data.toInner) {
                    /**
                     * when the buster has to go through an unfriendly iframe, it has to find the iframe it belonged to from the top document
                     * @private
                     * @arg {string} url that is the iframe. also, secondarily checks the window objects in the while loop
                     */
                    buster.el = (function (specFrame) {
                        var frame, frameWin, src, currentCheck, i,
                            frames = topDoc.getElementsByTagName('iframe'),
                            srcEl = e.srcElement;
                        if (specFrame) {
                            for (i in frames) {
                                frame = frames[i];
                                frameWin = frame.contentWindow;
                                src = frame.src;
                                if (src === specFrame) {
                                    currentCheck = srcEl;
                                    while (currentCheck !== tippyTop) {
                                        if (frameWin === currentCheck) {
                                            return frame;
                                        }
                                        currentCheck = currentCheck[PARENT];
                                    }
                                }
                            }
                        }
                        return 0;
                    }(attrs.srcOrigin));
                }
                if (data.toInner) {
                    buster.el = document.body;
                }
                if (buster.el) {
                    buster.el = $(buster.el);
                    buster.set({
                        sameSide: 0,
                        id: data.from,
                        referrer: reference(parts.doc)
                    });
                    extend(parts, {
                        srcElement: e.source,
                        top: tippyTop || {},
                        doc: topDoc || {},
                        wrapper: wrapper || {}
                    });
                    shouldRespond = 1;
                    attrs.isConnected = 1;
                }
            }
            if (frame) {
                buster.el = frame;
                buster.responder = e.responder;
                shouldRespond = 1;
                buster.set({
                    sameSide: 1,
                    referrer: packet.referrer
                });
                extend(buster.parts, {
                    srcElement: e.srcElement,
                    wrapper: wrapper,
                    top: tippyTop,
                    doc: topDoc
                });
            }
            if (shouldRespond) {
                parentEl = buster.el[PARENT]();
                buster.respond(data, {
                    parent: {
                        height: parentEl[HEIGHT](),
                        width: parentEl[WIDTH](),
                        style: {
                            height: parentEl.index(0).style[HEIGHT],
                            width: parentEl.index(0).style[WIDTH]
                        }
                    }
                });
            }
        },
        /**
         * single handler for all busters under same window makes it easy to remove from window when the time comes to unload
         * @private
         * @arg {event} event object passed in by browser
         */
        receive = function (evt) {
            var buster, bustersCache, data = parse(evt.data),
                postTo = data.postTo;
            if (data && postTo && !app.isDestroying) {
                bustersCache = associator.get(postTo);
                if (bustersCache) {
                    buster = bustersCache.buster;
                    if (buster && buster.run) {
                        buster.run(data, evt);
                    }
                }
            }
        },
        /**
         * single function to stringify and post message an object to the other side
         * @private
         * @arg {object} object to be stringified and sent to the receive function,
         * either through a post message, or through a setTimeout
         * @arg {buster}
         */
        postMessage = function (base, buster) {
            var busterAttrs = buster[ATTRIBUTES],
                sameSide = busterAttrs.sameSide,
                parts = buster.parts,
                message = stringify(base),
                timestamp = now(),
                doReceive = function () {
                    receive({
                        data: message,
                        frame: buster.el,
                        responder: receive,
                        srcElement: window,
                        timestamp: timestamp
                    });
                };
            if (!sameSide) {
                if (busterAttrs.referrer) {
                    parts.sendWin.postMessage(message, busterAttrs.referrer);
                } else {
                    console.trace('missing referrer', buster);
                }
            }
            if (sameSide) {
                doReceive();
            }
            return timestamp;
        },
        /**
         * object for 4 different setup cases. probably belongs elsewhere
         * @private
         * @arg {buster}
         */
        setups = {
            /**
             * @private
             */
            toInner: function (buster) {
                var attrs = buster[ATTRIBUTES],
                    parts = buster.parts;
                parts.sendWin = buster[PARENT].el.index(0).contentWindow;
                attrs.referrer = attrs.referrer || reference(parts.doc);
                attrs.sameSide = !buster[PARENT][PARENT].get('unfriendlyCreative');
            },
            /**
             * @private
             */
            fromInner: function (buster) {
                var attrs = buster[ATTRIBUTES],
                    parts = buster.parts;
                parts.sendWin = parts.receiveWin[PARENT];
                attrs.referrer = attrs.referrer || reference(parts.doc);
            },
            notInner: {
                /**
                 * @private
                 */
                noAccess: function (buster) {
                    var url, attrs = buster[ATTRIBUTES],
                        parts = buster.parts,
                        doc = parts.doc,
                        iframe = doc.createElement('iframe'),
                        allMods = _.clone(app.allModules);
                    allMods.push('initPublisherConfig');
                    if (!attrs.busterLocation) {
                        return;
                    }
                    iframe.style.display = 'none';
                    url = attrs.referrer + attrs.busterLocation;
                    iframe.src = _.stringifyQuery({
                        url: attrs.referrer + attrs.busterLocation,
                        query: {
                            origin: doc.location.href,
                            sessionId: attrs.sessionId,
                            src: app.BASEURL + buster.get('scriptUrl') + app.addVersionNumber(allMods).join()
                        }
                    });
                    parts.wrapper.appendChild(iframe);
                    parts.sendWin = iframe.contentWindow;
                    buster.el = $(iframe);
                    promise.Ajax(url).failure(function () {
                        var time = 2000;
                        if (_.isMobile) {
                            time = 10000;
                        }
                        setTimeout(function () {
                            // handle no buster file here
                            var ret, ad = buster[PARENT],
                                adAttrs = ad[ATTRIBUTES],
                                banner = ad.children.index(1),
                                panel = ad.children.index(2);
                            if (!ad.busterLoaded) {
                                if (!banner) {
                                    banner = panel;
                                }
                                ret = panel.destroy && panel.destroy();
                                buster.unSendAll();
                                buster.on('message:queued', buster.unSendAll);
                            }
                        }, time);
                    });
                },
                /**
                 * @private
                 */
                topAccess: function (buster) {
                    var commands, newParent = buster.el.index(0),
                        attrs = buster[ATTRIBUTES];
                    // if preventselfinit is true, then that means that
                    // this is being triggered by the buster file
                    if (!attrs.preventSelfInit) {
                        if (attrs.publisherConfig) {
                            // // does need some special functions
                            _.Ajax('http:' + app.SERVERURL + app.SCRIPTPATH + attrs.publisherConfig).success(function (responseText) {
                                new Function.constructor('return ' + responseText)();
                                buster.begin();
                            });
                        } else {
                            // doesn't need any special functions
                            buster.addCommand(factories.publisherConfig());
                            buster.begin();
                        }
                    } else {
                        buster.addCommand(factories.publisherConfig());
                    }
                }
            }
        },
        containerSize = function (components) {
            return components.foldr(function (memo, idx, com) {
                var preventScrollCounter = 0,
                    hPushCount = 0,
                    vPushCount = 0,
                    calced = com.calculatedSize,
                    verticalPush = com.pushVertical,
                    horizontalPush = com.pushHorizontal;
                if (verticalPush !== '') {
                    vPushCount++;
                }
                if (horizontalPush !== '') {
                    hPushCount++;
                }
                if (com.isShowing && com.container === 'ad') {
                    if (com.preventScroll) {
                        preventScrollCounter = 1;
                    }
                    memo = {
                        top: Math.min(memo[TOP], calced[TOP]),
                        left: Math.min(memo[LEFT], calced[LEFT]),
                        right: Math.max(memo[RIGHT], (calced[LEFT] + calced[WIDTH])),
                        bottom: Math.max(memo[BOTTOM], (calced[TOP] + calced[HEIGHT])),
                        zIndex: Math.max(memo.zIndex, (+com.zIndex || 0)),
                        marginRight: Math.max(memo[MARGIN_RIGHT], horizontalPush || 0),
                        marginBottom: Math.max(memo[MARGIN_BOTTOM], verticalPush || 0),
                        vPushCount: vPushCount + memo.vPushCount,
                        hPushCount: hPushCount + memo.hPushCount,
                        transitionDuration: Math.max(memo.transitionDuration, com.duration),
                        preventScrollCount: memo.preventScrollCount + preventScrollCounter
                    };
                }
                return memo;
            }, {
                top: infin,
                left: infin,
                right: nInfin,
                bottom: nInfin,
                marginBottom: 0,
                marginRight: 0,
                zIndex: 0,
                vPushCount: 0,
                hPushCount: 0,
                transitionDuration: 0,
                preventScrollCount: 0
            });
        },
        /**
         * @class Buster
         * @augments Model
         * @augments Box
         * @augments View
         * @classDesc constructor for buster objects, which have the ability to talk across windows
         */
        Message = factories.Container.extend('Message', {
            initialize: function () {
                var message = this;
                message.deferredHandlers = [];
                message.respondHandlers = [];
            },
            packet: function (data) {
                var ret = this;
                if (arguments[0]) {
                    this.set('packet', data || {});
                } else {
                    ret = parse(stringify(this.get('packet')));
                }
                return ret;
            },
            defaults: function () {
                return {
                    command: 'null',
                    packet: {}
                };
            },
            deferred: function (fn) {
                this.on('deferred', fn);
                return this;
            },
            respond: function (fn) {
                var message = this,
                    buster = message[PARENT];
                if (isFunction(fn)) {
                    message.respondHandlers.push(bind(fn, message));
                }
                if (message[RESPONSE_OPTIONS]) {
                    while (message.respondHandlers[0]) {
                        handler = message.respondHandlers.shift();
                        handler(message[RESPONSE_OPTIONS]);
                    }
                }
                return message;
            }
        }),
        Buster = factories.Buster = factories.Box.extend('Buster', {
            Model: Message,
            events: {
                unload: 'destroy',
                'change:isConnected': function () {
                    this.set(QUEUED_MESSAGE_INDEX, 1);
                },
                'change:isConnected child:added': 'flush'
            },
            parentEvents: {
                destroy: 'destroy'
            },
            /**
             * @func
             * @name Buster#destroy
             */
            currentPoint: function () {
                var currentPoint = this.get('currentPoint');
                return currentPoint ? {
                    source: currentPoint.source,
                    srcElement: currentPoint.srcElement,
                    originTimestamp: currentPoint.timestamp,
                    frame: currentPoint.frame,
                    responder: currentPoint.responder
                } : {};
            },
            destroy: function () {
                var buster = this,
                    attrs = buster[ATTRIBUTES];
                buster.set('isConnected', BOOLEAN_FALSE);
                clearTimeout(attrs.__lastMouseMovingTimeout__);
                _.AF.remove(attrs.elQueryId);
                _.AF.remove(attrs.componentTransitionAFID);
                buster.parts = {};
                associator.remove(buster.id);
                factories.Box.constructor.prototype.destroy.apply(this, arguments);
                return buster;
            },
            tellMouseMovement: function () {
                if (this.get('mouseMoveDataObject')) {
                    this.respond(this.get('mouseMoveDataObject'));
                }
            },
            /**
             * @func
             * @name Buster#defaults
             */
            defaults: function () {
                return {
                    currentState: 'collapse',
                    connectedUnder: [],
                    isConnected: 0,
                    sameSide: 0,
                    queuedMessageIndex: 0,
                    sent: []
                };
            },
            // belongs on the outside
            _stateCss: function (set0) {
                var busterAttrs = this[ATTRIBUTES],
                    _sizing = busterAttrs._sizing,
                    margin = {
                        transitionProperty: 'all'
                    };
                if (_sizing) {
                    if (_sizing.vPushCount) {
                        margin[MARGIN_BOTTOM] = busterAttrs.pushVerticalVal;
                        margin.transitionDuration = _sizing.transitionDuration;
                    } else {
                        if (set0) {
                            margin[MARGIN_BOTTOM] = 0;
                        } else {
                            margin[MARGIN_BOTTOM] = 'auto';
                        }
                    }
                    if (_sizing.hPushCount) {
                        margin[MARGIN_RIGHT] = busterAttrs.pushHorizontalVal;
                        margin.transitionDuration = _sizing.transitionDuration;
                    } else {
                        if (set0) {
                            margin[MARGIN_RIGHT] = 0;
                        } else {
                            margin[MARGIN_RIGHT] = 'auto';
                        }
                    }
                }
                return margin;
            },
            /**
             * initial setup for all busters
             * @func
             * @name Buster#initialize
             */
            initialize: function (opts, options) {
                var receiveWin, registered, buster = this,
                    attrs = buster[ATTRIBUTES];
                buster[COMPONENTS] = collection();
                buster.showing = collection();
                buster.on(BEFORE_RESPONDED, attrs.every);
                buster.addCommand({
                    initialize: _setupInit,
                    begin: this.begin,
                    update: function (e) {
                        this.respond(e.data());
                    },
                    unload: function () {
                        this.destroy();
                    },
                    // belongs on the outside
                    updateAttributes: function (e) {
                        var buster = this,
                            data = e.data(),
                            packet = data.packet;
                        buster.set(packet.update);
                        duff(packet[COMPONENTS], function (com) {
                            var component = buster[COMPONENT](com.registeredAs);
                            if (!component) {
                                buster[COMPONENTS].add(com);
                            } else {
                                extend(component, com);
                            }
                        });
                        buster[COMPONENTS].each(function (com) {
                            if (_.posit(packet.showing, com.registeredAs)) {
                                com.isShowing = BOOLEAN_TRUE;
                            } else {
                                com.isShowing = BOOLEAN_FALSE;
                            }
                        });
                        if (packet.shouldRespond) {
                            buster.respond();
                        }
                    }
                });
                buster.allListeners = collection();
                attrs.frame = null;
                buster.el = $(buster.parts.frame);
                registered = associator.get(attrs.id);
                registered.buster = buster;
                registered.postListener = receive;
                receiveWin = $(buster.parts.receiveWin);
                receiveWin.on('message', receive);
                buster.allListeners.push({
                    els: receiveWin,
                    fn: receive,
                    name: 'message'
                });
                if (attrs.type === 'buster') {
                    if (!attrs.sameSide) {
                        setups.notInner.noAccess(buster);
                    } else {
                        setups.notInner.topAccess(buster);
                    }
                }
                // always assume the need to bust for these two
                if (attrs.type !== 'buster') {
                    if (attrs.toInner) {
                        setups.toInner(buster);
                    }
                    if (attrs.fromInner) {
                        setups.fromInner(buster);
                    }
                }
                return buster;
            },
            component: function (registeredAs) {
                return this[COMPONENTS].find(function (com, idx) {
                    return com.registeredAs === registeredAs || idx === registeredAs;
                });
            },
            // this belongs on the outside
            /**
             * quick get parser to figure out if the wrapper, the frame element, it's parent, the document, or an other item is being selected by a post message
             * @arg {string} target selector
             * @returns {DOMM} with targets
             * @func
             * @name Buster#getTargets
             */
            getTargets: function (target) {
                var buster = this,
                    attrs = buster[ATTRIBUTES],
                    parts = buster.parts,
                    top = parts[TOP],
                    targets = [],
                    wrapper = parts.wrapper;
                if (!target) {
                    targets = [top];
                }
                if (target === 'wrapper') {
                    targets = [wrapper];
                }
                if (target === 'self') {
                    targets = buster.el;
                }
                if (target === 'document') {
                    targets = [parts.doc];
                }
                if (target === PARENT) {
                    targets = buster.el[PARENT]();
                }
                if (!targets[LENGTH]) {
                    targets = parts.doc.querySelectorAll(target);
                }
                return $(targets);
            },
            /**
             * tries to flush the cache. only works if the isConnected attribute is set to true. If it is, then the post message pipeline begins
             * @returns {buster} returns this;
             * @func
             * @name Buster#flush
             */
            flush: function () {
                var n, item, gah, childrenLen, queuedMsg, nuData, i = 0,
                    buster = this,
                    currentIdx = buster.get(QUEUED_MESSAGE_INDEX),
                    connected = buster.get('isConnected'),
                    initedFrom = buster.get('initedFromPartner'),
                    flushing = buster.get('flushing');
                if (!initedFrom || connected && ((connected || !currentIdx) && !flushing)) {
                    buster.set('flushing', BOOLEAN_TRUE);
                    childrenLen = buster.children[LENGTH]();
                    queuedMsg = buster.children.index(currentIdx);
                    while (queuedMsg && currentIdx < childrenLen) {
                        queuedMsg.set({
                            runCount: 0
                        });
                        postMessage(queuedMsg, buster);
                        if (currentIdx) {
                            currentIdx = (buster.get(QUEUED_MESSAGE_INDEX) + 1) || 0;
                            buster.set(QUEUED_MESSAGE_INDEX, currentIdx);
                            queuedMsg = buster.children.index(currentIdx);
                        } else {
                            childrenLen = BOOLEAN_FALSE;
                        }
                    }
                    buster.set({
                        flushing: BOOLEAN_FALSE
                    });
                    if (buster.get('isConnected')) {
                        if (buster.children[LENGTH]() > buster.get(QUEUED_MESSAGE_INDEX)) {
                            buster.flush();
                        }
                    }
                }
                return buster;
            },
            /**
             * basic send message function, adds to queue, then calls flush
             * @arg {string} can be string or object. if object, must have command property as string
             * @arg {object} base object to be sent
             * @returns {buster}
             * @func
             * @name Buster#send
             */
            send: function (command, packet, extra) {
                var message, buster = this,
                    defaultObj = buster.defaultMessage();
                message = buster.add(extend({
                    command: command,
                    packet: packet
                }, defaultObj, extra));
                return buster.children.index(defaultObj.index);
            },
            /**
             * shorthand for creating a function that gets called after the buster's partner has responded
             * @func
             * @name Buster#sync
             */
            sync: function (fn) {
                return this.send('update').respond(fn);
            },
            /**
             * if a buster is found on the receive function, by the data's postTo property, then the run method is called
             * @arg {object} the parsed data object
             * @arg {event} the event object that wrapped the stringified data object
             * @returns {buster}
             * @func
             * @name Buster#run
             */
            run: function (data, currentPoint_) {
                var packet, format, retVal, responded, onResponse, originalMessage, responseType, methodName, buster = this,
                    attrs = buster[ATTRIBUTES],
                    currentPoint = attrs.currentPoint = currentPoint_,
                    event = currentPoint,
                    messages = attrs.sent,
                    runCount = data.runCount,
                    children = buster.children,
                    eventname = 'respond',
                    args = _.toArray(arguments);
                if (runCount) {
                    originalMessage = children.index(data.index);
                    if (originalMessage) {
                        // found the message that i originally sent you
                        // packet = originalMessage.packet;
                        // allow the buster to set some things up
                        buster[DISPATCH_EVENT](BEFORE_RESPONDED);
                        if (runCount === 1) {
                            // stash it for later
                            originalMessage[RESPONSE_OPTIONS] = data;
                        } else {
                            eventname = 'deferred';
                        }
                        originalMessage[DISPATCH_EVENT](eventname);
                    }
                } else {
                    buster[DISPATCH_EVENT]('receive:' + data.command);
                    buster[DISPATCH_EVENT]('receive');
                }
                return buster;
            },
            /**
             * skip the queue, and simply send a message
             * @arg {object} message object to be sent
             * @arg {object} optional object that is the original object. Usually only applicable when passed in through the send function, so that the response event can have all of the correct information
             * @returns {buster}
             * @func
             * @name Buster#sendMessage
             */
            // sendMessage: function (message) {
            //     var buster = this;
            //     // set again to make sure that it has all the right info
            //     // message.set(buster.defaultMessage());
            //     postMessage(_.fullClone(message), buster);
            //     return buster;
            // },
            /**
             * creates a default message based on the attributes of the buster
             * @returns {object} blank / default message object
             * @func
             * @name Buster#defaultMessage
             */
            defaultMessage: function () {
                var attrs = this[ATTRIBUTES];
                return {
                    from: attrs.id,
                    postTo: attrs.postTo,
                    sameSide: attrs.sameSide,
                    fromInner: attrs.fromInner,
                    toInner: attrs.toInner,
                    // runCount: 0,
                    index: this.children[LENGTH](),
                    preventResponse: BOOLEAN_FALSE
                };
            },
            /**
             * @func
             * @name Buster#shouldUpdate
             */
            shouldUpdate: function (args) {
                var ret, buster = this,
                    attrs = buster[ATTRIBUTES],
                    lastUpdate = attrs.lastRespondUpdate,
                    lastFrameRect = attrs.lastFrameRect,
                    top = buster.parts[TOP] || {},
                    width = top.innerWidth,
                    height = top.innerHeight,
                    nowish = now();
                if (lastUpdate > nowish - 1000 && _.isObject(lastFrameRect)) {
                    ret = !(lastFrameRect[BOTTOM] < -height * 0.5 || lastFrameRect.top > height * 1.5 || lastFrameRect[RIGHT] < -width * 0.5 || lastFrameRect[LEFT] > width * 1.5);
                } else {
                    ret = 1;
                }
                clearTimeout(attrs.lastUpdateThrottledId);
                if (!ret) {
                    attrs.lastUpdateThrottledId = setTimeout(function () {
                        buster.respond.apply(buster, args);
                    }, -(nowish - lastUpdate - 1000));
                }
                return !buster.startThrottle || ret;
            },
            /**
             * respond trigger.
             * @arg {object} original data object (same pointer) that was sent over
             * @arg {object} extend object, that will be applied to a base object, that is created by the responseExtend attribute set on the buster object
             * @returns {buster}
             * @func
             * @name Buster#respond
             */
            respond: function (data, extendObj) {
                var lastRespondUpdate, message, buster = this,
                    attrs = buster[ATTRIBUTES],
                    sameSide = attrs.sameSide,
                    base = {};
                if (!extendObj || !_.isObject(extendObj)) {
                    extendObj = {};
                }
                if (buster.el && (!data.canThrottle || buster.shouldUpdate(arguments))) {
                    // on the inner functions, we don't want to allow this
                    // module to be present, so the inner does not influence the outer
                    if (attrs.responseExtend) {
                        base = attrs.responseExtend(buster, data);
                    }
                    ++data.runCount;
                    base = {
                        from: data.postTo,
                        postTo: data.from,
                        index: data.index,
                        isResponse: 1,
                        isDeferred: data.isDeferred,
                        runCount: data.runCount,
                        command: data.command,
                        packet: extend(base, extendObj)
                    };
                    // used for throttling
                    attrs.lastRespondUpdate = postMessage(base, buster);
                    buster[DISPATCH_EVENT]('respond:' + data.command);
                    if (data.isDeferred) {
                        buster[DISPATCH_EVENT]('deferred:' + data.command);
                    }
                    data.isDeferred = 1;
                }
                return buster;
            },
            /**
             * @returns {object} client rect duplicate of element
             * @func
             * @name Buster#getFrameRect
             */
            getFrameRect: function () {
                var clientRect = this[ATTRIBUTES].lastFrameRect = this.el.clientRect();
                return clientRect;
            },
            /**
             * @returns {object} client rect duplicate of parent element
             * @func
             * @name Buster#getParentRect
             */
            getParentRect: function () {
                var parentRect = this[ATTRIBUTES].lastParentRect = this.el[PARENT]().clientRect();
                return parentRect;
            },
            updateTopData: function () {
                var buster = this,
                    attrs = get(buster),
                    parts = buster.parts,
                    topWin = parts.top || {},
                    location = topWin.location || {
                        hash: '',
                        pathname: '',
                        protocol: '',
                        search: ''
                    },
                    topData = attrs.topData = {
                        location: {
                            hash: location.hash.slice(1),
                            host: location.host,
                            href: location.href,
                            origin: location.origin,
                            pathname: location.pathname.slice(1),
                            port: location.port,
                            protocol: location.protocol.slice(0, location.protocol[LENGTH] - 1),
                            search: location.search.slice(1)
                        },
                        innerHeight: topWin.innerHeight || 0,
                        outerHeight: topWin.outerHeight || 0,
                        innerWidth: topWin.innerWidth || 0,
                        outerWidth: topWin.outerWidth || 0,
                        scrollX: topWin.scrollX || 0,
                        scrollY: topWin.scrollY || 0
                    };
                return topData;
            },
            /**
             * gets the wrapper info, such as scroll height, id, and the classname
             * @returns {object} key value pairs of all of the data that defines the wrapper
             * @func
             * @name Buster#wrapperInfo
             */
            wrapperInfo: function () {
                var info, buster = this,
                    parts = buster.parts,
                    el = parts.wrapper || {},
                    doc = parts.doc || {
                        body: {}
                    },
                    root = doc.body.parentNode,
                    getBoundingClientRect = {},
                    attrs = get(buster);
                if (el.tagName) {
                    getBoundingClientRect = $(el).clientRect();
                }
                info = attrs.wrapperInfo = {
                    readyState: (doc.readyState === 'complete'),
                    scrollHeight: el.scrollHeight,
                    scrollWidth: el.scrollWidth,
                    scrollLeft: el.scrollLeft,
                    scrollTop: el.scrollTop,
                    className: el.className,
                    pageTitle: doc.title,
                    id: el.id,
                    height: pI(getBoundingClientRect.height),
                    bottom: pI(getBoundingClientRect.bottom),
                    width: pI(getBoundingClientRect.width),
                    right: pI(getBoundingClientRect.right),
                    left: pI(getBoundingClientRect.left),
                    top: pI(getBoundingClientRect[TOP])
                };
                return info;
            },
            /**
             * @returns {object} position in document as calculated by the buster attributes
             * @func
             * @name Buster#positionInDocument
             */
            positionInDocument: function () {
                var attrs = this[ATTRIBUTES],
                    wrapperInfo = attrs.wrapperInfo,
                    contentRect = attrs.lastParentRect,
                    pos = attrs.lastPosInDoc = {
                        top: pI(contentRect[TOP] - wrapperInfo[TOP]),
                        bottom: pI(wrapperInfo[HEIGHT] - contentRect[TOP] - wrapperInfo.scrollTop - contentRect[HEIGHT]),
                        left: pI(contentRect[LEFT] - wrapperInfo[LEFT]),
                        right: pI(wrapperInfo[WIDTH] - contentRect[RIGHT] - wrapperInfo.scrollLeft - wrapperInfo[LEFT])
                    };
                return pos;
            },
            calculateSizes: function () {
                var buster = this,
                    attrs = get(buster),
                    parentStyle = attrs.lastParentStyle = buster.el[PARENT]().getStyle(),
                    comSizes = attrs[COMPONENTS] = buster[COMPONENTS].map(function (idx, com) {
                        return buster.calculateSize(com);
                    });
                return comSizes;
            },
            showComponents: function (showList) {
                var buster = this;
                duff(gapSplit(showList), function (id) {
                    var com = buster[COMPONENT](id);
                    if (com) {
                        com.isShowing = BOOLEAN_TRUE;
                    }
                });
            },
            hideComponents: function (hideList) {
                var buster = this;
                duff(gapSplit(hideList), function (id) {
                    var com = buster[COMPONENT](id);
                    if (com) {
                        com.isShowing = BOOLEAN_FALSE;
                    }
                });
            },
            calculateContainerSize: function (components) {
                var buster = this,
                    attrs = get(buster),
                    parentRect = attrs.lastParentRect,
                    sizing = containerSize(components || buster[COMPONENTS]);
                attrs._sizing = sizing;
                attrs.containerSize = {
                    top: sizing[TOP],
                    left: sizing[LEFT],
                    width: sizing[RIGHT] - sizing[LEFT],
                    height: sizing[BOTTOM] - sizing[TOP]
                };
                attrs.pushVerticalVal = Math.min(Math.max(sizing[BOTTOM] - parentRect[BOTTOM], 0), sizing[MARGIN_BOTTOM]);
                attrs.pushHorizontalVal = Math.min(Math.max(sizing[RIGHT] - parentRect[RIGHT], 0), sizing[MARGIN_RIGHT]);
                sizing = attrs.containerCss = {
                    top: sizing[TOP] - parentRect[TOP],
                    left: sizing[LEFT] - parentRect[LEFT],
                    width: sizing[RIGHT] - sizing[LEFT],
                    height: sizing[BOTTOM] - sizing[TOP],
                    zIndex: sizing.zIndex || 'inherit'
                };
                return sizing;
            },
            calculateSize: function (component) {
                var buster = this,
                    attrs = get(buster),
                    expansion = factories.expansion[component.dimensionType || 'match'],
                    parentRect = attrs.lastParentRect,
                    parentStyle = attrs.lastParentStyle,
                    result = (expansion || factories.expansion.match).call(buster, component, parentRect, parentStyle, buster.parts[TOP]),
                    // these are always relative to the viewport
                    calcSize = component.calculatedSize = _.floor({
                        top: result[TOP],
                        left: result[LEFT],
                        width: result[WIDTH],
                        height: result[HEIGHT]
                    }, 2);
                return calcSize;
            },
            /**
             * constantly posts until it gets a response
             * @arg {object} message to go to the opposite buster pair
             * @arg {number} optionally pass a number to change the setInterval time
             * @returns {number} interval id that corresponds to the setInterval call id
             * @func
             * @name Buster#shout
             */
            shout: function (command, obj, extra, timer) {
                var intervalId, buster = this,
                    message = buster.send(command, obj, extra);
                intervalId = _.AF.time(timer || 100, function () {
                    postMessage(obj, buster);
                });
                return intervalId;
            },
            /**
             * starts a relationship between two busters. simplifies the initialization process.
             * @returns {number} just for responding to the original message in case there's a handler
             * @func
             * @name Buster#begin
             */
            begin: function () {
                var buster = this,
                    attrs = buster[ATTRIBUTES],
                    message = buster.send('initialize', {
                        referrer: attrs.publisher
                    });
                message.respond(function (e) {
                    var data = e.data(),
                        packet = data.packet;
                    buster.set('isConnected', BOOLEAN_TRUE);
                });
            }
        }, BOOLEAN_TRUE);
    if (app.topAccess) {
        $(window[TOP]).on('message', receive);
    }
    _.exports({
        containerSize: containerSize
    });
});