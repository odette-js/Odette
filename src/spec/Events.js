application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Events', function () {
        var count, blank, box,
            Model = factories.Model,
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
        _.test.beforeEach(function () {
            count = 0;
            box = Model({
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
        _.test.describe('Models can have events', function () {
            var box2;
            _.test.describe('and can create events for itself', function () {
                _.test.it('either one at a time', function () {
                    box.on('evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(6);
                });
            });
            _.test.describe('and can remove events from itself', function () {
                _.test.it('either one at a time', function () {
                    box.on('evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                    box.off('evnt', handler);
                    _.test.expect(count).toEqual(2);
                    box.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(6);
                    box.off('evnt eventer mikesevent', handler);
                });
            });
        });
        _.test.describe('Models can also listen to other, similar objects', function () {
            var box2;
            _.test.beforeEach(function () {
                box2 = Model();
            });
            _.test.describe('by using the listenTo method', function () {
                _.test.it('either one at a time', function () {
                    box.listenTo(box2, 'evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box2.dispatchEvent('eventer');
                    _.test.expect(count).toEqual(2);
                    box2.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(3);
                });
            });
            _.test.it('you can even take a shortcut and dispatch an event one at a time using dispatchEvent', function () {
                box.on('handle', handler);
                _.test.expect(count).toEqual(0);
                box.dispatchEvent('handle');
                _.test.expect(count).toEqual(1);
            });
            _.test.it('or many at a time using dispatchEvents', function () {
                box.on('handle handler beep boop blob', handler);
                _.test.expect(count).toEqual(0);
                box.dispatchEvents('handle handler beep boop blob');
                _.test.expect(count).toEqual(5);
            });
            _.test.describe('and can stop listening by using the stopListening method', function () {
                _.test.it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                    box.stopListening(box2, 'evnt', handler);
                    _.test.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    _.test.expect(count).toEqual(1);
                });
                _.test.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    box.listenTo(box2, 'evnt eventer mikesevent', function () {
                        count += this === box;
                    });
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(6);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    _.test.expect(count).toEqual(6);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    _.test.expect(count).toEqual(9);
                });
            });
            _.test.describe('listenTo', function () {
                _.test.it('should have an equivalent context', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += (this === box);
                    });
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    _.test.expect(count).toEqual(2);
                });
                _.test.it('can be overridden with an extra argument', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += this === box2;
                    }, box2);
                    _.test.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    _.test.expect(count).toEqual(2);
                });
            });
            _.test.describe('watch directive', function () {
                _.test.it('can listenTo the object that it belongs to', function () {
                    box.watch('here', 'there', function () {
                        count++;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('here', 1);
                    _.test.expect(count).toEqual(0);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(1);
                    box.set('here', 'where');
                    _.test.expect(count).toEqual(1);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(2);
                });
            });
            _.test.describe('when directive', function () {
                _.test.it('gives an api synonymous with english', function () {
                    box.when('here').is('there').and('when').is('now').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('here', 'nothere');
                    _.test.expect(count).toEqual(-1);
                    box.set('when', 'later');
                    _.test.expect(count).toEqual(-1);
                    box.set('when', 'now');
                    _.test.expect(count).toEqual(-1);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('allows for negatives to be used like isNot and isnt', function () {
                    box.when('one').isNot(2).and('up').isnt('down').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('up', 'down');
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 2);
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 1);
                    _.test.expect(count).toEqual(-1);
                    box.set('up', 'side');
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can compare numbers using basic operators and negation', function () {
                    box.when('one').isGreaterThan(5).and('ten').isLessThan(4).and('phone').isNotLessThan(5).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('phone', 10);
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 6);
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 5);
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 2);
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can compare string values using basic operators and negation', function () {
                    box.when('one').isGreaterThan('a').and('ten').isLessThan('b').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('one', '0');
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 'beach');
                    _.test.expect(count).toEqual(-1);
                    box.set('ten', 'aardvark');
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 'ten');
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can also handle custom functions', function () {
                    box.when('one').is(function () {
                        return box.get('one') > 5;
                    }).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('one', 10);
                    _.test.expect(count).toEqual(1);
                    box.set('one', 3);
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can also make "groups" using the or method', function () {
                    var sequence = box.when('one').is(1).or('truth').is(true).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    _.test.expect(count).toEqual(0);
                    box.set('one', 2);
                    _.test.expect(count).toEqual(-1);
                    box.set('one', 0);
                    _.test.expect(count).toEqual(-1);
                    box.set('truth', true);
                    _.test.expect(count).toEqual(0);
                    box.set('one', 1);
                    _.test.expect(count).toEqual(0);
                    box.set('truth', false);
                    _.test.expect(count).toEqual(0);
                });
                _.test.it('can also have multiple watchers on a particular instance that run independently', function () {
                    var last;
                    var sequence = box.when('five').isLessThan(10).then(function () {
                        count++;
                        last = 1;
                    });
                    var sequence2 = box.when('here').is('there').then(function () {
                        count++;
                        last = 2;
                    });
                    _.test.expect(count).toEqual(0);
                    _.test.expect(last).toEqual(void 0);
                    box.set('five', 3);
                    _.test.expect(count).toEqual(1);
                    _.test.expect(last).toEqual(1);
                    box.set('here', 'there');
                    _.test.expect(count).toEqual(2);
                    _.test.expect(last).toEqual(2);
                });
            });
        });
    });
    // var box = factories.Model();
    // var collection = [];
    // var collection2 = [];
    // _.count(collection, function (item, index, list) {
    //     list.push(0);
    // }, null, 0, 100000);
    // var timestamp = _.now();
    // _.duff(collection, function (item) {
    //     collection2.push(factories.Model());
    // });
    // var div = document.createElement('div');
    // div.innerHTML = _.now() - timestamp;
    // console.log(collection2);
    // document.body.insertBefore(div, document.body.children[0]);
});