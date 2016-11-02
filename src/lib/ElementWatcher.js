var ELEMENT_WATCHER = 'ElementWatcher';
var WATCHERS = 'watchers';
var RESIZE = 'resize';
var AF = _.AF;
factories[ELEMENT_WATCHER] = app.defineDirective(ELEMENT_WATCHER, app.block(function (app) {
    var counter = 0;
    return factories.Registry.extend(ELEMENT_WATCHER, {
        namespace: function () {
            return this.get(WATCHERS, 'namespace', function () {
                return 'watcher-' + (++counter);
            });
        },
        watch: function (el, fn) {
            var cached, elementWatcher = this,
                __elid__ = el[__ELID__],
                watchers = elementWatcher.get(WATCHERS, __elid__) || {},
                count = watchers.count && ++watchers.count;
            el.on(RESIZE, elementWatcher.namespace(), fn);
            if (el.is('window') || watchers.id) {
                return elementWatcher;
            }
            elementWatcher.keep(WATCHERS, __elid__, (cached = {
                count: 1,
                id: AF.queue(function () {
                    var client = el.client();
                    if (client.height === cached.height && client.width === cached.width) {
                        return;
                    }
                    cached.height = client.height;
                    cached.width = client.width;
                    if (cached.blinking) {
                        cached.blinking = BOOLEAN_FALSE;
                        return;
                    }
                    el.dispatchEvent(RESIZE);
                })
            }));
            return elementWatcher;
        },
        blink: function (el) {
            var element, elementWatcher = this;
            var result = (element = elementWatcher.get(WATCHERS, el[__ELID__])) && (element.blinking = BOOLEAN_TRUE);
            return elementWatcher;
        },
        stop: function (el, fn) {
            var elementWatcher = this,
                cached = elementWatcher.get(WATCHERS, el[__ELID__]),
                evntManager = el.directive(EVENT_MANAGER) || {},
                handlers = evntManager.handlers || {},
                resizeHandlers = handlers.resize || Collection(),
                length = resizeHandlers.length();
            el.off(RESIZE, elementWatcher.namespace());
            if (length !== resizeHandlers.length()) {
                --cached.count;
            }
            if (cached.id && !cached.count) {
                AF.dequeue(cached.id);
            }
            return elementWatcher;
        }
    });
}));