app.module('Socket', function (module, app, _, factories) {
    var list = _.toArray('open,message,error,close');
    var delegate = function (socket) {
        duff(list, function (evnt) {
            socket.pipe.addEventListener(evnt, socket.handlers[evnt]);
        });
    };
    var undelegate = function (socket) {
        duff(list, function (evnt) {
            socket.pipe.removeEventListener(evnt, socket.handlers[evnt]);
        });
    };
    var basicdispatch = function (evnt) {
        return socket.dispatchEvent(evnt.type, evnt.data);
    };
    var Socket = _.Socket = factories.Model.extend({
        constructor: function (options) {
            var socket = this;
            var cachedHandlers = socket.handlers = _.foldl(list, function (memo, item) {
                memo[item] = _.bind(basicdispatch, socket);
                return memo;
            }, {});
            if (isString(options)) {
                options = {
                    path: options
                };
            }
            factories.Model[CONSTRUCTOR].call(socket, options);
            socket.pipe = new WebSocket(socket.get('path'));
            delegate(socket);
            return socket;
        }
    });
});