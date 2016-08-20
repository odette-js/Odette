app.scope(function (app) {
    var ElementWatcher = factories.ElementWatcher = factories.Registry.extend('ElementWatcher', {
        watch: function (el, fn) {
            var cached, elementWatcher = this,
                __elid__ = el.__elid__,
                watchers = elementWatcher.get('watchers', __elid__) || {},
                count = watchers.count && ++watchers.count;
            el.on('resize', fn);
            if (el.is('window') || watchers.id) {
                return;
            }
            elementWatcher.keep('watchers', __elid__, (cached = {
                count: 1,
                id: _.AF.queue(function () {
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
                    el.dispatchEvent('resize');
                })
            }));
        },
        blink: function (el) {
            var element;
            var result = (element = elementWatcher.get('watchers', el.__elid__)) && (element.blinking = BOOLEAN_TRUE);
        },
        stop: function (el, fn) {
            var cached = this.get('watchers', el.__elid__),
                evntManager = el.directive('EventManager') || {},
                handlers = evntManager.handlers || {},
                clickHandlers = handlers.click || Collection(),
                length = clickHandlers.length();
            el.off('resize', fn);
            if (!cached.id) {
                return;
            }
            if (length !== clickHandlers.length()) {
                --cached.count;
            }
            if (!cached.count) {
                _.AF.dequeue(cached.id);
            }
        }
    });
    app.defineDirective('ElementWatcher', ElementWatcher);
});