application.scope().run(window, function (module, app, _, factories, $) {
    test.describe('Linguistics', function () {
        var model, counter;
        test.beforeEach(function () {
            counter = 0;
            model = factories.Model();
        });
        test.it('will apply handlers when all of the conditions are met', function () {
            var linguistics = model.when('awe').isGreaterThan(1) //
                .and('awe').isLessThan(Infinity) //
                .then(function (e) {
                    test.expect(_.isObject(e)).toBe(true);
                    counter--;
                }) //
                .otherwise(function (e) {
                    test.expect(_.isObject(e)).toBe(true);
                    counter++;
                });
            // automatically updates on the next hit
            model.set({
                awe: Infinity
            });
            test.expect(counter).toBe(1);
            model.set('awe', 4);
            test.expect(counter).toBe(0);
        }, 4);
        test.it('will not apply handlers until it is told to or an event automatically triggers it', function () {
            var linguistics = model.when('this').is(true) //
                .and('that').is(false) //
                .then(function (e) {
                    test.expect(_.isObject(e)).toBe(true);
                    counter++;
                }).otherwise(function (e) {
                    test.expect(_.isObject(e)).toBe(false);
                    counter++;
                });
            test.expect(_.isObject(linguistics)).toBe(true);
            test.expect(counter).toBe(0);
            linguistics.apply();
            test.expect(counter).toBe(1);
            model.set({
                this: true
            });
            test.expect(counter).toBe(1);
            model.set({
                that: false
            });
            test.expect(counter).toBe(2);
        }, 7);
    });
});