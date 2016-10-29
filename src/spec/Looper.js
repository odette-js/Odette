application.scope().run(window, function (module, app, _, factories, documentView, scopedFactories, $) {
    test.describe('Looper', function () {
        test.it('queue and deque handlers as they are asked, eliminating the need for individual request animation frame calls', function (done) {
            var count = 0;
            var id = _.AF.queue(function () {
                count++;
                if (count > 2) {
                    test.expect(count).toBe(3);
                    _.AF.dequeue(id);
                    done();
                }
            });
        }, 1);
        test.it('has a handler to synchronously iterate through it\'s handlers called run', function (done) {
            var count = 0,
                adder = 0,
                id = _.AF.queue(function () {
                    count++;
                    test.expect(count).toEqual(1 + adder);
                });
            _.AF.run();
            _.AF.queue(function () {
                count++;
                _.AF.dequeue(id);
                _.AF.dequeue();
                test.expect(count).toEqual(2 + adder);
                done();
            });
            adder = count;
            test.expect(count).toEqual(1);
        }, 4);
        test.it('uses a convenience binder to give handlers that do not have a context one', function () {
            var rebinder = function (expectant) {
                return function () {
                    test.expect(this).toBe(expectant);
                };
            };
            var boundToAF = _.AF.bind(rebinder(_.AF));
            var randomObject = {};
            var boundToRandomObject = _.AF.bind(_.bindTo(rebinder(randomObject), randomObject));
            boundToAF();
            boundToRandomObject();
        }, 2);
        test.it('has a convenience function called once', function (done) {
            var counter = 0;
            _.AF.once(function () {
                test.expect(counter).toEqual(0);
                counter++;
            });
            _.AF.queue(function () {
                counter++;
                if (counter > 2) {
                    // it is important that this is not 4
                    test.expect(counter).toEqual(3);
                    _.AF.dequeue();
                    done();
                }
            });
        }, 2);
        test.it('gives you a nice little tween function for calculating linear progressions against time', function (done) {
            var previous = 0;
            _.AF.tween(100, function (time, percent, finished) {
                if (finished) {
                    test.expect(percent > previous).toBe(true);
                    test.expect(_.isNumber(time)).toBe(true);
                    test.expect(_.isNumber(percent)).toBe(true);
                    test.expect(_.isBoolean(finished)).toBe(true);
                    done();
                }
            });
        }, 4);
        test.it('gives you a timeout function in place of settimeout', function (done) {
            var counter = 0;
            var id = _.AF.queue(function () {
                counter++;
            });
            _.AF.timeout(50, function () {
                test.expect(counter > 1).toBe(true);
                test.expect(this).toBe(_.AF);
                _.AF.dequeue(id);
                done();
            });
        }, 2);
        test.it('gives you a timeout function in place of settimeout', function (done) {
            var counter = 0;
            _.AF.interval(50, function () {
                counter++;
                test.expect(this).toBe(_.AF);
                if (counter > 1) {
                    _.AF.dequeue();
                    done();
                }
            });
        }, 2);
        test.it('will also give you closures that you can call multiple times to defer an original function, much like the _.defer method', function (done) {
            var counter = 0,
                closure = _.AF.defer(100, function () {
                    test.expect(counter).toEqual(2);
                    done();
                });
            closure();
            setTimeout(function () {
                closure();
                counter++;
            });
            closure();
            counter++;
        }, 1);
    });
});