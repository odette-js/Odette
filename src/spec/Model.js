// application.scope().run(window, function (module, app, _, factories, $) {
//     test.describe('Model', function () {
//         var blank, count, box,
//             Model = factories.Model,
//             handler = function () {
//                 return !0;
//             },
//             handler2 = function () {
//                 return !1;
//             },
//             counter = function () {
//                 count++;
//             },
//             data = {
//                 some: 'thing',
//                 children: [{
//                     here: 'we',
//                     go: 'pause'
//                 }, {
//                     one: 'more',
//                     time: 'pause'
//                 }]
//             };
//         test.beforeEach(function () {
//             count = 0;
//             box = Model({
//                 zero: 0,
//                 one: 1,
//                 two: 2,
//                 three: 3,
//                 four: 4,
//                 five: 5,
//                 six: 6,
//                 seven: 7,
//                 eight: 8,
//                 nine: 9
//             });
//         });
//         test.it('extends from factories.Extendable', function () {
//             test.expect(factories.Extendable.isInstance(box)).toEqual(true);
//         }, 1);
//         test.describe('Models are always created with...', function () {
//             var box2 = Model();
//             test.it('a unique id', function () {
//                 test.expect(_.has(box2, 'id')).toEqual(true);
//             }, 1);
//             test.it('even if there is not one given', function () {
//                 var box3 = Model({
//                     id: 5
//                 });
//                 test.expect(box2.id !== void 0).toEqual(true);
//                 test.expect(box3.id === 5).toEqual(true);
//             }, 2);
//             // test.it('an empty _previousAttributes hash', function () {
//             //     test.expect(_.has(box2, '_previousAttributes')).toEqual(true);
//             //     test.expect(_.isObject(box2._previousAttributes)).toEqual(true);
//             //     test.expect(_.isEmpty(box2._previousAttributes)).toEqual(true);
//             // });
//             // test.it('a collection for children', function () {
//             //     test.expect(_.has(box2, 'Children')).toEqual(true);
//             //     test.expect(factories.Collection.isInstance(box2.directive('Children'))).toEqual(true);
//             //     test.expect(box2.directive('Children').length()).toEqual(0);
//             // });
//             // test.it('and an attributes object', function () {
//             //     test.expect(_.has(box2, 'attributes')).toEqual(true);
//             //     test.expect(_.isObject(box2.directive('data').current)).toEqual(true);
//             // });
//         });
//         test.describe('you can set properties on the box you\'re handling with the set method', function () {
//             var box = Model(),
//                 attrs = box.directive('data');
//             test.beforeEach(function () {
//                 box = Model({
//                     zero: 0,
//                     one: 1,
//                     two: 2,
//                     three: 3,
//                     four: 4,
//                     five: 5,
//                     six: 6,
//                     seven: 7,
//                     eight: 8,
//                     nine: 9
//                 });
//             });
//             test.it('you can add new properties', function () {
//                 test.expect(attrs.ten).toEqual(void 0);
//                 box.set({
//                     ten: 10,
//                     eleven: 11,
//                     twelve: 12
//                 });
//                 test.expect(box.get('ten')).toEqual(10);
//             }, 2);
//             test.it('you can modify existing properties', function () {
//                 test.expect(box.get('one')).toEqual(1);
//                 box.set({
//                     one: 2,
//                     two: 3,
//                     three: 4
//                 });
//                 test.expect(box.get('one')).toEqual(2);
//             }, 2);
//             test.it('and you can remove properties by using the unset method', function () {
//                 var box = Model();
//                 test.expect(box.get('one')).toEqual(void 0);
//                 box.set({
//                     one: 1
//                 });
//                 test.expect(box.get('one')).toEqual(1);
//                 box.unset('one');
//                 test.expect(box.get('one')).toEqual(void 0);
//             }, 3);
//             // test.it('or remove a bunch of properties by passing in a space separated list to the unset method', function () {
//             //     test.expect(box.get('one')).toEqual(1);
//             //     test.expect(box.get('three')).toEqual(3);
//             //     test.expect(box.get('five')).toEqual(5);
//             //     box.unset('one three five');
//             //     test.expect(box.get('one')).toEqual(void 0);
//             //     test.expect(box.get('three')).toEqual(void 0);
//             //     test.expect(box.get('five')).toEqual(void 0);
//             // });
//         });
//         // pass to the on, once, off, listenTo, listenToOnce, and stopListening functions
//         test.describe('there are super special characters that you can use for terseness', function () {
//             var count = 0,
//                 handler = function () {
//                     count++;
//                 };
//             test.beforeEach(function () {
//                 box2 = Model();
//                 count = 0;
//             });
//         });
//         test.describe('Models also trigger a variety of events any time the set method changes the attributes object', function () {
//             var fired;
//             test.beforeEach(function () {
//                 fired = 0;
//             });
//             test.it('such as the change event', function () {
//                 test.expect(fired).toEqual(0);
//                 box.on('change', function () {
//                     fired = 1;
//                 });
//                 test.expect(fired).toEqual(0);
//                 box.set({
//                     here: 'there'
//                 });
//                 test.expect(fired).toEqual(1);
//             }, 3);
//             test.it('and the alter event', function () {
//                 test.expect(fired).toEqual(0);
//                 box.on('change', function () {
//                     fired = 1;
//                 });
//                 test.expect(fired).toEqual(0);
//                 box.set({
//                     one: 1,
//                     two: 2
//                 });
//                 test.expect(fired).toEqual(0);
//                 box.set({
//                     two: 1
//                 });
//                 test.expect(fired).toEqual(1);
//             }, 4);
//             test.it('as well as alter events specific to each property', function () {
//                 test.expect(fired).toEqual(0);
//                 box.on('change:one change:two change:three', function () {
//                     fired++;
//                 });
//                 test.expect(fired).toEqual(0);
//                 box.set({
//                     one: 9,
//                     two: 8,
//                     three: 7
//                 });
//                 test.expect(fired).toEqual(3);
//             }, 3);
//         });
//         test.describe('but beyond events and simple hashes, Models are able to manage themselves fairly well', function () {
//             test.it('they can get properties from the attributes object with the get method', function () {
//                 test.expect(box.get('one')).toEqual(1);
//             }, 1);
//             test.it('they can tell you if it has a property with the has method', function () {
//                 test.expect(box.has('one')).toEqual(true);
//             }, 1);
//             test.it('they can clone it\'s attributes by using the toJSON method', function () {
//                 var clone = box.toJSON();
//                 test.expect(clone).toEqual(box.directive('DataManager').current);
//                 test.expect(clone === box.directive('DataManager').current).toEqual(false);
//             }, 2);
//             test.it('they can clone children into an array', function () {
//                 var clone;
//                 box.add([factories.Model(), factories.Model()]);
//                 clone = box.directive('Children').toJSON();
//                 test.expect(clone).toEqual([{}, {}]);
//             }, 1);
//             test.it('they can stringify themselves', function () {
//                 box = factories.Model({
//                     some: 'thing'
//                 });
//                 test.expect(box.toString()).toEqual(JSON.stringify({
//                     some: 'thing'
//                 }));
//             }, 1);
//             test.it('they can stringify their children', function () {
//                 box = factories.Model();
//                 box.add(data.children);
//                 test.expect(box.directive('Children').toString()).toEqual(JSON.stringify(data.children));
//             }, 1);
//         });
//         test.describe('Models can register other objects against a key hash as well', function () {
//             test.it('it can register', function () {
//                 var data = {
//                     myObj: 1
//                 };
//                 test.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
//                 box.directive('Children').keep('id', 'key', data);
//                 test.expect(box.directive('Children').get('id', 'key')).toEqual(data);
//             }, 2);
//             test.it('and retreive information', function () {
//                 var data = {
//                     myObj: 1
//                 };
//                 test.expect(box.directive('Children').get('id', 'key')).toEqual(void 0);
//                 box.directive('Children').keep('id', 'key', data);
//                 test.expect(box.directive('Children').get('id', 'key') === data).toEqual(true);
//             }, 2);
//         });
//         test.describe('boxes can have children', function () {
//             test.it('you can add one at a time', function () {
//                 test.expect(box.directive('Children').length()).toEqual(0);
//                 box.add({
//                     isChild: !0
//                 });
//                 test.expect(box.directive('Children').length()).toEqual(1);
//             }, 2);
//             test.it('or many at once', function () {
//                 test.expect(box.directive('Children').length()).toEqual(0);
//                 box.add([{
//                     isChild: !0
//                 }, {
//                     isChild: 'maybe'
//                 }, {
//                     isChild: 'may'
//                 }]);
//                 test.expect(box.directive('Children').length()).toEqual(3);
//             }, 2);
//             test.it('you can also remove them one at a time', function () {
//                 box = factories.Model();
//                 box.add(data.children);
//                 test.expect(box.directive('Children').length()).toEqual(2);
//             }, 1);
//             test.it('or many at the same time', function () {
//                 box = factories.Model();
//                 var children = box.directive('Children');
//                 test.expect(children.length()).toEqual(0);
//                 box.add([{
//                     one: 1
//                 }, {
//                     one: 2
//                 }, {
//                     one: 3
//                 }, {
//                     one: 4
//                 }]);
//                 test.expect(children.length()).toEqual(4);
//                 box.remove([children.item(1), children.item(3)]);
//                 test.expect(children.length()).toEqual(2);
//             }, 3);
//         });
//         test.describe('they can', function () {
//             test.it('destroy themselves', function () {
//                 box = factories.Model();
//                 box.add([{
//                     one: 1
//                 }, {
//                     one: 2
//                 }, {
//                     one: 3
//                 }, {
//                     one: 4
//                 }]);
//                 var destroyer = box.directive('Children').item(2);
//                 test.expect(box.directive('Children').get('cid', destroyer.cid) === destroyer).toEqual(true);
//                 test.expect(box.directive('Children').get('id', destroyer.id) === destroyer).toEqual(true);
//                 destroyer.destroy();
//                 test.expect(box.directive('Children').get('cid', destroyer.cid)).toEqual(void 0);
//                 test.expect(box.directive('Children').get('id', destroyer.id)).toEqual(void 0);
//             }, 4);
//             test.it('sort their children', function () {
//                 box.add([{
//                     one: 1,
//                     two: 2,
//                     three: 3
//                 }, {
//                     one: 2,
//                     two: 1,
//                     three: 3
//                 }, {
//                     one: 3,
//                     two: 8,
//                     three: 9
//                 }]);
//                 box.comparator = 'two';
//                 box.sort();
//                 test.expect(box.directive('Children').map(function (model) {
//                     return model.get('two');
//                 }).toArray()).toEqual([1, 2, 8]);
//                 box.comparator = '!two';
//                 box.sort();
//                 test.expect(box.directive('Children').map(function (model) {
//                     return model.get('two');
//                 }).toArray()).toEqual([8, 2, 1]);
//             }, 2);
//             test.it('set up events on their children', function () {
//                 var counter = 0;
//                 box.childEvents = {
//                     beep: function () {
//                         counter++;
//                         counter += (this === box);
//                     },
//                     boop: function () {
//                         counter--;
//                     }
//                 };
//                 box.add([{}, {}, {}, {}]);
//                 test.expect(counter).toEqual(0);
//                 box.directive('Children').results('dispatchEvent', 'beep');
//                 test.expect(counter).toEqual(8);
//                 box.directive('Children').results('dispatchEvent', 'boop');
//                 test.expect(counter).toEqual(4);
//             }, 3);
//             test.it('set up events on their parents', function () {
//                 var count = 0;
//                 Model.constructor.prototype.parentEvents = {
//                     beep: function () {
//                         count++;
//                     }
//                 };
//                 box.add([{}, {}, {}, {}]);
//                 box.dispatchEvent('beep');
//                 test.expect(count).toEqual(4);
//                 delete Model.constructor.prototype.parentEvents;
//             }, 1);
//         });
//         test.describe('boxes can "destroy" themselves', function () {
//             test.it('their events will persist until they decide to reset their own events', function () {
//                 box.on({
//                     event1: counter,
//                     event2: counter
//                 });
//                 test.expect(count).toEqual(0);
//                 box.dispatchEvent('event1');
//                 test.expect(count).toEqual(1);
//                 box.dispatchEvent('event2');
//                 test.expect(count).toEqual(2);
//                 box.destroy();
//                 test.expect(count).toEqual(2);
//                 box.dispatchEvent('event1');
//                 test.expect(count).toEqual(3);
//                 box.directive('EventManager').reset();
//                 test.expect(count).toEqual(3);
//                 box.dispatchEvent('event2');
//                 test.expect(count).toEqual(3);
//             }, 7);
//             test.it('conversely, if the box has listening objects, it will remove it\'s handlers from other objects', function () {
//                 var box2 = factories.Model();
//                 box.listenTo(box2, {
//                     event1: counter,
//                     event2: counter
//                 });
//                 test.expect(count).toEqual(0);
//                 box2.dispatchEvent('event1');
//                 test.expect(count).toEqual(1);
//                 box2.dispatchEvent('event2');
//                 test.expect(count).toEqual(2);
//                 box.destroy();
//                 test.expect(count).toEqual(2);
//                 box2.dispatchEvent('event1');
//                 test.expect(count).toEqual(2);
//                 box2.dispatchEvent('event2');
//                 test.expect(count).toEqual(2);
//             }, 6);
//         });
//         test.describe('there is also an alternative to the on api called the watch api', function () {
//             test.it('it can attach event listeners', function () {
//                 var count = 0;
//                 box.watch('there', 'there', function (e) {
//                     count++;
//                 });
//                 test.expect(count).toEqual(0);
//                 box.set('there', 'here');
//                 test.expect(count).toEqual(0);
//                 box.set('there', 'there');
//                 test.expect(count).toEqual(1);
//                 box.set('there', 'here');
//                 test.expect(count).toEqual(1);
//                 box.set('there', 'there');
//                 test.expect(count).toEqual(2);
//             }, 5);
//             test.it('and watch variables dynamically', function () {
//                 var half = -1,
//                     count = 0;
//                 box.watch('there', function (e) {
//                     half++;
//                     if (half > count) {
//                         half--;
//                         return true;
//                     }
//                 }, function (e) {
//                     count++;
//                 });
//                 test.expect(count).toEqual(0);
//                 box.set('there', 'here');
//                 test.expect(count).toEqual(0);
//                 box.set('there', 'there');
//                 test.expect(count).toEqual(1);
//                 box.set('there', 'here');
//                 test.expect(count).toEqual(1);
//                 box.set('there', 'there');
//                 test.expect(count).toEqual(2);
//             }, 5);
//             test.it('it does not have a context in the first argument', function () {
//                 var count = 0;
//                 box.watch('there', function (e) {
//                     return e.origin === box && this !== box;
//                 }, function (e) {
//                     count++;
//                 });
//                 test.expect(count).toEqual(0);
//                 box.set('there', 'here');
//                 test.expect(count).toEqual(1);
//                 box.set('there', 'there');
//                 test.expect(count).toEqual(2);
//             }, 3);
//             test.it('it does can attach listeners using the once api', function () {
//                 var count = 0;
//                 box.watchOnce('there', 'there', function (e) {
//                     count++;
//                 });
//                 test.expect(count).toEqual(0);
//                 box.set('there', 'here');
//                 test.expect(count).toEqual(0);
//                 box.set('there', 'there');
//                 test.expect(count).toEqual(1);
//                 box.set('there', 'here');
//                 test.expect(count).toEqual(1);
//                 box.set('there', 'there');
//                 test.expect(count).toEqual(1);
//             }, 5);
//             test.it('and listeners on other objects with the watchOther api', function () {
//                 var count = 0;
//                 var box2 = factories.Model();
//                 box.watchOther(box2, 'there', function (e) {
//                     count++;
//                     return e.target === box && this !== box;
//                 }, function (e) {
//                     count++;
//                 });
//                 test.expect(count).toEqual(0);
//                 box2.set('there', 'here');
//                 test.expect(count).toEqual(1);
//                 box2.set('there', 'there');
//                 test.expect(count).toEqual(2);
//                 box2.set('there', 'here');
//                 test.expect(count).toEqual(3);
//                 box2.set('there', 'there');
//                 test.expect(count).toEqual(4);
//             }, 5);
//             test.it('and listeners on other objects with the watchOther api', function () {
//                 var count = 0;
//                 var box2 = factories.Model();
//                 box.watchOtherOnce(box2, 'there', 'there', function (e) {
//                     count++;
//                 });
//                 test.expect(count).toEqual(0);
//                 box2.set('there', 'there');
//                 test.expect(count).toEqual(1);
//                 box2.set('there', 'here');
//                 test.expect(count).toEqual(1);
//             }, 3);
//             test.it('the once handler will only take itself off when it succeeds', function () {
//                 var count = 0;
//                 var box2 = factories.Model();
//                 box.watchOtherOnce(box2, 'there', 'there', function (e) {
//                     count++;
//                 });
//                 test.expect(count).toEqual(0);
//                 box2.set('there', 'here');
//                 test.expect(count).toEqual(0);
//                 box2.set('there', 'there');
//                 test.expect(count).toEqual(1);
//                 box2.set('there', 'here');
//                 test.expect(count).toEqual(1);
//                 box2.set('there', 'there');
//                 test.expect(count).toEqual(1);
//             }, 5);
//         });
//     });
// });