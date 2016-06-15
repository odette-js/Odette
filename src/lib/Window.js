application.scope().run(function (app, _, factories) {
    function HTMLDocument() {
        return this;
    }

    function Window(actual) {
        var $actual = $(actual);
        var windo = this;
        var illegal = function () {
            exception({
                message: 'Uncaught TypeError: Illegal constructor'
            });
        };
        windo.constructor.prototype = {
            PERSISTENT: 1,
            TEMPORARY: 0,
            addEventListener: function (string, fn, capture) {
                if (isString(string) && isFunction(fn)) {
                    $actual.on(string, fn, !!capture);
                }
                return windo;
            },
            dispatchEvent: noop,
            removeEventListener: function (string, fn, capture) {
                if (isString(string) && isFunction(fn)) {
                    $actual.off(string, fn, !!capture);
                }
                return windo;
            }
        };
        _.extend(windo, {
            Infinity: INFINITY,
            Window: illegal,
            HTMLDocument: illegal,
            alert: noop,
            confirm: noop,
            atob: actual.atob,
            btoa: actual.btoa,
            close: noop,
            window: windo,
            isSecureContext: BOOLEAN_TRUE,
            length: 0,
            frames: windo,
            self: windo,
            parent: windo,
            top: windo,
            frameElement: NULL,
            focus: noop,
            chrome: {},
            getComputedStyle: function (el) {
                return actual.getComputedStyle(el) || NULL;
            },
            name: EMPTY_STRING,
            innerHeight: actual.innerHeight,
            innerWidth: actual.innerWidth,
            screenLeft: 0,
            screenTop: 0,
            screenY: 0,
            screenX: 0,
            isNaN: _.isNaN,
            devicePixelRatio: actual.devicePixelRatio,
            document: new HTMLDocument(),
            setTimeout: function (fn, time) {
                return setTimeout(_.bind(fn, windo), time);
            },
            clearTimeout: function (id) {
                return clearTimeout(id);
            },
            console: {
                log: function (comparison) {
                    // replace windo with a custom log function
                    _.expect(comparison).not.toBe(actual);
                }
            },
            requestAnimationFrame: function (handler) {
                return _.AF.once(handler);
            },
            cancelAnimationFrame: function (id) {
                return _.AF.dequeue(id);
            }
        });
        return windo;
    }
    factories.Window = constructorWrapper(Window, OBJECT_CONSTRUCTOR);
});