application.scope().run(function (app, _, factories, $) {
    describe('Events', function () {
        var blank, box,
            Box = factories.Box,
            handler = function () {
                return !0;
            },
            handler2 = function () {
                return !1;
            },
            data = {
                some: 'thing',
                children: [{
                    here: 'we',
                    go: 'pause'
                }, {
                    one: 'more',
                    time: 'pause'
                }]
            };
        beforeEach(function () {
            box = Box({
                zero: 0,
                one: 1,
                two: 2,
                three: 3,
                four: 4,
                five: 5,
                six: 6,
                seven: 7,
                eight: 8,
                nine: 9
            });
        });
        describe('Boxes can have events', function () {
            var box2;
            describe('and can create events for itself', function () {
                it('either one at a time', function () {
                    box.on('evnt', handler);
                    expect(box._events.evnt[0].handler()).toEqual(true);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(box._events.evnt[0].handler() && box._events.eventer[0].handler() && box._events.mikesevent[0].handler()).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     box.on('evnt eventer mikesevent', [handler, handler2]);
                //     expect(box._events.evnt[0].handler === handler && box._events.evnt[1].handler === handler2).toEqual(true);
                // });
            });
            describe('and can remove events from itself', function () {
                it('either one at a time', function () {
                    box.on('evnt', handler);
                    expect(box._events.evnt[0].handler()).toEqual(true);
                    box.off('evnt', handler);
                    expect(box._events.evnt[0]).toEqual(void 0);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(box._events.evnt[0].handler === handler && box._events.eventer[0].handler === handler && box._events.mikesevent[0].handler === handler).toEqual(true);
                    box.off('evnt eventer mikesevent', handler);
                    expect(box._events.evnt[0] === void 0 && box._events.eventer[0] === void 0 && box._events.mikesevent[0] === void 0).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     box.on('evnt eventer mikesevent', [handler, handler2]);
                //     expect(box._events.evnt[0].handler === handler && box._events.eventer[0].handler === handler && box._events.mikesevent[0].handler === handler && box._events.evnt[1].handler === handler2 && box._events.eventer[1].handler === handler2 && box._events.mikesevent[1].handler === handler2).toEqual(true);
                //     box.off('evnt eventer mikesevent', [handler, handler2]);
                //     expect(box._events.evnt[0] === void 0 && box._events.eventer[0] === void 0 && box._events.mikesevent[0] === void 0).toEqual(true);
                // });
            });
        });
        describe('Boxes can also listen to other, similar objects', function () {
            var box2;
            beforeEach(function () {
                box2 = Box();
            });
            describe('by using the listenTo method', function () {
                it('either one at a time', function () {
                    box.listenTo(box2, 'evnt', handler);
                    expect(box2._events.evnt[0].handler === handler).toEqual(true);
                });
                it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    expect(box2._events.evnt[0].handler === handler && box2._events.eventer[0].handler === handler && box2._events.mikesevent[0].handler === handler).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     var listenObj;
                //     box.listenTo(box2, 'evnt eventer mikesevent', [handler, handler2]);
                //     expect(handler === box2._events.evnt[0].handler && handler === box2._events.eventer[0].handler && handler === box2._events.mikesevent[0].handler && handler2 === box2._events.evnt[1].handler && handler2 === box2._events.eventer[1].handler && handler2 === box2._events.mikesevent[1].handler).toEqual(true);
                //     _.each(box._listeningTo, function (idx, listen) {
                //         listenObj = listen;
                //     });
                //     expect(handler === listenObj.obj._events.evnt[0].handler && handler === listenObj.obj._events.eventer[0].handler && handler === listenObj.obj._events.mikesevent[0].handler && handler2 === listenObj.obj._events.evnt[1].handler && handler2 === listenObj.obj._events.eventer[1].handler && handler2 === listenObj.obj._events.mikesevent[1].handler).toEqual(true);
                // });
            });
            describe('you can even take a shortcut and dispatch an event one at a time', function () {
                it('using dispatch event', function () {
                    var handle = 0,
                        handler = function () {
                            handle++;
                        };
                    box.on('handle', handler);
                    box.dispatchEvent('handle');
                    expect(handle).toEqual(1);
                });
            });
            describe('and can stop listening by using the stopListening method', function () {
                it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    expect(box2._events.evnt[0].handler === handler).toEqual(true);
                    box.stopListening(box2, 'evnt', handler);
                    _.each(box._listeningTo, function (idx, listen) {
                        listenObj = listen;
                    });
                    expect(box2._events.evnt[0] === void 0 && listenObj === void 0).toEqual(true);
                });
                it('or many at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    expect(box2._events.evnt[0].handler === handler && box2._events.eventer[0].handler === handler && box2._events.mikesevent[0].handler === handler).toEqual(true);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    _.each(box._listeningTo, function (idx, listen) {
                        listenObj = listen;
                    });
                    expect(box2._events.evnt[0] === void 0 && box2._events.eventer[0] === void 0 && box2._events.mikesevent[0] === void 0).toEqual(true);
                });
                // it('or many against a list of functions', function () {
                //     var listenObj;
                //     box.listenTo(box2, 'evnt eventer mikesevent', [handler, handler2]);
                //     _.each(box._listeningTo, function (idx, listen) {
                //         listenObj = listen;
                //     });
                //     expect(box2._events.evnt[0].handler === handler && box2._events.eventer[0].handler === handler && box2._events.mikesevent[0].handler === handler && box2._events.evnt[1].handler === handler2 && box2._events.eventer[1].handler === handler2 && box2._events.mikesevent[1].handler === handler2 && listenObj.obj._events.evnt[0].handler === handler && listenObj.obj._events.eventer[0].handler === handler && listenObj.obj._events.mikesevent[0].handler === handler && listenObj.obj._events.evnt[1].handler === handler2 && listenObj.obj._events.eventer[1].handler === handler2 && listenObj.obj._events.mikesevent[1].handler === handler2).toEqual(true);
                //     box.stopListening(box2, 'evnt eventer mikesevent', [handler, handler2]);
                //     expect(box2._events.evnt[0] === void 0 && box2._events.eventer[0] === void 0 && box2._events.mikesevent[0] === void 0 && box2._events.evnt[1] === void 0 && box2._events.eventer[1] === void 0 && box2._events.mikesevent[1] === void 0 && listenObj.obj._events.evnt[0] === void 0 && listenObj.obj._events.eventer[0] === void 0 && listenObj.obj._events.mikesevent[0] === void 0 && listenObj.obj._events.evnt[1] === void 0 && listenObj.obj._events.eventer[1] === void 0 && listenObj.obj._events.mikesevent[1] === void 0).toEqual(true);
                // });
            });
        });
    });
});