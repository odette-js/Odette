application.scope().run(function (app, _, factories) {
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
                    box.listenTo(box2, 'evnt eventer mikesevent', function () {
                        count += this === box;
                    });
                    expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(6);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    expect(count).toEqual(6);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    expect(count).toEqual(9);
                });
            });
            describe('listenTo', function () {
                it('should have an equivalent context', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += (this === box);
                    });
                    expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    expect(count).toEqual(2);
                });
                it('can be overridden with an extra argument', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += this === box2;
                    }, box2);
                    expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    expect(count).toEqual(2);
                });
            });
            describe('watch directive', function () {
                it('can listenTo the object that it belongs to', function () {
                    box.watch('here', 'there', function () {
                        count++;
                    });
                    expect(count).toEqual(0);
                    box.set('here', 1);
                    expect(count).toEqual(0);
                    box.set('here', 'there');
                    expect(count).toEqual(1);
                    box.set('here', 'where');
                    expect(count).toEqual(1);
                    box.set('here', 'there');
                    expect(count).toEqual(2);
                });
            });
            describe('when directive', function () {
                it('gives an api synonymous with english', function () {
                    box.when('here').is('there').and('when').is('now').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('here', 'nothere');
                    expect(count).toEqual(-1);
                    box.set('when', 'later');
                    expect(count).toEqual(-1);
                    box.set('when', 'now');
                    expect(count).toEqual(-1);
                    box.set('here', 'there');
                    expect(count).toEqual(0);
                });
                it('allows for negatives to be used like isNot and isnt', function () {
                    box.when('one').isNot(2).and('up').isnt('down').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('up', 'down');
                    expect(count).toEqual(-1);
                    box.set('one', 2);
                    expect(count).toEqual(-1);
                    box.set('one', 1);
                    expect(count).toEqual(-1);
                    box.set('up', 'side');
                    expect(count).toEqual(0);
                });
                it('can compare numbers using basic operators and negation', function () {
                    box.when('one').isGreaterThan(5).and('ten').isLessThan(4).and('phone').isNotLessThan(5).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('phone', 10);
                    expect(count).toEqual(-1);
                    box.set('one', 6);
                    expect(count).toEqual(-1);
                    box.set('ten', 5);
                    expect(count).toEqual(-1);
                    box.set('ten', 2);
                    expect(count).toEqual(0);
                });
                it('can compare string values using basic operators and negation', function () {
                    box.when('one').isGreaterThan('a').and('ten').isLessThan('b').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('one', '0');
                    expect(count).toEqual(-1);
                    box.set('ten', 'beach');
                    expect(count).toEqual(-1);
                    box.set('ten', 'aardvark');
                    expect(count).toEqual(-1);
                    box.set('one', 'ten');
                    expect(count).toEqual(0);
                });
                it('can also handle custom functions', function () {
                    box.when('one').is(function () {
                        return box.get('one') > 5;
                    }).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('one', 10);
                    expect(count).toEqual(1);
                    box.set('one', 3);
                    expect(count).toEqual(0);
                });
                it('can also make "groups" using the or method', function () {
                    var sequence = box.when('one').is(1).or('truth').is(true).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    expect(count).toEqual(0);
                    box.set('one', 2);
                    expect(count).toEqual(-1);
                    box.set('one', 0);
                    expect(count).toEqual(-1);
                    box.set('truth', true);
                    expect(count).toEqual(0);
                    box.set('one', 1);
                    expect(count).toEqual(0);
                    box.set('truth', false);
                    expect(count).toEqual(0);
                });
                it('can also have multiple watchers on a particular instance that run independently', function () {
                    var last;
                    var sequence = box.when('five').isLessThan(10).then(function () {
                        count++;
                        last = 1;
                    });
                    var sequence2 = box.when('here').is('there').then(function () {
                        count++;
                        last = 2;
                    });
                    expect(count).toEqual(0);
                    expect(last).toEqual(void 0);
                    box.set('five', 3);
                    expect(count).toEqual(1);
                    expect(last).toEqual(1);
                    box.set('here', 'there');
                    expect(count).toEqual(2);
                    expect(last).toEqual(2);
                });
            });
        });
    });
    // var box = factories.Box();
    // var collection = [];
    // var collection2 = [];
    // _.count(collection, function (item, index, list) {
    //     list.push(0);
    // }, null, 0, 100000);
    // var timestamp = _.now();
    // _.duff(collection, function (item) {
    //     collection2.push(factories.Box());
    // });
    // var div = document.createElement('div');
    // div.innerHTML = _.now() - timestamp;
    // console.log(collection2);
    // document.body.insertBefore(div, document.body.children[0]);
});