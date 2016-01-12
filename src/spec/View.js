// Specless.run(function (specless, _, extendFrom, factories, $) {
//     describe('View', function () {
//         var blank, view, $con,
//             ExtendedView = extendFrom.View({
//                 hovered: function () {},
//                 events: {
//                     'event1': function () {}
//                 },
//                 elementEvents: {
//                     click: function () {
//                         clicked = 1;
//                     },
//                     mouseover: 'hovered'
//                 }
//             }),
//             create = function () {
//                 clicked = blank;
//                 $con = _.makeEl('div').attr({
//                     id: 'view-test'
//                 });
//                 view = new ExtendedView($con);
//                 $(document.body).append($con);
//             },
//             duff = _.duff;
//         beforeEach(create);
//         afterEach(function () {
//             $con.remove();
//         });
//         it('has a domm element associated with it', function () {
//             expect(_.is(view.el, _.DOMM)).toEqual(true);
//         });
//         it('even if there\'s no element', function () {
//             var view = _.View();
//             expect(_.is(view.el, _.DOMM)).toEqual(true);
//             expect(view.el.length()).toEqual(0);
//         });
//         describe('to define an element to be associated with it, pass it one', function () {
//             it('either through the domm wrapper', function () {
//                 var view = _.View($('body'));
//                 expect(view.el.length()).toEqual(1);
//             });
//             it('or as a regular dom node', function () {
//                 var view = _.View(document.body);
//                 expect(view.el.length()).toEqual(1);
//             });
//         });
//         it('views are most helpful as a building block', function () {
//             var extended = extendFrom.View({});
//             expect(extended === factories.View).toEqual(false);
//             expect(new extended() instanceof factories.View).toEqual(true);
//         });
//         describe('views add events to elements from an object called elementEvents', function () {
//             it('by default, none are added', function () {
//                 var view = _.View(_.makeEl('div'));
//                 var data = _.associator.get(view.el.get());
//                 expect(data.events).toEqual(void 0);
//             });
//             it('but a quick change to a new constructor\'s prototype will result in an opulence of event handlers', function () {
//                 var data = _.associator.get(view.el.get());
//                 expect(data.events).not.toEqual(blank);
//                 expect(clicked).toEqual(blank);
//                 view.el.click();
//                 expect(clicked).toEqual(1);
//             });
//             it('preparses the event list, and generates a namespace, so it can take the handlers off later', function () {
//                 var data = _.associator.get(view.el.get());
//                 duff(data.events['false'].click, function (handler) {
//                     expect(handler.namespace.indexOf('delegateEvents')).not.toEqual(-1);
//                 });
//             });
//             it('can also take handlers off', function () {
//                 var handler = function () {},
//                     data = _.associator.get(view.el.get()),
//                     clicks = data.events['false'].click;
//                 view.undelegateEvents();
//                 expect(clicks.length).toEqual(0);
//                 view.delegate('click', handler);
//                 expect(clicks.length).toEqual(1);
//                 view.undelegateEvents();
//                 expect(clicks.length).toEqual(0);
//             });
//             it('will not take off handlers that it did not delegate with it\'s own namespace', function () {
//                 var handler = function () {},
//                     data = _.associator.get(view.el.get()),
//                     clicks = data.events['false'].click;
//                 view.undelegateEvents();
//                 expect(clicks.length).toEqual(0);
//                 view.el.on('click', handler);
//                 expect(clicks.length).toEqual(1);
//                 view.undelegateEvents();
//                 // will not take handlers off it it did not put it on
//                 expect(clicks.length).toEqual(1);
//                 expect(clicks[0].fn === handler).toEqual(true);
//             });
//         });
//         describe('it can also add delegated events for ui elements', function () {
//             it('every view has a ui hash', function () {
//                 expect(_.has(view, 'ui')).toEqual(true);
//             });
//             it('by default, it\'s empty', function () {
//                 expect(view.ui).toEqual({});
//             });
//             it('but it can be filled with ui DOMM references', function () {
//                 var Extendor = extendFrom.View({
//                     ui: {
//                         list: 'ul',
//                         items: 'li'
//                     }
//                 });
//                 var extendor = new Extendor(_.makeEl('div').append(_.makeEl('ul').append(_.makeEl('li'))));
//                 _.each(extendor.ui, function (domm, key) {
//                     expect(_.is(domm, _.DOMM)).toEqual(true);
//                 });
//             });
//         });
//         it('the View object also has a relative $ implementation to allow you to find with the $ as the top most element, and only look down', function () {
//             var li = _.makeEl('li');
//             var div = _.makeEl('div').append(_.makeEl('ul').append(li));
//             $(document.body).append(div);
//             var view = _.View(div);
//             expect(view.$('li').get() === li.get()).toEqual(true);
//             view.destroy();
//         });
//         it('can also destroy itself', function () {
//             var count = 0;
//             $(document.body).append(view.el);
//             view.on('cleeek', function () {});
//             _.each(view._events, function (arr) {
//                 count += arr.length;
//             });
//             expect(count).not.toEqual(0);
//             view.destroy();
//             count = 0;
//             expect(view.el.parent().length()).toEqual(0);
//             _.each(view._events, function (arr, id) {
//                 count += arr.length;
//             });
//             expect(count).toEqual(0);
//         });
//     });
// });