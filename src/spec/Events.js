application.scope().run(window, function (module, app, _, factories, documentView, scopedFactories, $) {
    test.describe('Events', function () {
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
        test.beforeEach(function () {
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
        test.describe('Models can have events', function () {
            var box2;
            test.describe('and can create events for itself', function () {
                test.it('either one at a time', function () {
                    box.on('evnt', handler);
                    test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    test.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    test.expect(count).toEqual(2);
                }, 3);
                test.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    test.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    test.expect(count).toEqual(6);
                }, 3);
            });
            test.describe('and can remove events from itself', function () {
                test.it('either one at a time', function () {
                    box.on('evnt', handler);
                    test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    test.expect(count).toEqual(1);
                    box.dispatchEvent('evnt');
                    test.expect(count).toEqual(2);
                    box.off('evnt', handler);
                    test.expect(count).toEqual(2);
                    box.dispatchEvent('evnt');
                    test.expect(count).toEqual(2);
                }, 5);
                test.it('or many at a time', function () {
                    box.on('evnt eventer mikesevent', handler);
                    test.expect(count).toEqual(0);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    test.expect(count).toEqual(3);
                    box.dispatchEvent('evnt');
                    box.dispatchEvent('eventer');
                    box.dispatchEvent('mikesevent');
                    test.expect(count).toEqual(6);
                    box.off('evnt eventer mikesevent', handler);
                }, 3);
            });
        });
        test.describe('Models can also listen to other, similar objects', function () {
            var box2;
            test.beforeEach(function () {
                box2 = Model();
            });
            test.describe('by using the listenTo method', function () {
                test.it('either one at a time', function () {
                    box.listenTo(box2, 'evnt', handler);
                    test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    test.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    test.expect(count).toEqual(2);
                }, 3);
                test.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    test.expect(count).toEqual(1);
                    box2.dispatchEvent('eventer');
                    test.expect(count).toEqual(2);
                    box2.dispatchEvent('mikesevent');
                    test.expect(count).toEqual(3);
                }, 4);
            });
            test.it('you can even take a shortcut and dispatch an event one at a time using dispatchEvent', function () {
                box.on('handle', handler);
                test.expect(count).toEqual(0);
                box.dispatchEvent('handle');
                test.expect(count).toEqual(1);
            }, 2);
            test.it('or many at a time using dispatchEvents', function () {
                box.on('handle handler beep boop blob', handler);
                test.expect(count).toEqual(0);
                box.dispatchEvents('handle handler beep boop blob');
                test.expect(count).toEqual(5);
            }, 2);
            test.describe('and can stop listening by using the stopListening method', function () {
                test.it('can remove events one at a time', function () {
                    var listenObj;
                    box.listenTo(box2, 'evnt', handler);
                    test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    test.expect(count).toEqual(1);
                    box.stopListening(box2, 'evnt', handler);
                    test.expect(count).toEqual(1);
                    box2.dispatchEvent('evnt');
                    test.expect(count).toEqual(1);
                }, 4);
                test.it('or many at a time', function () {
                    box.listenTo(box2, 'evnt eventer mikesevent', handler);
                    box.listenTo(box2, 'evnt eventer mikesevent', function () {
                        count += this === box;
                    });
                    test.expect(count).toEqual(0);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    test.expect(count).toEqual(6);
                    box.stopListening(box2, 'evnt eventer mikesevent', handler);
                    test.expect(count).toEqual(6);
                    box2.dispatchEvent('evnt');
                    box2.dispatchEvent('eventer');
                    box2.dispatchEvent('mikesevent');
                    test.expect(count).toEqual(9);
                }, 4);
            });
            test.describe('listenTo', function () {
                test.it('should have an equivalent context', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += (this === box);
                    });
                    test.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    test.expect(count).toEqual(2);
                }, 2);
                test.it('can be overridden with an extra argument', function () {
                    box.listenTo(box2, 'e1', function () {
                        count++;
                        count += this === box2;
                    }, box2);
                    test.expect(count).toEqual(0);
                    box2.dispatchEvent('e1');
                    test.expect(count).toEqual(2);
                }, 2);
            });
            test.describe('watch directive', function () {
                test.it('can listenTo the object that it belongs to', function () {
                    box.watch('here', 'there', function () {
                        count++;
                    });
                    test.expect(count).toEqual(0);
                    box.set('here', 1);
                    test.expect(count).toEqual(0);
                    box.set('here', 'there');
                    test.expect(count).toEqual(1);
                    box.set('here', 'where');
                    test.expect(count).toEqual(1);
                    box.set('here', 'there');
                    test.expect(count).toEqual(2);
                }, 5);
            });
            test.describe('when directive', function () {
                test.it('gives an api synonymous with english', function () {
                    box.when('here').is('there').and('when').is('now').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    test.expect(count).toEqual(0);
                    box.set('here', 'nothere');
                    test.expect(count).toEqual(-1);
                    box.set('when', 'later');
                    test.expect(count).toEqual(-1);
                    box.set('when', 'now');
                    test.expect(count).toEqual(-1);
                    box.set('here', 'there');
                    test.expect(count).toEqual(0);
                }, 5);
                // test.it('allows for negatives to be used like isNot and isnt', function () {
                //     box.when('one').isNot(2).and('up').isnt('down').then(function () {
                //         count++;
                //     }).otherwise(function () {
                //         count--;
                //     });
                //     test.expect(count).toEqual(0);
                //     box.set('up', 'down');
                //     test.expect(count).toEqual(-1);
                //     box.set('one', 2);
                //     test.expect(count).toEqual(-1);
                //     box.set('one', 1);
                //     test.expect(count).toEqual(-1);
                //     box.set('up', 'side');
                //     test.expect(count).toEqual(0);
                // });
                test.it('can compare numbers using basic operators and negation', function () {
                    box.when('one').isGreaterThan(5).and('ten').isLessThan(4).and('phone').isNotLessThan(5).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    test.expect(count).toEqual(0);
                    box.set('phone', 10);
                    test.expect(count).toEqual(-1);
                    box.set('one', 6);
                    test.expect(count).toEqual(-1);
                    box.set('ten', 5);
                    test.expect(count).toEqual(-1);
                    box.set('ten', 2);
                    test.expect(count).toEqual(0);
                }, 5);
                test.it('can compare string values using basic operators and negation', function () {
                    box.when('one').isGreaterThan('a').and('ten').isLessThan('b').then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    test.expect(count).toEqual(0);
                    box.set('one', '0');
                    test.expect(count).toEqual(-1);
                    box.set('ten', 'beach');
                    test.expect(count).toEqual(-1);
                    box.set('ten', 'aardvark');
                    test.expect(count).toEqual(-1);
                    box.set('one', 'ten');
                    test.expect(count).toEqual(0);
                }, 5);
                test.it('can also handle custom functions', function () {
                    box.when('one').is(function () {
                        return box.get('one') > 5;
                    }).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    test.expect(count).toEqual(0);
                    box.set('one', 10);
                    test.expect(count).toEqual(1);
                    box.set('one', 3);
                    test.expect(count).toEqual(0);
                }, 3);
                test.it('can also make "groups" using the or method', function () {
                    var sequence = box.when('one').is(1).or('truth').is(true).then(function () {
                        count++;
                    }).otherwise(function () {
                        count--;
                    });
                    test.expect(count).toEqual(0);
                    box.set('one', 2);
                    test.expect(count).toEqual(-1);
                    box.set('one', 0);
                    test.expect(count).toEqual(-1);
                    box.set('truth', true);
                    test.expect(count).toEqual(0);
                    box.set('one', 1);
                    test.expect(count).toEqual(0);
                    box.set('truth', false);
                    test.expect(count).toEqual(0);
                }, 6);
                test.it('can also have multiple watchers on a particular instance that run independently', function () {
                    var last;
                    var sequence = box.when('five').isLessThan(10).then(function () {
                        count++;
                        last = 1;
                    });
                    var sequence2 = box.when('here').is('there').then(function () {
                        count++;
                        last = 2;
                    });
                    test.expect(count).toEqual(0);
                    test.expect(last).toEqual(void 0);
                    box.set('five', 3);
                    test.expect(count).toEqual(1);
                    test.expect(last).toEqual(1);
                    box.set('here', 'there');
                    test.expect(count).toEqual(2);
                    test.expect(last).toEqual(2);
                }, 6);
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