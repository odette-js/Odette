application.scope(function (app) {
    app.module('Socket', function (module, app, _, factories) {
        var list = _.gapSplit('open message error close'),
            CONSTRUCTOR = 'constructor',
            EMPTY_STRING = '',
            ID = 'id',
            delegate = function (socket) {
                _.duff(list, function (evnt) {
                    socket.pipe.addEventListener(evnt, socket.handlers[evnt]);
                });
            },
            undelegate = function (socket) {
                _.duff(list, function (evnt) {
                    socket.pipe.removeEventListener(evnt, socket.handlers[evnt]);
                });
            },
            handlers = {
                open: function () {
                    this.isConnected = true;
                    return this.dispatchEvent('connect');
                },
                message: function (evnt) {
                    var promise, data = _.parse(evnt.data);
                    if (data.type === 'success') {
                        promise = this.promises.get(ID, data.packet);
                        return promise && promise.resolve();
                    } else {
                        if (data.type === 'failure') {
                            promise = this.promises.get(ID, data.packet);
                            return promise && promise.reject();
                        } else {
                            if (data.command) {
                                return this.dispatchEvent(data.command, data.packet);
                            }
                        }
                    }
                },
                close: function () {
                    this.isConnected = false;
                    return this.dispatchEvent('disconnect');
                },
                error: function (evnt) {
                    this.promises.eachCall('reject');
                    return this.dispatchEvent(evnt.data.type, evnt.data.packet);
                }
            },
            SocketConstructor = (window.MozWebSocket || window.WebSocket),
            messageId = 0,
            Socket = _.Socket = factories.Model.extend('Socket', {
                constructor: function (options) {
                    var socket = this;
                    socket.handlers = _.foldl(list, function (memo, item) {
                        memo[item] = _.bind(handlers[item], socket);
                        return memo;
                    }, {});
                    if (_.isString(options)) {
                        options = {
                            path: options
                        };
                    }
                    factories.Model[CONSTRUCTOR].call(socket, options);
                    socket.promises = factories.Collection();
                    if (socket.get('autoConnect')) {
                        socket.connect();
                    }
                    return socket;
                },
                connect: function (path_) {
                    var url, socket = this,
                        path = path_ || socket.get('path'),
                        formerConnect = socket.connectPromise,
                        promise = socket.connectPromise = _.Promise();
                    if (path && !socket.isConnected) {
                        promise.listenTo(socket, 'connect', promise.resolve);
                        url = _.parseUrl(path).toString().replace('http', 'ws');
                        socket.pipe = socket.pipe || new SocketConstructor(url);
                        delegate(socket);
                    }
                    if (formerConnect) {
                        formerConnect.reject();
                    }
                    return promise;
                },
                disconnect: function () {
                    var socket = this;
                    if (socket.pipe && socket.isConnected) {
                        socket.pipe.close();
                        socket.isConnected = false;
                        undelegate(socket);
                        delete socket.pipe;
                    }
                    if (socket.connectPromise) {
                        socket.connectPromise.reject();
                    }
                    return socket;
                },
                emit: function (command, data_, type_) {
                    var socket = this,
                        data = data_ || {},
                        promise = _.Promise();
                    if (!socket.isConnected) {
                        return promise;
                    }
                    var messageID = (messageId++) + EMPTY_STRING;
                    socket.promises.push(promise);
                    socket.promises.register(ID, messageID, promise);
                    socket.pipe.send(_.stringify({
                        type: type_ || 'message',
                        command: command,
                        data: data,
                        id: messageID
                    }));
                    return promise;
                },
                received: function (data) {
                    return this.isConnected ? this.emit(NULL, data, 'received') : _.Promise();
                }
            });
    });
});