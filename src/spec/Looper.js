application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Looper', function () {
        _.test.it('queue and deque handlers as they are asked, eliminating the need for individual request animation frame calls', function (done) {
            var count = 0;
            var id = _.AF.queue(function () {
                count++;
                if (count > 2) {
                    _.AF.dequeue(id);
                    done();
                }
            });
        });
        _.test.it('has a handler to synchronously iterate through it\'s handlers called run', function (done) {
            var count = 0,
                adder = 0,
                id = _.AF.queue(function () {
                    count++;
                    _.test.expect(count).toEqual(1 + adder);
                });
            _.AF.run();
            _.AF.queue(function () {
                count++;
                _.AF.dequeue(id);
                _.AF.dequeue();
                _.test.expect(count).toEqual(2 + adder);
                done();
            });
            adder = count;
            _.test.expect(count).toEqual(1);
        });
        _.test.it('uses a convenience binder to give handlers that do not have a context one', function () {
            var rebinder = function (expectant) {
                return function () {
                    _.test.expect(this).toBe(expectant);
                };
            };
            var boundToAF = _.AF.bind(rebinder(_.AF));
            var randomObject = {};
            var boundToRandomObject = _.AF.bind(_.bindTo(rebinder(randomObject), randomObject));
            boundToAF();
            boundToRandomObject();
        });
        _.test.it('has a convenience function called once', function (done) {
            var counter = 0;
            _.AF.once(function () {
                _.test.expect(counter).toEqual(0);
                counter++;
            });
            _.AF.queue(function () {
                counter++;
                if (counter > 2) {
                    // it is important that this is not 4
                    _.test.expect(counter).toEqual(3);
                    _.AF.dequeue();
                    done();
                }
            });
        });
        _.test.it('gives you a nice little tween function for calculating linear progressions against time', function () {
            var previous = 0;
            _.AF.tween(100, function (time, percent, finished) {
                _.test.expect(percent > previous).toBe(true);
                _.test.expect(_.isNumber(time)).toBe(true);
                _.test.expect(_.isNumber(percent)).toBe(true);
                _.test.expect(_.isBoolean(finished)).toBe(true);
                previous = percent;
                if (finished) {
                    _.AF.dequeue();
                    done();
                }
            });
        });
        _.test.it('gives you a timeout function in place of settimeout', function (done) {
            var counter = 0;
            var id = _.AF.queue(function () {
                counter++;
            });
            _.AF.timeout(50, function () {
                _.test.expect(counter > 1).toBe(true);
                _.test.expect(this).toBe(_.AF);
                _.AF.dequeue(id);
                done();
            });
        });
        _.test.it('gives you a timeout function in place of settimeout', function (done) {
            var counter = 0;
            _.AF.interval(50, function () {
                counter++;
                _.test.expect(this).toBe(_.AF);
                if (counter > 1) {
                    _.AF.dequeue();
                    done();
                }
            });
        });
        _.test.it('will also give you closures that you can call multiple times to defer an original function, much like the _.defer method', function (done) {
            var counter = 0,
                closure = _.AF.defer(100, function () {
                    _.test.expect(counter).toEqual(2);
                    done();
                });
            closure();
            setTimeout(function () {
                closure();
                counter++;
            });
            closure();
            counter++;
        });
    });
});