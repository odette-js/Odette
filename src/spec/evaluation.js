// application.scope().run(function (app, _) {
//     _.describe('evaluate needs it\'s own space to be tested', function () {
//         var windo = _.factories.Window(window);
//         _.it('_.evaluate', function (done) {
//             windo._ = _;
//             windo.done = done;
//             windo.console.log = function (comparison) {
//                 // replace windo with a custom log function
//                 _.expect(comparison).not.toBe(window);
//             };
//             _.expect(function () {
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
//             _.expect(function () {
//                 _.evaluate(windo, function () {
//                     glob = function () {
//                         console.log(this);
//                         console.log(window);
//                     };
//                 });
//             }).toThrow();
//             _.expect(function () {
//                 _.evaluate(windo, function () {
//                     // remove ability to use Function Constructors if we can't get rid of eval
//                     eval('var fn = new Function.constructor("console.log(this);");fn();');
//                 });
//             }).toThrow();
//             _.expect(_.evaluate(windo, function () {
//                 var cachedInnerHeight = innerHeight;
//                 delete window.innerHeight;
//                 _.expect(window.innerHeight).toEqual(void 0);
//                 _.expect(innerHeight).toEqual(cachedInnerHeight);
//                 return innerHeight;
//             })).toEqual(void 0);
//         });
//     });
// });