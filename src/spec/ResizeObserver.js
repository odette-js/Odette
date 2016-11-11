application.scope().run(window, function (module, app, _, factories, documentView, scopedFactories, $) {
    test.describe('ResizeObserver', function () {
        var div, ro, count, counter = 0,
            setDivCss = function (argument) {
                div.css(argument);
            };
        test.beforeEach(function () {
            count = 0;
            div = $.createElement('div');
            $('body').append(div);
            counter++;
        });
        test.afterEach(function () {
            div.destroy();
            ro.disconnect();
        });
        test.it('watches elements with the observe method', function (done) {
            ro = $.ResizeObserver(function (observations) {
                test.expect(observations).toBeArrayLike();
                done();
            });
            test.expect(_.isObject(ro)).toBe(true);
            ro.observe(div.element());
            setDivCss({
                height: 1
            });
        }, 2);
        test.it('stops watching elements with the unobserve method', function (done) {
            ro = $.ResizeObserver(function (observations) {
                test.expect(observations).toBeArrayLike();
                count++;
                setTimeout(next);
                next = null;
                setTimeout(anticheck, 50);
            });
            var anticheck = function () {
                test.expect(count).toBe(1);
                done();
            };
            var next = function () {
                ro.unobserve(div.element());
                setDivCss({
                    height: 2
                });
            };
            ro.observe(div.element());
            setDivCss({
                height: 1
            });
        }, 2);
        test.it('even does so synchronously', function (done) {
            ro = $.ResizeObserver(function (observations) {
                test.expect(observations).toBeArrayLike();
                count++;
                next();
                setTimeout(anticheck, 50);
            });
            var anticheck = function () {
                test.expect(count).toBe(1);
                done();
            };
            var next = function () {
                next = function () {};
                ro.unobserve(div.element());
                setDivCss({
                    height: 2
                });
            };
            ro.observe(div.element());
            setDivCss({
                height: 1
            });
        }, 2);
        test.it('will trigger anytime there is a change on an element it is observing, indefinitely', function (done) {
            ro = $.ResizeObserver(function (observations) {
                count++;
                test.expect(observations).toBeArrayLike();
                test.expect(observations.length).toBe(1);
                if (count === 10) {
                    // stop and finish
                    ro.unobserve(div.element());
                    return done();
                }
                setTimeout(function () {
                    setDivCss({
                        height: count
                    });
                });
            });
            ro.observe(div.element());
            setDivCss({
                height: 1000
            });
        }, 20);
        test.it('will trigger whenever any of the elements it is observing changes', function (done) {
            var div2 = $.createElement('div');
            var targets = [div.element(), div2.element()];
            ro = $.ResizeObserver(function (observations) {
                _.duff(observations, function (observation, index) {
                    var shouldbe = targets[count + index];
                    test.expect(observation.target).toBe(shouldbe);
                });
                if (count) {
                    test.expect(observations.length).toBe(1);
                    ro.unobserve(div.element());
                    ro.unobserve(div2.element());
                    return setTimeout(function () {
                        div2.destroy();
                        done();
                    });
                } else {
                    test.expect(observations.length).toBe(2);
                }
                count++;
                setTimeout(function () {
                    div2.css({
                        height: 2
                    });
                });
            });
            ro.observe(div.element());
            ro.observe(div2.element());
            $('body').append(div2);
            setDivCss({
                height: 1000
            });
        }, 5);
        test.it('can trigger in response to multiple elements changing', function (done) {
            var div2 = $.createElement('div');
            $('body').append(div2);
            var targets = [div.element(), div2.element()];
            ro = $.ResizeObserver(function (observations) {
                _.duff(observations, function (observation, idx) {
                    var shouldbe = targets[idx];
                    test.expect(observation.target).toBe(shouldbe);
                });
                test.expect(observations.length).toBe(2);
                ro.unobserve(div.element());
                ro.unobserve(div2.element());
                div2.destroy();
                done();
            });
            ro.observe(div.element());
            ro.observe(div2.element());
            setDivCss({
                height: 1000
            });
            div2.css({
                height: 2
            });
        }, 3);
        test.it('will only add an element to the queue once', function (done) {
            ro = $.ResizeObserver(function () {
                count++;
                setTimeout(function () {
                    test.expect(count).toBe(1);
                    done();
                });
            });
            ro.observe(div.element());
            ro.observe(div.element());
            ro.observe(div.element());
            div.css({
                height: 1
            });
        }, 1);
    });
});