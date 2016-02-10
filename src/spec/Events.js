application.scope().run(function (app, _, factories, $) {
    describe('Events', function () {
        var blank, box,
            Box = factories.Box,
            handler = function () {
                count++;
            },
            handler2 = function () {
                count--;
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
            count = 0;
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
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(6);
                });
            });
            describe('and can remove events from itself', function () {
                it('either one at a time', function () {
                    box.on('evnt', handler);
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                    box.off('evnt', handler);
                    expect(count).toEqual(2);
                    box.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                });
                it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    expect(count).toEqual(6);
                    box.off('evnt eventer mikesevent', handler);
                });
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
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(2);
                });
                it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box2.dispatchEvent('eventer');
                    expect(count).toEqual(2);
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                });
            });
            it('you can even take a shortcut and dispatch an event one at a time using dispatchEvent', function () {
                box.on('handle', handler);
                expect(count).toEqual(0);
                box.dispatchEvent('handle');
                expect(count).toEqual(1);
            });
            it('or many at a time using dispatchEvents', function () {
                box.on('handle handler beep boop blob', handler);
                expect(count).toEqual(0);
                box.dispatchEvents('handle handler beep boop blob');
                expect(count).toEqual(5);
            });
            describe('and can stop listening by using the stopListening method', function () {
                it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                    box.stopListening(box2, 'evnt', handler);
                    expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    expect(count).toEqual(1);
                });
                it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    expect(count).toEqual(3);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(3);
                });
            });
        });
    });
    var box = factories.Box();
    var collection = [];
    _.count(collection, function (item, index, list) {
        list.push({});
    }, null, 0, 100000);
    var timestamp = _.now();
    _.duff(collection, function (item) {
        box.dispatchEvent('test');
    });
    var div = document.createElement('div');
    div.innerHTML = _.now() - timestamp;
    document.body.insertBefore(div, document.body.children[0]);
});