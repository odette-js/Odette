application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('WebSocket', function () {
        var socket, count = 0;
        _.test.beforeEach(function () {
            count = 0;
            socket = _.Socket();
            socket.connect('/echo');
        });
        _.test.afterEach(function () {
            socket.disconnect();
        });
        _.test.it('can connect', function (done) {
            _.test.expect(count).toEqual(0);
            var socket = _.Socket();
            socket.connect('/echo').success(function () {
                _.test.expect(count).toEqual(1);
                done();
            });
            count++;
        });
        _.test.it('can send messages', function (done) {
            socket.on('connect', function () {
                socket.emit('here', {
                    and: 'there'
                }).success(function () {
                    _.test.expect(count).toEqual(1);
                    done();
                });
                count++;
            });
        });
        _.test.it('can disconnect', function () {
            socket.on('connect', function () {
                _.test.expect(socket.isConnected).toEqual(true);
                socket.disconnect();
                _.test.expect(socket.isConnected).toEqual(false);
            });
        });
    });
});