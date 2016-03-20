application.scope().run(function (app, _, factories) {
    _.describe('WebSocket', function () {
        var socket, count = 0;
        _.beforeEach(function () {
            count = 0;
            socket = _.Socket();
            socket.connect('/echo');
        });
        _.afterEach(function () {
            socket.disconnect();
        });
        _.it('can connect', function (done) {
            _.expect(count).toEqual(0);
            var socket = _.Socket();
            socket.connect('/echo').success(function () {
                _.expect(count).toEqual(1);
                done();
            });
            count++;
        });
        _.it('can send messages', function (done) {
            socket.on('connect', function () {
                socket.emit('here', {
                    and: 'there'
                }).success(function () {
                    _.expect(count).toEqual(1);
                    done();
                });
                count++;
            });
        });
        _.it('can disconnect', function () {
            socket.on('connect', function () {
                _.expect(socket.isConnected).toEqual(true);
                socket.disconnect();
                _.expect(socket.isConnected).toEqual(false);
            });
        });
    });
});