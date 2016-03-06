application.scope().run(function (app, _, factories) {
    describe('WebSocket', function () {
        var socket, count = 0;
        beforeEach(function () {
            count = 0;
            socket = _.Socket();
            socket.connect('/echo');
        });
        afterEach(function () {
            socket.disconnect();
        });
        it('can connect', function (done) {
            expect(count).toEqual(0);
            var socket = _.Socket();
            socket.connect('/echo').success(function () {
                expect(count).toEqual(1);
                done();
            });
            count++;
        });
        it('can send messages', function (done) {
            socket.on('connect', function () {
                socket.emit('here', {
                    and: 'there'
                }).success(function () {
                    expect(count).toEqual(1);
                    done();
                });
                count++;
            });
        });
        it('can disconnect', function () {
            socket.on('connect', function () {
                expect(socket.isConnected).toEqual(true);
                socket.disconnect();
                expect(socket.isConnected).toEqual(false);
            });
        });
    });
});