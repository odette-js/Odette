factories.Window = constructorWrapper(function (actual) {
    var $actual = $(actual);

    function HTMLDocument() {
        return this;
    }
    Window[PROTOTYPE] = {
        PERSISTENT: 1,
        TEMPORARY: 0,
        addEventListener: function (string, fn, capture) {
            if (isString(string) && isFunction(fn)) {
                $actual.on(string, fn, !!capture);
            }
            return windo;
        },
        dispatchEvent: function (key, data) {
            return $actual.dispatchEvent(key, data, {
                isTrusted: BOOLEAN_FALSE
            });
        },
        removeEventListener: function (string, fn, capture) {
            if (isString(string) && isFunction(fn)) {
                $actual.off(string, fn, !!capture);
            }
            return windo;
        }
    };

    function Window() {
        var windo = this;
        var illegal = function () {
            exception({
                message: 'Uncaught TypeError: Illegal constructor'
            });
        };
        var Function_constructor = illegal;
        Function_constructor.constructor = Function_constructor;
        var document = new HTMLDocument();
        windo.length = 0;
        extend(windo, {
            Object: OBJECT_CONSTRUCTOR,
            Array: ARRAY_CONSTRUCTOR,
            Function: Function_constructor,
            Number: NUMBER_CONSTRUCTOR,
            String: STRING_CONSTRUCTOR,
            Infinity: INFINITY,
            Window: illegal,
            HTMLDocument: illegal,
            open: noop,
            alert: noop,
            confirm: noop,
            prompt: noop,
            print: noop,
            statusbar: actual.statusbar,
            atob: actual.atob,
            btoa: actual.btoa,
            close: noop,
            window: windo,
            isSecureContext: BOOLEAN_TRUE,
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
            postMessage: function (msg, origin) {
                $actual.emit(msg, origin, function () {});
            },
            performance: performance,
            opener: NULL,
            JSON: JSON,
            Math: Math,
            status: '',
            screen: actual.screen,
            name: EMPTY_STRING,
            innerHeight: actual.innerHeight,
            innerWidth: actual.innerWidth,
            screenLeft: 0,
            screenTop: 0,
            screenY: 0,
            screenX: 0,
            NaN: NaN,
            isNaN: isNaN,
            devicePixelRatio: actual.devicePixelRatio,
            document: document,
            setTimeout: function (fn, time) {
                return setTimeout(bind(fn, windo), time);
            },
            clearTimeout: function (id) {
                return clearTimeout(id);
            },
            console: extend({}, console),
            requestAnimationFrame: function (handler) {
                return AF.once(handler);
            },
            cancelAnimationFrame: function (id) {
                return AF.dequeue(id);
            }
        });
        _.each(windo, function (value, key) {
            Object.defineProperty(windo, key, {
                value: value
            });
        });
        return windo;
    }
    return new Window();
}, OBJECT_CONSTRUCTOR);