application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    // var factories = _.factories;
    _.describe('Model', function () {
        var blank, count, box,
            Model = factories.Model,
            handler = function () {
                return !0;
            },
            handler2 = function () {
                return !1;
            },
            counter = function () {
                count++;
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
        _.beforeEach(function () {
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
        _.it('extends from factories.Extendable', function () {
            _.expect(factories.Extendable.isInstance(box)).toEqual(true);
        });
        _.describe('Models are always created with...', function () {
            var box2 = Model();
            _.it('a unique id', function () {
                _.expect(_.has(box2, 'id')).toEqual(true);
            });
            _.it('even if there is not one given', function () {
                var box3 = Model({
                    id: 5
                });
                _.expect(box2.id !== void 0).toEqual(true);
                _.expect(box3.id === 5).toEqual(true);
            });
            // _.it('an empty _previousAttributes hash', function () {
            //     _.expect(_.has(box2, '_previousAttributes')).toEqual(true);
            //     _.expect(_.isObject(box2._previousAttributes)).toEqual(true);
            //     _.expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
            // });
            // _.it('a collection for children', function () {
            //     _.expect(_.has(box2, 'Children')).toEqual(true);
            //     _.expect(factories.Collection.isInstance(box2.directive('Children'))).toEqual(true);
            //     _.expect(box2.directive('Children').length()).toEqual(0);
            // });
            // _.it('and an attributes object', function () {
            //     _.expect(_.has(box2, 'attributes')).toEqual(true);
            //     _.expect(_.isObject(box2.directive('data').current)).toEqual(true);
            // });
        });
        _.describe('you can set properties on the box you\'re handling with the set method', function () {
            var box = Model(),
                attrs = box.directive('data');
            _.beforeEach(function () {
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
            _.it('you can add new properties', function () {
                _.expect(attrs.ten).toEqual(void 0);
                box.set({
                    ten: 10,
                    eleven: 11,
                    twelve: 12
                });
                _.expect(box.get('ten')).toEqual(10);
            });
            _.it('you can modify existing properties', function () {
                _.expect(box.get('one')).toEqual(1);
                box.set({
                    one: 2,
                    two: 3,
                    three: 4
                });
                _.expect(box.get('one')).toEqual(2);
            });
            _.it('and you can remove properties by using the unset method', function () {
                var box = Model();
                _.expect(box.get('one')).toEqual(void 0);
                box.set({
                    one: 1
                });
                _.expect(box.get('one')).toEqual(1);
                box.unset('one');
                _.expect(box.get('one')).toEqual(void 0);
            });
            // _.it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
            //     _.expect(box.get('one')).toEqual(1);
            //     _.expect(box.get('three')).toEqual(3);
            //     _.expect(box.get('five')).toEqual(5);
            //     box.unset('one three five');
            //     _.expect(box.get('one')).toEqual(void 0);
            //     _.expect(box.get('three')).toEqual(void 0);
            //     _.expect(box.get('five')).toEqual(void 0);
            // });
        });
        // pass to the on, once, off, listenTo, listenToOnce, and stopListening functions
        _.describe('there are super special characters that you can use for terseness', function () {
            var count = 0,
                handler = function () {
                    count++;
                };
            _.beforeEach(function () {
                box2 = Model();
                count = 0;
            });
        });
        _.describe('Models also trigger a variety of events any time the set method changes the attributes object', function () {
            var fired;
            _.beforeEach(function () {
                fired = 0;
            });
            _.it('such as the change event', function () {
                _.expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                _.expect(fired).toEqual(0);
                box.set({
                    here: 'there'
                });
                _.expect(fired).toEqual(1);
            });
            _.it('and the alter event', function () {
                _.expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                _.expect(fired).toEqual(0);
                box.set({
                    one: 1,
                    two: 2
                });
                _.expect(fired).toEqual(0);
                box.set({
                    two: 1
                });
                _.expect(fired).toEqual(1);
            });
            _.it('as well as alter events specific to each property', function () {
                _.expect(fired).toEqual(0);
                box.on('change:one change:two change:three', function () {
                    fired++;
                });
                _.expect(fired).toEqual(0);
                box.set({
                    one: 9,
                    two: 8,
                    three: 7
                });
                _.expect(fired).toEqual(3);
            });
        });
        _.describe('but beyond events and simple hashes, Models are able to manage themselves fairly well', function () {
            _.it('they can get properties from the attributes object with the get method', function () {
                _.expect(box.get('one')).toEqual(1);
            });
            _.it('they can tell you if it has a property with the has method', function () {
                _.expect(box.has('one')).toEqual(true);
            });
            _.it('they can clone it\'s attributes by using the toJSON method', function () {
                var clone = box.toJSON();
                _.expect(clone).toEqual(box.directive('data').current);
                _.expect(clone === box.directive('data').current).toEqual(false);
            });
            _.it('they can clone children into an array', function () {
                var clone;
                box.add([factories.Model(), factories.Model()]);
                clone = box.directive('Children').toJSON();
                _.expect(clone).toEqual([{}, {}]);
            });
            _.it('they can stringify themselves', function () {
                box = factories.Model({
                    some: 'thing'
                });
                _.expect(box.toString()).toEqual(JSON.stringify({
                    some: 'thing'
                }));
            });
            _.it('they can stringify their children', function () {
                box = factories.Model();
                box.add(data.children);
                _.expect(box.directive('Children').toString()).toEqual(JSON.stringify(data.children));
            });
        });
        _.describe('Models can register other objects against a key hash as well', function () {
            _.it('it can register', function () {
                var data = {
                    myObj: 1
                };
                _.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
                box.directive('Children').keep('id', 'key', data);
                _.expect(box.directive('Children').get('id', 'key')).toEqual(data);
            });
            _.it('and retreive information', function () {
                var data = {
                    myObj: 1
                };
                _.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
                box.directive('Children').keep('id', 'key', data);
                _.expect(box.directive('Children').get('id', 'key') === data).toEqual(true);
            });
        });
        _.describe('boxes can have children', function () {
            _.it('you can add one at a time', function () {
                _.expect(box.directive('Children').length()).toEqual(0);
                box.add({
                    isChild: !0
                });
                _.expect(box.directive('Children').length()).toEqual(1);
            });
            _.it('or many at once', function () {
                _.expect(box.directive('Children').length()).toEqual(0);
                box.add([{
                    isChild: !0
                }, {
                    isChild: 'maybe'
                }, {
                    isChild: 'may'
                }]);
                _.expect(box.directive('Children').length()).toEqual(3);
            });
            _.it('you can also remove them one at a time', function () {
                box = factories.Model();
                box.add(data.children);
                _.expect(box.directive('Children').length()).toEqual(2);
            });
            _.it('or many at the same time', function () {
                box = factories.Model();
                var children = box.directive('Children');
                _.expect(children.length()).toEqual(0);
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                _.expect(children.length()).toEqual(4);
                box.remove([children.item(1), children.item(3)]);
                _.expect(children.length()).toEqual(2);
            });
        });
        _.describe('they can', function () {
            _.it('destroy themselves', function () {
                box = factories.Model();
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                var destroyer = box.directive('Children').item(2);
                _.expect(box.directive('Children').get('cid', destroyer.cid) === destroyer).toEqual(true);
                _.expect(box.directive('Children').get('id', destroyer.id) === destroyer).toEqual(true);
                destroyer.destroy();
                _.expect(box.directive('Children').get('cid', destroyer.cid)).toEqual(void 0);
                _.expect(box.directive('Children').get('id', destroyer.id)).toEqual(void 0);
            });
            _.it('sort their children', function () {
                box.add([{
                    one: 1,
                    two: 2,
                    three: 3
                }, {
                    one: 2,
                    two: 1,
                    three: 3
                }, {
                    one: 3,
                    two: 8,
                    three: 9
                }]);
                box.comparator = 'two';
                box.sort();
                _.expect(box.directive('Children').map(function (model) {
                    return model.get('two');
                }).unwrap()).toEqual([1, 2, 8]);
                box.comparator = '!two';
                box.sort();
                _.expect(box.directive('Children').map(function (model) {
                    return model.get('two');
                }).unwrap()).toEqual([8, 2, 1]);
            });
            _.it('set up events on their children', function () {
                var counter = 0;
                box.childEvents = {
                    beep: function () {
                        counter++;
                        counter += (this === box);
                    },
                    boop: function () {
                        counter--;
                    }
                };
                box.add([{}, {}, {}, {}]);
                _.expect(counter).toEqual(0);
                box.directive('Children').results('dispatchEvent', 'beep');
                _.expect(counter).toEqual(8);
                box.directive('Children').results('dispatchEvent', 'boop');
                _.expect(counter).toEqual(4);
            });
            _.it('set up events on their parents', function () {
                var count = 0;
                Model.constructor.prototype.parentEvents = {
                    beep: function () {
                        count++;
                    }
                };
                box.add([{}, {}, {}, {}]);
                box.dispatchEvent('beep');
                _.expect(count).toEqual(4);
                delete Model.constructor.prototype.parentEvents;
            });
        });
        _.describe('boxes can "destroy" themselves', function () {
            _.it('their events will persist until they decide to reset their own events', function () {
                box.on({
                    event1: counter,
                    event2: counter
                });
                _.expect(count).toEqual(0);
                box.dispatchEvent('event1');
                _.expect(count).toEqual(1);
                box.dispatchEvent('event2');
                _.expect(count).toEqual(2);
                box.destroy();
                _.expect(count).toEqual(2);
                box.dispatchEvent('event1');
                _.expect(count).toEqual(3);
                box.directive('EventManager').reset();
                _.expect(count).toEqual(3);
                box.dispatchEvent('event2');
                _.expect(count).toEqual(3);
            });
            _.it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
                var box2 = factories.Model();
                box.listenTo(box2, {
                    event1: counter,
                    event2: counter
                });
                _.expect(count).toEqual(0);
                box2.dispatchEvent('event1');
                _.expect(count).toEqual(1);
                box2.dispatchEvent('event2');
                _.expect(count).toEqual(2);
                box.destroy();
                _.expect(count).toEqual(2);
                box2.dispatchEvent('event1');
                _.expect(count).toEqual(2);
                box2.dispatchEvent('event2');
                _.expect(count).toEqual(2);
            });
        });
        _.describe('there is also an alternative to the on api called the watch api', function () {
            _.it('it can attach event listeners', function () {
                var count = 0;
                box.watch('there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(0);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(2);
            });
            _.it('and watch variables dynamically', function () {
                var half = -1,
                    count = 0;
                box.watch('there', function (e) {
                    half++;
                    if (half > count) {
                        half--;
                        return true;
                    }
                }, function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(0);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(2);
            });
            _.it('it does not have a context in the first argument', function () {
                var count = 0;
                box.watch('there', function (e) {
                    return e.origin === box && this !== box;
                }, function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(2);
            });
            _.it('it does can attach listeners using the once api', function () {
                var count = 0;
                box.watchOnce('there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box.set('there', 'here');
                _.expect(count).toEqual(0);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
                box.set('there', 'here');
                _.expect(count).toEqual(1);
                box.set('there', 'there');
                _.expect(count).toEqual(1);
            });
            _.it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOther(box2, 'there', function (e) {
                    count++;
                    return e.target === box && this !== box;
                }, function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box2.set('there', 'here');
                _.expect(count).toEqual(1);
                box2.set('there', 'there');
                _.expect(count).toEqual(2);
                box2.set('there', 'here');
                _.expect(count).toEqual(3);
                box2.set('there', 'there');
                _.expect(count).toEqual(4);
            });
            _.it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box2.set('there', 'there');
                _.expect(count).toEqual(1);
                box2.set('there', 'here');
                _.expect(count).toEqual(1);
            });
            _.it('the once handler will only take itself off when it succeeds', function () {
                var count = 0;
                var box2 = factories.Model();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                _.expect(count).toEqual(0);
                box2.set('there', 'here');
                _.expect(count).toEqual(0);
                box2.set('there', 'there');
                _.expect(count).toEqual(1);
                box2.set('there', 'here');
                _.expect(count).toEqual(1);
                box2.set('there', 'there');
                _.expect(count).toEqual(1);
            });
        });
    });
});