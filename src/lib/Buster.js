app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        isReceiving = 0,
        get = _.get,
        duff = _.duff,
        collection = factories.Collection,
        gapSplit = _.gapSplit,
        // associator = _.associator,
        unitsToNum = _.unitsToNum,
        roundFloat = _.roundFloat,
        reference = _.reference,
        now = _.now,
        parse = _.parse,
        foldl = _.foldl,
        stringify = _.stringify,
        COMPONENT = 'component',
        RESPONSE_OPTIONS = 'responseOptions',
        RESPONDED = 'responded',
        RECEIVED = 'received',
        BEFORE_RESPONDED = BEFORE_COLON + RESPONDED,
        BEFORE_RECEIVED = BEFORE_COLON + RECEIVED,
        QUEUED_MESSAGE_INDEX = 'queuedMessageIndex',
        pI = _.pI,
        _setupInit = function (e) {
            // debugger;
            // var i, currentCheck, src, parentEl, frameWin, frameEl, allFrames, tippyTop, spFacts, spOFacts, shouldRespond, friendly, topDoc, wrapper, buster = this,
            //     frame = e.frame,
            //     data = e.data(),
            //     packet = data.packet,
            //     responder = e.responder,
            //     attrs = get(buster),
            //     parts = buster.parts;
            // if (app.topAccess) {
            //     tippyTop = win[TOP];
            //     topDoc = tippyTop.document;
            //     wrapper = topDoc.body;
            // }
            // if (!frame) {
            //     if (!data.toInner) {
            //         /**
            //          * when the buster has to go through an unfriendly iframe, it has to find the iframe it belonged to from the top document
            //          * @private
            //          * @arg {string} url that is the iframe. also, secondarily checks the window objects in the while loop
            //          */
            //         buster.el = (function (specFrame) {
            //             var frame, frameWin, src, currentCheck, i,
            //                 frames = topDoc.getElementsByTagName('iframe'),
            //                 srcEl = e.srcElement;
            //             if (specFrame) {
            //                 for (i in frames) {
            //                     frame = frames[i];
            //                     frameWin = frame.contentWindow;
            //                     src = frame.src;
            //                     if (src === specFrame) {
            //                         currentCheck = srcEl;
            //                         while (currentCheck !== tippyTop) {
            //                             if (frameWin === currentCheck) {
            //                                 return frame;
            //                             }
            //                             currentCheck = currentCheck[PARENT];
            //                         }
            //                     }
            //                 }
            //             }
            //             return 0;
            //         }(attrs.srcOrigin));
            //     }
            //     if (data.toInner) {
            //         buster.el = document.body;
            //     }
            //     if (buster.el) {
            //         buster.el = $(buster.el);
            //         buster.set({
            //             friendly: 0,
            //             id: data.from,
            //             referrer: reference(parts.doc)
            //         });
            //         extend(parts, {
            //             srcElement: e.source,
            //             top: tippyTop || {},
            //             doc: topDoc || {},
            //             wrapper: wrapper || {}
            //         });
            //         shouldRespond = 1;
            //         attrs.connected = 1;
            //     }
            // }
            // if (frame) {
            //     buster.el = frame;
            //     buster.responder = e.responder;
            //     shouldRespond = 1;
            //     buster.set({
            //         friendly: 1,
            //         referrer: packet.referrer
            //     });
            //     extend(buster.parts, {
            //         srcElement: e.srcElement,
            //         wrapper: wrapper,
            //         top: tippyTop,
            //         doc: topDoc
            //     });
            // }
            // if (shouldRespond) {
            //     parentEl = buster.el[PARENT]();
            //     buster.respond(data, {
            //         parent: {
            //             height: parentEl[HEIGHT](),
            //             width: parentEl[WIDTH](),
            //             style: {
            //                 height: parentEl.index(0).style[HEIGHT],
            //                 width: parentEl.index(0).style[WIDTH]
            //             }
            //         }
            //     });
            // }
        },
        /**
         * single handler for all busters under same window makes it easy to remove from window when the time comes to unload
         * @private
         * @arg {event} event object passed in by browser
         */
        busterGroupHash = {},
        receive = function (evt) {
            var buster, bustersCache, data = parse(evt.data),
                postTo = data.postTo;
            if (!data) {
                return;
            }
            if (app.version !== data.version || app.isDestroyed) {
                return;
            }
            if (!postTo) {
                return;
            }
            buster = (busterGroupHash[data.group] || {})[data.postTo];
            if (!buster) {
                return;
            }
            var packet, format, retVal, responded, onResponse, originalMessage, responseType, methodName,
                attrs = buster.directive(DATA),
                currentPoint = attrs.currentPoint = evt,
                messages = attrs.sent,
                runCount = data.runCount,
                children = buster.children,
                eventname = 'respond',
                args = toArray(arguments);
            if (runCount) {
                originalMessage = children.get(ID, data.messageId);
                if (!originalMessage) {
                    return buster;
                }
                // found the message that i originally sent you
                // allow the buster to set some things up
                buster.response(originalMessage, data);
            } else {
                buster.receive(data);
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
            var referrer, message = stringify(base);
            return buster.emitWindow.emit(message, buster.get('emitReferrer'), receive);
        },
        defaultGroupId = uuid(),
        RESPOND_HANDLERS = 'respondHandlers',
        Message = factories.Model.extend('Message', {
            idAttribute: 'messageId',
            initialize: function () {
                var message = this;
                message[RESPOND_HANDLERS] = [];
                this.once('response', this.saveReceived);
            },
            saveReceived: function (e) {
                this.responseEventObject = e;
            },
            packet: function (data) {
                var message = this;
                if (arguments[0]) {
                    message.set('packet', data || {});
                } else {
                    message = parse(stringify(message.get('packet')));
                }
                return message;
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
            response: function (handler) {
                var message = this;
                if (!isFunction(handler)) {
                    return message;
                }
                if (message.get('respondedWith')) {
                    handler.call(message, message.responseEventObject);
                } else {
                    message.once('response', handler);
                }
                return message;
            }
        }),
        iframeEvents = {
            attach: function () {
                //
            },
            detach: function () {
                //
            }
        },
        receiveWindowEvents = {
            message: receive
        },
        wipe = function (buster) {
            find(busterGroupHash, function (groupHash) {
                find(groupHash, function (previousbuster, key, groupHash) {
                    return buster === previousbuster && delete groupHash[key];
                });
            });
        },
        disconnected = function (buster) {
            if (buster.connectPromise) {
                buster.connectPromise.reject();
            }
            buster.connectPromise = _.Promise();
        },
        connected = function (buster, message) {
            buster.connectPromise.resolve(message);
        },
        Buster = factories.Buster = factories.Model.extend('Buster', {
            Child: Message,
            events: {
                unload: 'destroy',
                'child:added': 'flush',
                'received:connect': function (e) {
                    // first submit a response so the other side can flush
                    var buster = this,
                        dataDirective = buster.directive(DATA);
                    dataDirective.set(QUEUED_MESSAGE_INDEX, 1);
                    dataDirective.set('connected', BOOLEAN_TRUE);
                    buster.respond(e.message.id);
                    connected(buster, e.message);
                    buster.flush();
                },
                'received:begin': 'begin',
                'received:update': function (e) {
                    this.respond(e.message.id, e.data());
                },
                'received:unload': 'destroy',
                'change:group change:id': 'setGroup'
            },
            connected: function (handler) {
                this.connectPromise.success(handler);
                return this;
            },
            response: function (original, data) {
                var originalData = original[DATA];
                if (!originalData) {
                    return;
                }
                originalData.set('latestResponse', data);
                if (originalData.get('isResolved')) {
                    original[DISPATCH_EVENT]('deferred', data.packet);
                } else {
                    originalData.set('respondedWith', data);
                    originalData.set('isResolved', BOOLEAN_TRUE);
                    original[DISPATCH_EVENT]('response', data.packet);
                }
            },
            receive: function (data) {
                var buster = this;
                var receiveHistory = buster.receiveHistory;
                data.originMessageId = data.messageId;
                data.messageId = receiveHistory.length();
                data.isDeferred = BOOLEAN_FALSE;
                var message = new Message(data);
                receiveHistory.push(message);
                receiveHistory.register(ID, data.messageId, message);
                buster[DISPATCH_EVENT](BEFORE_RECEIVED);
                buster[DISPATCH_EVENT](RECEIVED + COLON + data.command, data.packet, {
                    message: message
                });
                buster[DISPATCH_EVENT](RECEIVED);
                return buster;
            },
            setGroup: function () {
                var buster = this,
                    group = buster.get('group'),
                    id = buster.get('id'),
                    resultant = wipe(buster),
                    groupHash = busterGroupHash[group] = busterGroupHash[group] || {};
                groupHash[id] = buster;
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
                    originTimestamp: currentPoint.timeStamp,
                    frame: currentPoint.frame,
                    responder: currentPoint.responder
                } : {};
            },
            destroy: function () {
                var buster = this;
                buster.set('connected', BOOLEAN_FALSE);
                clearTimeout(attrs.__lastMouseMovingTimeout__);
                _.AF.remove(buster.get('elQueryId'));
                _.AF.remove(buster.get('componentTransitionAFID'));
                // associator.remove(buster.id);
                factories.Model[CONSTRUCTOR][PROTOTYPE].destroy.apply(this, arguments);
                return buster;
            },
            /**
             * @func
             * @name Buster#defaults
             */
            defaults: function () {
                return {
                    version: app.version,
                    group: defaultGroupId,
                    connected: BOOLEAN_FALSE,
                    friendly: BOOLEAN_FALSE
                };
            },
            defineWindows: function (receiveWindow, emitWindow) {
                var buster = this;
                if (receiveWindow && receiveWindow.isWindow) {
                    if (buster.receiveWindow) {
                        buster.receiveWindow.off(receiveWindowEvents);
                    }
                    buster.receiveWindow = receiveWindow.on(receiveWindowEvents);
                }
                if (emitWindow && emitWindow.isWindow) {
                    buster.emitWindow = emitWindow;
                }
            },
            defineIframe: function (iframe) {
                var busterData, emitReferrer, receiveReferrer, iframeHref, referrer, receiveWindow, data, href, windo, buster = this;
                disconnected(buster);
                if (!iframe || !iframe.isIframe) {
                    return;
                }
                if (buster.iframe) {
                    buster.iframe.off(iframeEvents);
                }
                buster.iframe = iframe.on(iframeEvents);
                if (iframe.isAttached && (windo = iframe.window())) {
                    buster.defineWindows(NULL, windo);
                }
                busterData = buster.directive(DATA);
                receiveReferrer = busterData.get('receiveReferrer') || (receiveReferrer = buster.receiveWindow.element().location.href);
                receiveReferrer = parseUrl(receiveReferrer);
                busterData.set('receiveReferrer', receiveReferrer.origin);
                // this is going to the
                data = {
                    postTo: buster.id,
                    useTop: false,
                    // post to me
                    useParent: true,
                    emitReferrer: busterData.get('receiveReferrer'),
                    id: buster.emitWindow.address,
                    group: busterData.get('group')
                };
                iframeHref = busterData.get('iframeHref');
                if (iframeHref) {
                    emitReferrer = busterData.set('emitReferrer', reference(iframeHref));
                    data.receiveReferrer = emitReferrer;
                }
                if (iframeHref && !iframe.src()) {
                    iframe.src(stringifyQuery({
                        url: iframeHref,
                        hash: data
                    }));
                } else {
                    if (iframe.isFriendly && !iframe.data('buster')) {
                        iframe.data('buster', encodeURI(JSON.stringify(data)));
                    }
                }
            },
            stripData: function () {
                var hashString, receiveData, buster = this,
                    receiveWindow = buster.receiveWindow;
                if (!receiveWindow || !receiveWindow.isWindow) {
                    return;
                }
                hashString = receiveWindow.element().location.hash.slice(1);
                if (!hashString) {
                    hashString = receiveWindow.parent('iframe').data('buster');
                }
                receiveData = JSON.parse(decodeURI(hashString));
                buster.set(receiveData);
            },
            constructor: function (listen, talk, settings_) {
                var buster = this;
                var settings = settings_ || {};
                // normalize to manager
                var receiveWindow = $(listen).index(0);
                var manager = $(talk).index(0);
                settings.id = settings.id === UNDEFINED ? uuid() : settings.id;
                factories.Model[CONSTRUCTOR].call(buster, settings);
                buster.setGroup();
                if (receiveWindow && receiveWindow.isWindow) {
                    buster.defineWindows(receiveWindow);
                }
                if (manager.isWindow) {
                    buster.defineWindows(NULL, manager);
                    // window tests... because messages are going up
                } else {
                    buster.defineIframe(manager);
                    // iframe tests... because messages are going down
                }
                if (buster.get('strip')) {
                    buster.stripData();
                }
                buster.receiveHistory = factories.Collection();
                buster.set(QUEUED_MESSAGE_INDEX, 0);
                if (buster.iframe) {
                    // oh, are we late?
                    buster.begin(BOOLEAN_TRUE);
                } else {
                    // is an inner buster... let's check to see if anyone is waiting for us
                    buster.begin();
                }
                return buster;
            },
            /**
             * tries to flush the cache. only works if the connected attribute is set to true. If it is, then the post message pipeline begins
             * @returns {buster} returns this;
             * @func
             * @name Buster#flush
             */
            flush: function () {
                var command, children, n, item, gah, childrenLen, queuedMsg, nuData, i = 0,
                    buster = this,
                    dataManager = buster.directive(DATA),
                    currentIdx = dataManager.get(QUEUED_MESSAGE_INDEX),
                    connected = dataManager.get('connected'),
                    initedFrom = dataManager.get('initedFromPartner'),
                    flushing = dataManager.get('flushing');
                if (!initedFrom || connected && ((connected || !currentIdx) && !flushing)) {
                    dataManager.set('flushing', BOOLEAN_TRUE);
                    children = buster.directive(CHILDREN);
                    childrenLen = children[LENGTH]();
                    queuedMsg = children.index(currentIdx);
                    while (queuedMsg && currentIdx < childrenLen) {
                        queuedMsg.directive(DATA).set('runCount', 0);
                        if (currentIdx || connected) {
                            queuedMsg = children.index(currentIdx);
                            currentIdx = (dataManager.get(QUEUED_MESSAGE_INDEX) + 1) || 0;
                            dataManager.set(QUEUED_MESSAGE_INDEX, currentIdx);
                            postMessage(queuedMsg, buster);
                        } else {
                            // initializing
                            childrenLen = UNDEFINED;
                            command = queuedMsg.get('command');
                            if (command === 'connect' || command === 'initialize') {
                                postMessage(queuedMsg, buster);
                            }
                        }
                    }
                    buster.set('flushing', BOOLEAN_FALSE);
                    if (buster.get('connected')) {
                        if (children[LENGTH]() > buster.get(QUEUED_MESSAGE_INDEX)) {
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
                var buster = this,
                    defaultObj = buster.defaultMessage(),
                    message = buster.add(extend({
                        command: command,
                        packet: packet
                    }, defaultObj, extra));
                return message[0];
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
             * creates a default message based on the attributes of the buster
             * @returns {object} blank / default message object
             * @func
             * @name Buster#defaultMessage
             */
            defaultMessage: function () {
                return {
                    from: this.get('id'),
                    postTo: this.get('postTo'),
                    group: this.get('group'),
                    version: this.get('version'),
                    messageId: this.directive(CHILDREN)[LENGTH]()
                };
            },
            /**
             * respond trigger.
             * @arg {object} original data object (same pointer) that was sent over
             * @arg {object} extend object, that will be applied to a base object, that is created by the responseExtend attribute set on the buster object
             * @returns {buster}
             * @func
             * @name Buster#respond
             */
            respond: function (messageId, packet_) {
                var messageData, packet, lastRespondUpdate, newMessage, buster = this,
                    originalMessage = buster.receiveHistory.get(ID, messageId);
                if (!originalMessage) {
                    return buster;
                }
                buster[DISPATCH_EVENT](BEFORE_RESPONDED);
                // if (buster.el && (!data.canThrottle || buster.shouldUpdate(arguments))) {
                // on the inner functions, we don't want to allow this
                // module to be present, so the inner does not influence the outer
                messageData = originalMessage.directive(DATA);
                messageData.set('runCount', (messageData.get('runCount') || 0) + 1);
                packet = extend(BOOLEAN_TRUE, result(buster, 'package') || {}, packet_);
                newMessage = extend(buster.defaultMessage(), {
                    from: originalMessage.get('postTo'),
                    postTo: originalMessage.get('from'),
                    messageId: originalMessage.get('originMessageId'),
                    isResponse: BOOLEAN_TRUE,
                    isDeferred: originalMessage.get('isDeferred'),
                    runCount: originalMessage.get('runCount'),
                    command: originalMessage.get('command'),
                    timeStamp: _.now(),
                    packet: packet,
                    version: originalMessage.get('version')
                });
                // silent sets
                messageData.set('lastResponse', newMessage.timeStamp);
                messageData.set('isDeferred', BOOLEAN_TRUE);
                // loud set
                buster.set('lastResponse', newMessage.timeStamp);
                postMessage(newMessage, buster);
                buster[DISPATCH_EVENT](RESPONDED, packet);
                return buster;
            },
            /**
             * starts a relationship between two busters. simplifies the initialization process.
             * @returns {number} just for responding to the original message in case there's a handler
             * @func
             * @name Buster#begin
             */
            begin: function (late) {
                var buster = this;
                return buster.send(late ? 'initialize' : 'connect').response(function (e) {
                    buster.set('connected', BOOLEAN_TRUE);
                });
            }
        }, BOOLEAN_TRUE);
    if (app.topAccess()) {
        $(win[TOP]).on('message', receive);
    }
});