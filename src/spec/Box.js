application.scope().run(function (app, _, factories, $) {
    // var factories = _.factories;
    describe('Box', function () {
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
        it('extends from factories.Model', function () {
            expect(_.isInstance(box, factories.Model)).toEqual(true);
        });
        describe('Boxes are always created with...', function () {
            var box2 = Box();
            it('a unique id', function () {
                expect(_.has(box2, 'id')).toEqual(true);
            });
            it('a _previousAttributes hash', function () {
                expect(_.has(box2, '_previousAttributes')).toEqual(true);
                expect(_.isObject(box2._previousAttributes)).toEqual(true);
                expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
            });
            // it('a _byId hash', function () {
            // 	expect(_.has(box2, '_byId')).toEqual(true);
            // 	expect(_.isObject(box2._byId)).toEqual(true);
            // });
            it('a collection of children', function () {
                expect(_.has(box2, 'children')).toEqual(true);
                expect(_.isInstance(box2.children, factories.Collection)).toEqual(true);
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
                // expect(_.has(box._previousAttributes, 'ten')).toEqual(true);
                // expect(box._previousAttributes.one).toEqual(void 0);
                expect(box.attributes.ten).toEqual(10);
            });
            it('you can modify existing properties', function () {
                expect(box.attributes.one).toEqual(1);
                box.set({
                    one: 2,
                    two: 3,
                    three: 4
                });
                // expect(_.has(box._previousAttributes, 'one')).toEqual(true);
                // expect(box._previousAttributes.one).toEqual(1);
                expect(box.attributes.one).toEqual(2);
            });
            // it('modifying the attributes object can be done by passing in a variety of arguments, which are sequenced and extended onto the object', function () {
            //     box.set('one', 5, {
            //         three: 1,
            //         four: 2,
            //         five: 3
            //     }, 'four', 4);
            //     expect(box.attributes.one).toEqual(5);
            //     expect(box.attributes.three).toEqual(1);
            //     expect(box.attributes.four).toEqual(4);
            //     expect(box.attributes.five).toEqual(3);
            // });
            it('and you can remove properties by using the unset method', function () {
                var box = Box();
                expect(box.attributes.one).toEqual(void 0);
                box.set({
                    one: 1
                });
                expect(box.attributes.one).toEqual(1);
                box.unset('one');
                expect(box.attributes.one).toEqual(void 0);
            });
            it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
                expect(box.attributes.one).toEqual(1);
                expect(box.attributes.three).toEqual(3);
                expect(box.attributes.five).toEqual(5);
                box.unset('one three five');
                expect(box.attributes.one).toEqual(void 0);
                expect(box.attributes.three).toEqual(void 0);
                expect(box.attributes.five).toEqual(void 0);
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
            it('such as the digest event', function () {
                box.on('digest', function () {
                    fired = 1;
                });
                box.set({
                    here: 'there'
                });
                expect(fired).toEqual(1);
            });
            it('and the alter event', function () {
                box.on('change', function () {
                    fired = 1;
                });
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
                var obj = {
                    one: 9,
                    two: 8,
                    three: 7
                };
                box.on('change:one change:two change:three', function () {
                    fired++;
                });
                box.set(obj);
                expect(_.keys(obj).length).toEqual(fired);
            });
        });
        describe('but beyond events and simple hashes, Boxes are able to manage themselves fairly well', function () {
            var data = {
                some: 'thing',
                children: [{
                    here: 'we',
                    go: 'pause'
                }, {
                    one: 'more',
                    time: 'pause'
                }]
            };
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
            // it('they can stringify themselves as a tree structure', function () {
            //     box = factories.Box(data);
            //     expect(box.stringifyTree()).toEqual(JSON.stringify(data));
            // });
            // it('they can stringify themselves as a tree structure', function () {
            //     box = factories.Box(data);
            //     expect(box.stringifyTree()).toEqual(JSON.stringify(data));
            // });
        });
        describe('Boxes can register other objects against a key hash as well', function () {
            it('it can register', function () {
                box.children.register('registering', {
                    myObj: 1
                });
                expect(box.children._byId.id.registering.myObj).toEqual(1);
            });
            it('and retreive information', function () {
                var data = {
                    myObj: 1
                };
                box.children.register('registering', data);
                expect(box.children.get('registering')).toEqual(data);
                expect(box.children.get('registering') === data).toEqual(true);
            });
        });
        describe('As you may have noticed, boxes', function () {
            describe('can have children', function () {
                it('you can add one at a time', function () {
                    box.add({
                        isChild: !0
                    });
                    expect(box.children.length()).toEqual(1);
                });
                it('or many at once', function () {
                    box.add([{
                        isChild: !0
                    }, {
                        isChild: 'maybe'
                    }]);
                    expect(box.children.length()).toEqual(2);
                });
                it('you can also remove them', function () {
                    box = factories.Box();
                    box.add(data.children);
                    expect(box.children.length()).toEqual(2);
                });
                it('or many at the same time', function () {
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
                    var children = box.children;
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
                            counter += (this === box);
                        },
                        boop: function () {
                            counter--;
                        }
                    };
                    box.add([{}, {}, {}, {}]);
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
                    Box.constructor.prototype.parentEvents = blank;
                });
            });
        });
        describe('boxes can remove themselves', function () {
            it('if they are alone, only their events will be removed', function () {
                box.on({
                    event1: function () {},
                    event2: function () {}
                });
                expect(box._events.event1.length).toEqual(1);
                box.destroy();
                expect(box._events.event1.length).toEqual(0);
            });
            it('if they are listening to something then those listeners will also be removed', function () {
                var box2 = factories.Box(),
                    events = {};
                box.listenTo(box2, {
                    event1: function () {},
                    event2: function () {}
                });
                expect(box2._events.event1.length).toEqual(1);
                expect(_.keys(box._listeningTo).length).toEqual(1);
                box2.destroy();
                expect(box2._events.event1.length).toEqual(0);
                _.each(box._listeningTo, function (val, key) {
                    if (!_.isBlank(val)) {
                        events[key] = val;
                    }
                });
                expect(_.keys(events).length).toEqual(0);
            });
            it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
                var box2 = factories.Box(),
                    events = {};
                box.listenTo(box2, {
                    event1: function () {},
                    event2: function () {}
                });
                expect(box2._events.event1.length).toEqual(1);
                expect(_.keys(box._listeningTo).length).toEqual(1);
                box.destroy();
                // check to make sure all of the _events are being removed and
                // all of the ties to everything else is being cleaned up
                expect(box2._events.event1.length).toEqual(0);
                _.each(box._listeningTo, function (val, key) {
                    if (!_.isBlank(val)) {
                        events[key] = val;
                    }
                });
                expect(_.keys(events).length).toEqual(0);
            });
        });
    });
});