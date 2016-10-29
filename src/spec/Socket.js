// application.scope().run(window, function (module, app, _, factories, documentView, scopedFactories, $) {
//     test.describe('WebSocket', function () {
//         var socket, count = 0;
//         test.beforeEach(function () {
//             count = 0;
//             socket = _.Socket();
//             socket.connect('/echo');
//         });
//         test.afterEach(function () {
//             socket.disconnect();
//         });
//         test.it('can connect', function (done) {
//             test.expect(count).toEqual(0);
//             var socket = _.Socket();
//             socket.connect('/echo').success(function () {
//                 test.expect(count).toEqual(1);
//                 done();
//             });
//             count++;
//         });
//         test.it('can send messages', function (done) {
//             socket.on('connect', function () {
//                 socket.emit('here', {
//                     and: 'there'
//                 }).success(function () {
//                     test.expect(count).toEqual(1);
//                     done();
//                 });
//                 count++;
//             });
//         });
//         test.it('can disconnect', function () {
//             socket.on('connect', function () {
//                 test.expect(socket.isConnected).toEqual(true);
//                 socket.disconnect();
//                 test.expect(socket.isConnected).toEqual(false);
//             });
//         });
//     });
// });