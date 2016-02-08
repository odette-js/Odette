application.scope().run(function (app, _, factories, $) {
    // var factories = _.factories;
    describe('Box', function () {
        var blank, count, box,
            Box = factories.Box,
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
        it('extends from factories.Model', function () {
            expect(factories.Model.isInstance(box)).toEqual(true);
        });
        it('and from factories.Container', function () {
            expect(factories.Container.isInstance(box)).toEqual(true);
        });
        describe('Boxes are always created with...', function () {
            var box2 = Box();
            it('a unique id', function () {
                expect(_.has(box2, 'id')).toEqual(true);
            });
            it('even if there is not one given', function () {
                var box3 = Box({
                    id: 5
                });
                expect(box2.id !== void 0).toEqual(true);
                expect(box3.id === 5).toEqual(true);
            });
            it('an empty _previousAttributes hash', function () {
                expect(_.has(box2, '_previousAttributes')).toEqual(true);
                expect(_.isObject(box2._previousAttributes)).toEqual(true);
                expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
            });
            it('a collection for children', function () {
                expect(_.has(box2, 'children')).toEqual(true);
                expect(factories.Collection.isInstance(box2.children)).toEqual(true);
                expect(box2.children.length()).toEqual(0);
            });
            it('and an attributes object', function () {
                expect(_.has(box2, 'attributes')).toEqual(true);
                expect(_.isObject(box2.attributes)).toEqual(true);
            });
        });
        describe('you can set properties on the box you\'re handling with the set method', function () {
            var box = Box(),
                attrs = box.attributes;
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
            it('you can add new properties', function () {
                expect(attrs.ten).toEqual(void 0);
                box.set({
                    ten: 10,
                    eleven: 11,
                    twelve: 12
                });
                expect(box.get('ten')).toEqual(10);
            });
            it('you can modify existing properties', function () {
                expect(box.get('one')).toEqual(1);
                box.set({
                    one: 2,
                    two: 3,
                    three: 4
                });
                expect(box.get('one')).toEqual(2);
            });
            it('and you can remove properties by using the unset method', function () {
                var box = Box();
                expect(box.get('one')).toEqual(void 0);
                box.set({
                    one: 1
                });
                expect(box.get('one')).toEqual(1);
                box.unset('one');
                expect(box.get('one')).toEqual(void 0);
            });
            it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
                expect(box.get('one')).toEqual(1);
                expect(box.get('three')).toEqual(3);
                expect(box.get('five')).toEqual(5);
                box.unset('one three five');
                expect(box.get('one')).toEqual(void 0);
                expect(box.get('three')).toEqual(void 0);
                expect(box.get('five')).toEqual(void 0);
            });
        });
        // pass to the on, once, off, listenTo, listenToOnce, and stopListening functions
        describe('there are super special characters that you can use for terseness', function () {
            var count = 0,
                handler = function () {
                    count++;
                };
            beforeEach(function () {
                box2 = Box();
                count = 0;
            });
        });
        describe('Boxes also trigger a variety of events any time the set method changes the attributes object', function () {
            var fired;
            beforeEach(function () {
                fired = 0;
            });
            it('such as the change event', function () {
                expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                expect(fired).toEqual(0);
                box.set({
                    here: 'there'
                });
                expect(fired).toEqual(1);
            });
            it('and the alter event', function () {
                expect(fired).toEqual(0);
                box.on('change', function () {
                    fired = 1;
                });
                expect(fired).toEqual(0);
                box.set({
                    one: 1,
                    two: 2
                });
                expect(fired).toEqual(0);
                box.set({
                    two: 1
                });
                expect(fired).toEqual(1);
            });
            it('as well as alter events specific to each property', function () {
                expect(fired).toEqual(0);
                box.on('change:one change:two change:three', function () {
                    fired++;
                });
                expect(fired).toEqual(0);
                box.set({
                    one: 9,
                    two: 8,
                    three: 7
                });
                expect(fired).toEqual(3);
            });
        });
        describe('but beyond events and simple hashes, Boxes are able to manage themselves fairly well', function () {
            it('they can get properties from the attributes object with the get method', function () {
                expect(box.get('one')).toEqual(1);
            });
            it('they can tell you if it has a property with the has method', function () {
                expect(box.has('one')).toEqual(true);
            });
            it('they can clone it\'s attributes by using the toJSON method', function () {
                var clone = box.toJSON();
                expect(clone).toEqual(box.attributes);
                expect(clone === box.attributes).toEqual(false);
            });
            it('they can clone children into an array', function () {
                var clone;
                box.add([factories.Box(), factories.Box()]);
                clone = box.children.toJSON();
                expect(clone).toEqual([{}, {}]);
            });
            it('they can stringify themselves', function () {
                box = factories.Box({
                    some: 'thing'
                });
                expect(box.toString()).toEqual(JSON.stringify({
                    some: 'thing'
                }));
            });
            it('they can stringify their children', function () {
                box = factories.Box();
                box.add(data.children);
                expect(box.children.toString()).toEqual(JSON.stringify(data.children));
            });
        });
        describe('Boxes can register other objects against a key hash as well', function () {
            it('it can register', function () {
                var data = {
                    myObj: 1
                };
                expect(box.children.get('registering')).toEqual(void 0);
                box.children.register('registering', data);
                expect(box.children.get('registering')).toEqual(data);
            });
            it('and retreive information', function () {
                var data = {
                    myObj: 1
                };
                expect(box.children.get('registering')).toEqual(void 0);
                box.children.register('registering', data);
                expect(box.children.get('registering') === data).toEqual(true);
            });
        });
        describe('boxes can have children', function () {
            it('you can add one at a time', function () {
                expect(box.children.length()).toEqual(0);
                box.add({
                    isChild: !0
                });
                expect(box.children.length()).toEqual(1);
            });
            it('or many at once', function () {
                expect(box.children.length()).toEqual(0);
                box.add([{
                    isChild: !0
                }, {
                    isChild: 'maybe'
                }, {
                    isChild: 'may'
                }]);
                expect(box.children.length()).toEqual(3);
            });
            it('you can also remove them one at a time', function () {
                box = factories.Box();
                box.add(data.children);
                expect(box.children.length()).toEqual(2);
            });
            it('or many at the same time', function () {
                box = factories.Box();
                var children = box.children;
                expect(children.length()).toEqual(0);
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                expect(children.length()).toEqual(4);
                box.remove([children.index(1), children.index(3)]);
                expect(children.length()).toEqual(2);
            });
        });
        describe('they can', function () {
            it('destroy themselves', function () {
                box = factories.Box();
                box.add([{
                    one: 1
                }, {
                    one: 2
                }, {
                    one: 3
                }, {
                    one: 4
                }]);
                var destroyer = box.children.index(2);
                expect(box.children.get('cid', destroyer.cid) === destroyer).toEqual(true);
                expect(box.children.get('id', destroyer.id) === destroyer).toEqual(true);
                destroyer.destroy();
                expect(box.children.get('cid', destroyer.cid)).toEqual(void 0);
                expect(box.children.get('id', destroyer.id)).toEqual(void 0);
            });
            it('sort their children', function () {
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
                expect(box.children.map(function (model) {
                    return model.get('two');
                }).unwrap()).toEqual([1, 2, 8]);
                box.comparator = '!two';
                box.sort();
                expect(box.children.map(function (model) {
                    return model.get('two');
                }).unwrap()).toEqual([8, 2, 1]);
            });
            it('set up events on their children', function () {
                var counter = 0;
                box.childEvents = {
                    beep: function () {
                        counter++;
                        counter += (this !== box) && factories.Model.isInstance(box);
                    },
                    boop: function () {
                        counter--;
                    }
                };
                box.add([{}, {}, {}, {}]);
                expect(counter).toEqual(0);
                box.children.duff(function (model) {
                    model.dispatchEvent('beep');
                });
                expect(counter).toEqual(8);
                box.children.duff(function (model) {
                    model.dispatchEvent('boop');
                });
                expect(counter).toEqual(4);
            });
            it('set up events on their parents', function () {
                var count = 0;
                Box.constructor.prototype.parentEvents = {
                    beep: function () {
                        count++;
                    }
                };
                box.add([{}, {}, {}, {}]);
                box.dispatchEvent('beep');
                expect(count).toEqual(4);
                delete Box.constructor.prototype.parentEvents;
            });
        });
        describe('boxes can remove themselves', function () {
            it('if they are alone, only their events will be removed', function () {
                box.on({
                    event1: counter,
                    event2: counter
                });
                expect(count).toEqual(0);
                box.dispatchEvent('event1');
                expect(count).toEqual(1);
                box.dispatchEvent('event2');
                expect(count).toEqual(2);
                box.destroy();
                expect(count).toEqual(2);
                box.dispatchEvent('event1');
                expect(count).toEqual(2);
                box.dispatchEvent('event2');
                expect(count).toEqual(2);
            });
            it('if they are listening to something then those listeners will also be removed', function () {
                var box2 = factories.Box();
                box.listenTo(box2, {
                    event1: counter,
                    event2: counter
                });
                expect(count).toEqual(0);
                box2.dispatchEvent('event1');
                expect(count).toEqual(1);
                box2.dispatchEvent('event2');
                expect(count).toEqual(2);
                box2.destroy();
                expect(count).toEqual(2);
                box2.dispatchEvent('event1');
                expect(count).toEqual(2);
                box2.dispatchEvent('event2');
                expect(count).toEqual(2);
                // box.listenTo(box2, {
                //     event1: function () {},
                //     event2: function () {}
                // });
                // expect(box2._events.event1.length).toEqual(1);
                // expect(_.keys(box._listeningTo).length).toEqual(1);
                // box2.destroy();
                // expect(box2._events.event1.length).toEqual(0);
                // _.each(box._listeningTo, function (val, key) {
                //     if (!_.isBlank(val)) {
                //         events[key] = val;
                //     }
                // });
                // expect(_.keys(events).length).toEqual(0);
            });
            it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
                var box2 = factories.Box();
                box.listenTo(box2, {
                    event1: counter,
                    event2: counter
                });
                expect(count).toEqual(0);
                box2.dispatchEvent('event1');
                expect(count).toEqual(1);
                box2.dispatchEvent('event2');
                expect(count).toEqual(2);
                box.destroy();
                expect(count).toEqual(2);
                box2.dispatchEvent('event1');
                expect(count).toEqual(2);
                box2.dispatchEvent('event2');
                expect(count).toEqual(2);
            });
        });
        describe('there is also an alternative to the on api called the watch api', function () {
            it('it can attach event listeners', function () {
                var count = 0;
                box.watch('there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(0);
                box.set('there', 'there');
                expect(count).toEqual(1);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(2);
            });
            it('and watch variables dynamically', function () {
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
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(0);
                box.set('there', 'there');
                expect(count).toEqual(1);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(2);
            });
            it('it does not have a context in the first argument', function () {
                var count = 0;
                box.watch('there', function (e) {
                    return e.target === box && this !== box;
                }, function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(2);
            });
            it('it does can attach listeners using the once api', function () {
                var count = 0;
                box.watchOnce('there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box.set('there', 'here');
                expect(count).toEqual(0);
                box.set('there', 'there');
                expect(count).toEqual(1);
                box.set('there', 'here');
                expect(count).toEqual(1);
                box.set('there', 'there');
                expect(count).toEqual(1);
            });
            it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Box();
                box.watchOther(box2, 'there', function (e) {
                    count++;
                    return e.target === box && this !== box;
                }, function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box2.set('there', 'here');
                expect(count).toEqual(1);
                box2.set('there', 'there');
                expect(count).toEqual(2);
                box2.set('there', 'here');
                expect(count).toEqual(3);
                box2.set('there', 'there');
                expect(count).toEqual(4);
            });
            it('and listeners on other objects with the watchOther api', function () {
                var count = 0;
                var box2 = factories.Box();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box2.set('there', 'there');
                expect(count).toEqual(1);
                box2.set('there', 'here');
                expect(count).toEqual(1);
            });
            it('the once handler will only take itself off when it succeeds', function () {
                var count = 0;
                var box2 = factories.Box();
                box.watchOtherOnce(box2, 'there', 'there', function (e) {
                    count++;
                });
                expect(count).toEqual(0);
                box2.set('there', 'here');
                expect(count).toEqual(0);
                box2.set('there', 'there');
                expect(count).toEqual(1);
                box2.set('there', 'here');
                expect(count).toEqual(1);
                box2.set('there', 'there');
                expect(count).toEqual(1);
            });
        });
    });
});