// application.scope().run(window, function (module, app, _, factories, $) {
//     test.describe('Promise', function () {
//         var madeit, promise, handler = function () {
//             madeit++;
//         };
//         test.beforeEach(function () {
//             madeit = 0;
//         });
//         test.it('allows for contained async nature', function (done) {
//             _.Promise(function (success, failure) {
//                 setTimeout(function () {
//                     handler();
//                     success();
//                 });
//             }).then(function () {
//                 test.expect(madeit).toEqual(1);
//                 done();
//             });
//         }, 1);
//         test.it('passes results from the original promise to the next one', function (done) {
//             _.Promise(function (success, failure) {
//                 setTimeout(function () {
//                     success(3);
//                 });
//             }).then(function (result) {
//                 test.expect(result).toEqual(3);
//                 done();
//             });
//         }, 1);
//         test.it('passes results from the original promise to the next one', function (done) {
//             _.Promise(function (success, failure) {
//                 setTimeout(function () {
//                     success(3);
//                 });
//             }).then(function (result) {
//                 return result * result;
//             }).then(function (result) {
//                 test.expect(result).toEqual(9);
//                 done();
//             });
//         }, 1);
//         test.it('allows for thens after a catch', function (done) {
//             _.Promise(function (s) {
//                 // async process
//                 s(1);
//             }).then(function () {
//                 throw new Error("invalid result detected");
//             }).catch(function (e) {
//                 test.expect(e).toBeObject();
//                 test.expect(e.message).toBe("invalid result detected");
//                 return "default value";
//             }).then(function (result) {
//                 test.expect(result).toEqual("default value"); // true
//                 done();
//             });
//         }, 3);
//     });
// });