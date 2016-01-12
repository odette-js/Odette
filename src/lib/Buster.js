application.scope().module('Buster', function (module, app, _, $) {
    var blank, isReceiving = 0,
        get = _.get,
        duff = _.duff,
        gapSplit = _.gapSplit,
        associator = _.associator,
        unitsToNum = _.unitsToNum,
        roundFloat = _.roundFloat,
        extend = _.extend,
        factories = _.factories,
        infin = 32767,
        attributesString = 'attributes',
        // 0 is first positive -1 is first non positive
        nInfin = -infin - 1,
        lengthString = 'length',
        heightString = 'height',
        widthString = 'width',
        bottomString = 'bottom',
        rightString = 'right',
        leftString = 'left',
        topString = 'top',
        marginBottomString = 'marginBottom',
        marginRightString = 'marginRight',
        minHeightString = 'minHeight',
        maxHeightString = 'maxHeight',
        minWidthString = 'minWidth',
        maxWidthString = 'minWidth',
        queuedMessageIndexString = 'queuedMessageIndex',
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
                tippyTop = window[topString];
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
                                        currentCheck = currentCheck.parent;
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
                        referrer: _.getReference(parts.doc)
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
                parentEl = buster.el.parent();
                buster.respond(data, {
                    parent: {
                        height: parentEl[heightString](),
                        width: parentEl[widthString](),
                        style: {
                            height: parentEl.get(0).style[heightString],
                            width: parentEl.get(0).style[widthString]
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
            var buster, bustersCache, data = _.parse(evt.data),
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
            var busterAttrs = buster[attributesString],
                sameSide = busterAttrs.sameSide,
                parts = buster.parts,
                message = JSON.stringify(base),
                timestamp = _.nowish(),
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
                    window.console.trace('missing referrer', buster);
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
                var attrs = buster[attributesString],
                    parts = buster.parts;
                parts.sendWin = buster.parent.el.get(0).contentWindow;
                attrs.referrer = attrs.referrer || _.getReference(parts.doc);
                attrs.sameSide = !buster.parent.parent.get('unfriendlyCreative');
            },
            /**
             * @private
             */
            fromInner: function (buster) {
                var attrs = buster[attributesString],
                    parts = buster.parts;
                parts.sendWin = parts.receiveWin.parent;
                attrs.referrer = attrs.referrer || _.getReference(parts.doc);
            },
            notInner: {
                /**
                 * @private
                 */
                noAccess: function (buster) {
                    var url, attrs = buster[attributesString],
                        parts = buster.parts,
                        doc = parts.doc,
                        iframe = doc.createElement('iframe'),
                        allMods = _.clone(app.allModules);
                    allMods.push('initPublisherConfig');
                    if (attrs.busterLocation) {
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
                        _.Ajax(url).failure(function () {
                            var time = 2000;
                            if (_.isMobile) {
                                time = 10000;
                            }
                            setTimeout(function () {
                                // handle no buster file here
                                var ret, ad = buster.parent,
                                    adAttrs = ad[attributesString],
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
                    }
                },
                /**
                 * @private
                 */
                topAccess: function (buster) {
                    var commands, newParent = buster.el.get(0),
                        attrs = buster[attributesString];
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
                        top: Math.min(memo[topString], calced[topString]),
                        left: Math.min(memo[leftString], calced[leftString]),
                        right: Math.max(memo[rightString], (calced[leftString] + calced[widthString])),
                        bottom: Math.max(memo[bottomString], (calced[topString] + calced[heightString])),
                        zIndex: Math.max(memo.zIndex, (+com.zIndex || 0)),
                        marginRight: Math.max(memo[marginRightString], horizontalPush || 0),
                        marginBottom: Math.max(memo[marginBottomString], verticalPush || 0),
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
        };
    if (app.topAccess) {
        $(window[topString]).on('message', receive);
    }
    /**
     * @class Buster
     * @augments Model
     * @augments Box
     * @augments View
     * @classDesc constructor for buster objects, which have the ability to talk across windows
     */
    var Message = _.extendFrom.Container('Message', {
        // idAttribute: 'command',
        packet: function (data) {
            var ret = this;
            if (arguments[0]) {
                this.set({
                    packet: data || {}
                });
            } else {
                ret = _.parse(_.stringify(this.get('packet')));
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
                buster = message.parent;
            if (_.isFunction(fn)) {
                message.once('respond', fn);
            }
            if (message.responseOptions) {
                message.dispatchEvent('respond', message.responseOptions, buster.currentPoint());
            }
            return message;
        }
    });
    factories.Buster = _.extendFrom.Box('Buster', {
        Model: Message,
        events: {
            unload: 'destroy',
            'alter:isConnected': function () {
                this.set(queuedMessageIndexString, 1);
            },
            'alter:isConnected child:added': 'flush'
        },
        parentEvents: {
            destroy: 'destroy'
        },
        /**
         * @func
         * @name Buster#destroy
         */
        currentPoint: function () {
            var currentPoint = this.get('currentPoint') || {};
            return {
                source: currentPoint.source,
                srcElement: currentPoint.srcElement,
                originTimestamp: currentPoint.timestamp,
                frame: currentPoint.frame,
                responder: currentPoint.responder
            };
        },
        destroy: function () {
            var buster = this,
                attrs = get(buster);
            buster.set({
                isConnected: !1
            });
            buster.resetElements();
            clearTimeout(attrs.__lastMouseMovingTimeout__);
            _.AF.remove(attrs.elQueryId);
            _.AF.remove(attrs.componentTransitionAFID);
            buster.allListeners.each(function (idx, obj) {
                obj.els.off(obj.name, obj.fn, obj.capture);
            });
            buster.el.offAll();
            buster.el.shift();
            buster.parts = {};
            associator.remove(buster.id);
            factories.Box.prototype.destroy.apply(this, arguments);
            return buster;
        },
        tellMouseMovement: function () {
            if (this.get('mouseMoveDataObject')) {
                this.respond(this.get('mouseMoveDataObject'));
            }
        },
        reapplyCss: function (extend) {
            var containerSize, hw = {},
                buster = this,
                attrs = get(buster);
            if (attrs.frameAlwaysFillHeight) {
                hw[heightString] = '100%';
            }
            if (attrs.frameAlwaysFillWidth) {
                hw[widthString] = '100%';
            }
            hw = _.extend(buster.calculateContainerSize(), extend, hw);
            buster.el.css(hw);
            if (buster.get('applyImportant')) {
                buster.applyImportantStyles(buster.el.get(0));
            }
            return buster;
        },
        applyImportantStyles: function (el) {
            var panel = buster.components.get(2);
            var hasDuration;
            var style = (el.getAttribute('style') || '').split(' !important').join('').split('!important').join('').split('important').join('').split('!').join('').split(';');
            el.setAttribute('style', _.foldl(style, function (memo, idx, val) {
                var split;
                if (val) {
                    split = val.trim().split(': ');
                    if (val && split[0] && split[1]) {
                        memo.push(split[0].trim() + ': ' + split[1].trim() + ' !important;');
                    }
                }
                return memo;
            }, []).join(' '));
        },
        unSend: function (obj) {
            var buster = this,
                every = buster.get('every');
            every.apply(buster, [obj, {},
                buster.parent
            ]);
            if (obj.packet.onRespond) {
                obj.packet.onRespond.apply(buster, [obj, {},
                    buster.parent
                ]);
            }
        },
        unSendAll: function () {
            var queued = this.get('queued');
            while (queued[0]) {
                this.unSend(queued.shift());
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
            var busterAttrs = get(this),
                _sizing = busterAttrs._sizing,
                margin = {
                    transitionProperty: 'all'
                };
            if (_sizing) {
                if (_sizing.vPushCount) {
                    margin[marginBottomString] = busterAttrs.pushVerticalVal;
                    margin.transitionDuration = _sizing.transitionDuration;
                } else {
                    if (set0) {
                        margin[marginBottomString] = 0;
                    } else {
                        margin[marginBottomString] = 'auto';
                    }
                }
                if (_sizing.hPushCount) {
                    margin[marginRightString] = busterAttrs.pushHorizontalVal;
                    margin.transitionDuration = _sizing.transitionDuration;
                } else {
                    if (set0) {
                        margin[marginRightString] = 0;
                    } else {
                        margin[marginRightString] = 'auto';
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
                attrs = buster[attributesString];
            buster.components = _.Collection();
            buster.showing = _.Collection();
            buster.on('before:responded', attrs.every);
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
                    duff(packet.components, function (idx, com) {
                        var component = buster.component(com.registeredAs);
                        if (!component) {
                            buster.components.add(com);
                        } else {
                            extend(component, com);
                        }
                    });
                    buster.components.each(function (idx, com) {
                        if (_.posit(packet.showing, com.registeredAs)) {
                            com.isShowing = !0;
                        } else {
                            com.isShowing = !1;
                        }
                    });
                    if (packet.shouldRespond) {
                        buster.respond();
                    }
                }
            });
            buster.allListeners = _.Collection();
            extend(attrs, {
                frame: null
            });
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
            return this.components.find(function (com, idx) {
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
                attrs = buster[attributesString],
                parts = buster.parts,
                top = parts.top,
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
            if (target === 'parent') {
                targets = buster.el.parent();
            }
            if (!targets[lengthString]) {
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
                currentIdx = buster.get(queuedMessageIndexString),
                connected = buster.get('isConnected'),
                initedFrom = buster.get('initedFromPartner'),
                flushing = buster.get('flushing');
            if (!initedFrom || connected && ((connected || !currentIdx) && !flushing)) {
                buster.set({
                    flushing: !0
                });
                childrenLen = buster.children.length();
                queuedMsg = buster.children.index(currentIdx);
                while (queuedMsg && currentIdx < childrenLen) {
                    queuedMsg.set({
                        runCount: 0
                    });
                    postMessage(queuedMsg, buster);
                    if (currentIdx) {
                        currentIdx = (buster.get(queuedMessageIndexString) + 1) || 0;
                        buster.set(queuedMessageIndexString, currentIdx);
                        queuedMsg = buster.children.index(currentIdx);
                    } else {
                        childrenLen = false;
                    }
                }
                buster.set({
                    flushing: !1
                });
                if (buster.get('isConnected')) {
                    if (buster.children.length() > buster.get(queuedMessageIndexString)) {
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
            message = buster.add(_.extend({
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
            var packet, format, retVal, messageJSON, responded, onResponse, originalMessage, responseType, methodName, buster = this,
                attrs = buster[attributesString],
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
                    // messageJSON = originalMessage.toJSON();
                    // found the message that i originally sent you
                    // packet = originalMessage.packet;
                    // allow the buster to set some things up
                    buster.dispatchEvent('before:responded', data, buster.currentPoint());
                    if (runCount === 1) {
                        // stash it for later
                        originalMessage.responseOptions = data;
                    } else {
                        eventname = 'deferred';
                    }
                    originalMessage.dispatchEvent(eventname, data, buster.currentPoint());
                }
            } else {
                buster.dispatchEvent('receive:' + data.command, data, buster.currentPoint());
                buster.dispatchEvent('receive', data, buster.currentPoint());
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
            var attrs = get(this);
            return {
                from: attrs.id,
                postTo: attrs.postTo,
                sameSide: attrs.sameSide,
                fromInner: attrs.fromInner,
                toInner: attrs.toInner,
                // runCount: 0,
                index: this.children.length(),
                preventResponse: false
            };
        },
        /**
         * @func
         * @name Buster#shouldUpdate
         */
        shouldUpdate: function (args) {
            var ret, buster = this,
                attrs = _.get(buster),
                lastUpdate = attrs.lastRespondUpdate,
                lastFrameRect = attrs.lastFrameRect,
                top = buster.parts.top || {},
                width = top.innerWidth,
                height = top.innerHeight,
                nowish = _.nowish();
            if (lastUpdate > nowish - 1000 && _.isObject(lastFrameRect)) {
                ret = !(lastFrameRect[bottomString] < -height * 0.5 || lastFrameRect.top > height * 1.5 || lastFrameRect[rightString] < -width * 0.5 || lastFrameRect[leftString] > width * 1.5);
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
                attrs = buster[attributesString],
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
                buster.dispatchEvent('respond:' + data.command, buster, buster.currentPoint());
                if (data.isDeferred) {
                    buster.dispatchEvent('deferred:' + data.command, buster, buster.currentPoint());
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
            var clientRect = this[attributesString].lastFrameRect = this.el.clientRect();
            return clientRect;
        },
        /**
         * @returns {object} client rect duplicate of parent element
         * @func
         * @name Buster#getParentRect
         */
        getParentRect: function () {
            var parentRect = this[attributesString].lastParentRect = this.el.parent().clientRect();
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
                        protocol: location.protocol.slice(0, location.protocol.length - 1),
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
                top: pI(getBoundingClientRect.top)
            };
            return info;
        },
        /**
         * @returns {object} position in document as calculated by the buster attributes
         * @func
         * @name Buster#positionInDocument
         */
        positionInDocument: function () {
            var attrs = this[attributesString],
                wrapperInfo = attrs.wrapperInfo,
                contentRect = attrs.lastParentRect,
                pos = attrs.lastPosInDoc = {
                    top: pI(contentRect[topString] - wrapperInfo[topString]),
                    bottom: pI(wrapperInfo[heightString] - contentRect[topString] - wrapperInfo.scrollTop - contentRect[heightString]),
                    left: pI(contentRect[leftString] - wrapperInfo[leftString]),
                    right: pI(wrapperInfo[widthString] - contentRect[rightString] - wrapperInfo.scrollLeft - wrapperInfo[leftString])
                };
            return pos;
        },
        calculateSizes: function () {
            var buster = this,
                attrs = get(buster),
                parentStyle = attrs.lastParentStyle = buster.el.parent().getStyle(),
                comSizes = attrs.componentSizes = buster.components.map(function (idx, com) {
                    return buster.calculateSize(com);
                });
            return comSizes;
        },
        showComponents: function (showList) {
            var buster = this;
            duff(gapSplit(showList), function (id) {
                var com = buster.component(id);
                if (com) {
                    com.isShowing = !0;
                }
            });
        },
        hideComponents: function (hideList) {
            var buster = this;
            duff(gapSplit(hideList), function (id) {
                var com = buster.component(id);
                if (com) {
                    com.isShowing = !1;
                }
            });
        },
        calculateContainerSize: function (components) {
            var buster = this,
                attrs = get(buster),
                parentRect = attrs.lastParentRect,
                sizing = containerSize(components || buster.components);
            attrs._sizing = sizing;
            attrs.containerSize = {
                top: sizing[topString],
                left: sizing[leftString],
                width: sizing[rightString] - sizing[leftString],
                height: sizing[bottomString] - sizing[topString]
            };
            attrs.pushVerticalVal = Math.min(Math.max(sizing[bottomString] - parentRect[bottomString], 0), sizing[marginBottomString]);
            attrs.pushHorizontalVal = Math.min(Math.max(sizing[rightString] - parentRect[rightString], 0), sizing[marginRightString]);
            sizing = attrs.containerCss = {
                top: sizing[topString] - parentRect[topString],
                left: sizing[leftString] - parentRect[leftString],
                width: sizing[rightString] - sizing[leftString],
                height: sizing[bottomString] - sizing[topString],
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
                result = (expansion || factories.expansion.match).call(buster, component, parentRect, parentStyle, buster.parts[topString]),
                // these are always relative to the viewport
                calcSize = component.calculatedSize = _.floor({
                    top: result[topString],
                    left: result[leftString],
                    width: result[widthString],
                    height: result[heightString]
                }, 2);
            return calcSize;
        },
        /**
         * uses the object condense utility to compress key, function pairs and applies them to the .commands object that handles all receive method commands
         * @returns {buster}
         * @func
         * @name Buster#addCommand
         */
        addCommand: function (obj) {
            this.on(_.foldl(obj, function (memo, name, handler) {
                memo['receive:' + name] = handler;
                return memo;
            }, {}));
            return this;
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
            // message.respond(_.once(function () {
            //     _.AF.remove(intervalId);
            //     if (_.isFunction(respondFn)) {
            //         respondFn.apply(this, arguments);
            //     }
            // }));
            intervalId = _.AF.time(timer || 100, function () {
                postMessage(obj, buster);
            });
            return intervalId;
        },
        resetElements: function () {
            var buster = this,
                nextEl = buster.el,
                finalRes = buster.parts.finalResponsified;
            do {
                _.resetAttrs(nextEl.get(0));
                nextEl = nextEl.parent();
            } while (nextEl.childOf(finalRes));
            _.resetAttrs(finalRes.get(0));
        },
        /**
         * starts a relationship between two busters. simplifies the initialization process.
         * @returns {number} just for responding to the original message in case there's a handler
         * @func
         * @name Buster#begin
         */
        begin: function () {
            var buster = this,
                attrs = buster[attributesString],
                inited = buster.initialized = 1,
                message = buster.send('initialize', {
                    expandConfig: attrs.expandConfig,
                    referrer: attrs.publisher
                });
            message.respond(function (e) {
                var data = e.data(),
                    packet = data.packet;
                buster.parent.set({
                    initParentData: packet.parent
                });
                buster.set({
                    isConnected: !0
                });
            });
            return 1;
        }
    }, !0);
    _.exports({
        containerSize: containerSize
    });
});