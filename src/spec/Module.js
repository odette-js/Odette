// application.scope().run(window, function (module, app, _, factories, $) {
//     test.describe('Modules', function () {
//         var level = app.module('level');
//         var lower = app.module('level.lower');
//         var lowered = app.module('level.lower.lowered');
//         test.it('can have children', function () {
//             test.expect(lower.parent() === level).toEqual(true);
//             test.expect(lower === lowered.parent()).toEqual(true);
//         }, 2);
//         test.it('can access it\'s children through the exact same api', function () {
//             test.expect(lower.module('lowered') === lowered).toEqual(true);
//             test.expect(lower === level.module('lower')).toEqual(true);
//         }, 2);
//         test.it('can be initialized after it is created', function () {
//             var count = 0;
//             app.module('level.lower', function () {
//                 count++;
//             });
//             test.expect(count).toEqual(1);
//         }, 1);
//         test.it('passes itself into it\'s initializing functions', function () {
//             var count = 0;
//             app.module('lower', function (module, app_, _, factories) {
//                 count = 1;
//                 test.expect(module).toEqual(app.module('lower'));
//                 test.expect(app_).toEqual(app);
//                 test.expect(_).toEqual(app._);
//                 test.expect(factories).toEqual(app.factories);
//             });
//             test.expect(count).toEqual(1);
//         }, 5);
//         test.it('can have multiple generation handlers', function () {
//             var count = 0;
//             app.module('level', function () {
//                 count++;
//             });
//             test.expect(count).toEqual(1);
//             app.module('level', function () {
//                 count += 2;
//             });
//             test.expect(count).toEqual(3);
//         }, 2);
//         test.it('can have exports (can hold data)', function () {
//             level.publicize({
//                 one: 1,
//                 two: 2
//             });
//             test.expect(level.exports.one).toEqual(1);
//             test.expect(level.exports.two).toEqual(2);
//         }, 2);
//         test.it('which is like giving public data', function () {
//             var mod = app.module('newmodule', function () {
//                 this.publicize({
//                     here: 'there'
//                 });
//             });
//             test.expect(app.require('newmodule').here).toEqual('there');
//             test.expect(function () {
//                 app.require('somenonexistantmodule');
//             }).toThrow();
//         }, 2);
//     });
// });