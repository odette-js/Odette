// application.scope().run(function (app, _) {
//     test.describe('evaluate needs it\'s own space to be tested', function () {
//         var windo = _.factories.Window(window);
//         test.it('_.evaluate', function (done) {
//             windo._ = _;
//             windo.done = done;
//             windo.console.log = function (comparison) {
//                 // replace windo with a custom log function
//                 test.expect(comparison).not.toBe(window);
//             };
//             test.expect(function () {
//                 _.evaluate(windo, function () {
//                     var count = 0;
//                     var called = 0;
//                     var check = function () {
//                         ++count;
//                         if (count < called) {
//                             return;
//                         }
//                         done();
//                     };
//                     var fn = function () {
//                         console.log(this);
//                         console.log(window);
//                     };
//                     console.log(this);
//                     console.log(window);
//                     fn();
//                     called++;
//                     setTimeout(function () {
//                         console.log(this);
//                         console.log(window);
//                         fn();
//                         check();
//                     });
//                     called++;
//                     requestAnimationFrame(function () {
//                         console.log(this);
//                         console.log(window);
//                         fn();
//                         check();
//                     });
//                 });
//             }).not.toThrow();
//             test.expect(function () {
//                 _.evaluate(windo, function () {
//                     glob = function () {
//                         console.log(this);
//                         console.log(window);
//                     };
//                 });
//             }).toThrow();
//             test.expect(function () {
//                 _.evaluate(windo, function () {
//                     // remove ability to use Function Constructors if we can't get rid of eval
//                     eval('var fn = new Function.constructor("console.log(this);");fn();');
//                 });
//             }).toThrow();
//             test.expect(_.evaluate(windo, function () {
//                 var cachedInnerHeight = innerHeight;
//                 delete window.innerHeight;
//                 test.expect(window.innerHeight).toEqual(void 0);
//                 test.expect(innerHeight).toEqual(cachedInnerHeight);
//                 return innerHeight;
//             })).toEqual(void 0);
//         });
//     });
// });