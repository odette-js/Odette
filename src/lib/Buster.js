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
        RECEIVED_REFERRER = 'receiveReferrer',
        EMIT_REFERRER = 'emitReferrer',
        BUSTER = 'buster',
        pI = _.pI,
        busterGroupHash = {},
        receive = function (evt) {
            var buster, data = parse(evt.data),
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
            var originalMessage, runCount = data.runCount,
                children = buster.children;
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
            return buster.emitWindow.emit(message, buster.get(EMIT_REFERRER), receive);
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
            },
            deferred: function (handler) {
                var message = this,
                    latestResponse = message.get('latestResponse');
                message.on('deferred', handler);
                if (latestResponse && latestResponse.isDeferred) {
                    handler.call(message, message.createEvent('deferred', latestResponse.packet));
                }
                return message;
            },
            send: function () {
                return this[PARENT].flush();
            }
        }),
        receiveWindowEvents = {
            message: receive
        },
        wipe = function (buster) {
            find(busterGroupHash, function (groupHash) {
                return find(groupHash, function (previousbuster, key, groupHash) {
                    return buster === previousbuster && delete groupHash[key];
                });
            });
        },
        disconnected = function () {
            var buster = this;
            if (buster.connectPromise) {
                buster.connectPromise.reject();
            }
            buster.set('connected', BOOLEAN_FALSE);
            buster.connectPromise = _.Promise();
        },
        connected = function (buster, message) {
            buster.connectPromise.resolve(message);
            buster.set('connected', BOOLEAN_TRUE);
        },
        connectReceived = function (e) {
            // first submit a response so the other side can flush
            var buster = this,
                dataDirective = buster.directive(DATA);
            if (dataDirective.get('isLate')) {
                dataDirective.set(QUEUED_MESSAGE_INDEX, 1);
            }
            buster.respond((e.message || e.origin).id);
            buster.set('connected', BOOLEAN_TRUE);
        },
        Buster = factories.Buster = factories.Model.extend('Buster', {
            Child: Message,
            bounce: function (e) {
                return this.respond(e.message.id);
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
                var message, buster = this,
                    receiveHistory = buster.receiveHistory;
                data.originMessageId = data.messageId;
                data.messageId = receiveHistory.length();
                data.isDeferred = BOOLEAN_FALSE;
                message = new Message(data);
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
                    friendly: BOOLEAN_FALSE,
                    documentReady: BOOLEAN_FALSE
                };
            },
            defineWindows: function (receiveWindow, emitWindow) {
                var buster = this,
                    busterData = buster.directive(DATA);
                if (receiveWindow && receiveWindow.isWindow) {
                    if (buster.receiveWindow) {
                        buster.receiveWindow.off(receiveWindowEvents);
                    }
                    buster.receiveWindow = receiveWindow.on(receiveWindowEvents);
                    buster.receiveWindow.owner.$(function () {
                        buster.set('documentReady', BOOLEAN_TRUE);
                    });
                }
                if (emitWindow && emitWindow.isWindow) {
                    buster.emitWindow = emitWindow;
                    busterData.set('postTo', busterData.get('postTo') || buster.emitWindow.address);
                }
            },
            defineIframe: function (iframe) {
                var busterData, emitReferrer, receiveReferrer, iframeSrc, referrer, receiveWindow, data, href, windo, buster = this;
                if (!iframe || !iframe.isIframe) {
                    return;
                }
                buster.iframe = iframe;
                if (iframe.isAttached && (windo = iframe.window())) {
                    buster.defineWindows(NULL, windo);
                }
                if (iframe) {
                    buster.setupIframe();
                }
            },
            setupIframe: function () {
                var emitReferrer, buster = this,
                    iframe = buster.iframe,
                    busterData = buster.directive(DATA),
                    receiveReferrer = parseUrl(busterData.get(RECEIVED_REFERRER) || (receiveReferrer = buster.receiveWindow.element().location.href)).origin,
                    iframeSrc = busterData.get('iframeSrc'),
                    iframeContent = busterData.get('iframeContent'),
                    // this is going to the
                    data = {
                        postTo: buster.id,
                        useTop: false,
                        // post to me
                        useParent: true,
                        emitReferrer: receiveReferrer,
                        id: busterData.get('postTo'),
                        group: busterData.get('group')
                    };
                busterData.set(RECEIVED_REFERRER, receiveReferrer);
                if (iframeSrc) {
                    emitReferrer = busterData.set(EMIT_REFERRER, reference(iframeSrc));
                    data.receiveReferrer = emitReferrer;
                }
                if (iframeSrc) {
                    iframe.src(stringifyQuery({
                        url: iframeSrc,
                        hash: data
                    }));
                }
                if (iframeContent) {
                    iframe.data(BUSTER, encodeURI(stringify(data)));
                    iframe.html(iframeContent);
                    buster.begin('initialize');
                }
            },
            stripData: function () {
                var hashString, buster = this,
                    receiveWindow = buster.receiveWindow;
                if (!receiveWindow || !receiveWindow.isWindow) {
                    return;
                }
                hashString = receiveWindow.element().location.hash.slice(1);
                buster.set(JSON.parse(decodeURI(hashString || wraptry(function () {
                    return receiveWindow.parent('iframe').data(BUSTER);
                }))));
            },
            constructor: function (listen, talk, settings_, events) {
                var buster = this;
                var settings = settings_ || {};
                // normalize to manager
                var receiveWindow = $(listen).index(0);
                var manager = $(talk).index(0);
                settings.id = settings.id === UNDEFINED ? uuid() : settings.id;
                buster.receiveHistory = factories.Collection();
                disconnected.call(buster);
                factories.Model[CONSTRUCTOR].call(buster, settings);
                buster.once('change:connected', function (e) {
                    buster.connectPromise.resolve(buster.children.first());
                });
                buster.on({
                    'change:connected change:documentReady': 'flush',
                    'received:update': 'bounce',
                    'received:unload': 'destroy',
                    destroy: disconnected,
                    'received:initialize received:connect': connectReceived,
                    'change:group change:id': 'setGroup'
                });
                buster.on(events);
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
                buster.set(QUEUED_MESSAGE_INDEX, 0);
                if (buster.iframe) {
                    // oh, are we late?
                    if (buster.get('isLate')) {
                        buster.begin('initialize');
                    }
                } else {
                    // is an inner buster... let's check to see if anyone is waiting for us
                    buster.begin('connect');
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
                if (!dataManager.get('documentReady')) {
                    return buster;
                }
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
            create: function (command, packet, extra) {
                var buster = this,
                    message = buster.add(extend({
                        command: command,
                        packet: packet
                    }, buster.defaultMessage(), extra));
                return message[0];
            },
            /**
             * shorthand for creating a function that gets called after the buster's partner has responded
             * @func
             * @name Buster#sync
             */
            sync: function (fn) {
                return this.create('update').response(fn).send();
            },
            /**
             * creates a default message based on the attributes of the buster
             * @returns {object} blank / default message object
             * @func
             * @name Buster#defaultMessage
             */
            defaultMessage: function () {
                var buster = this;
                return {
                    from: buster.get('id'),
                    postTo: buster.get('postTo'),
                    group: buster.get('group'),
                    version: buster.get('version'),
                    messageId: buster.directive(CHILDREN)[LENGTH]()
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
            begin: function (command) {
                var buster = this,
                    children = buster.directive(CHILDREN);
                return children.index(0) || buster.create(command).response(function (e) {
                    connectReceived.call(buster, e);
                }).send();
            }
        }, BOOLEAN_TRUE);
    if (app.topAccess()) {
        $(win[TOP]).on('message', receive);
    }
});