application.scope().run(function (app, _) {
    _.describe('evaluate needs it\'s own space to be tested', function () {
        var windo = _.factories.Window(window);
        _.it('_.evaluate', function (done) {
            windo.done = done;
            _.expect(function () {
                _.evaluate(windo, function () {
                    var count = 0;
                    var called = 0;
                    var check = function () {
                        ++count;
                        if (count < called) {
                            return;
                        }
                        done();
                    };
                    var fn = function () {
                        console.log(this);
                        console.log(window);
                    };
                    console.log(this);
                    console.log(window);
                    fn();
                    called++;
                    setTimeout(function () {
                        console.log(this);
                        console.log(window);
                        fn();
                        check();
                    });
                    called++;
                    requestAnimationFrame(function () {
                        console.log(this);
                        console.log(window);
                        fn();
                        check();
                    });
                });
            }).not.toThrow();
            _.expect(function () {
                _.evaluate(windo, function () {
                    glob = function () {
                        console.log(this);
                        console.log(window);
                    };
                });
            }).toThrow();
        });
    });
});