application.scope().run(function (app, _, factories) {
    describe('Modules', function () {
        var level = app.module('level');
        var lower = app.module('level.lower');
        var lowered = app.module('level.lower.lowered');
        it('can have children', function () {
            expect(lower.parent === level).toEqual(true);
            expect(lower === lowered.parent).toEqual(true);
        });
        it('can access it\'s children through the exact same api', function () {
            expect(lower.module('lowered') === lowered).toEqual(true);
            expect(lower === level.module('lower')).toEqual(true);
        });
        it('can be initialized after it is created', function () {
            var count = 0;
            app.module('level.lower', function () {
                count++;
            });
            expect(count).toEqual(1);
        });
        it('passes itself into it\'s initializing functions', function () {
            var count = 0;
            app.module('lower', function (module, app_, _, factories) {
                count = 1;
                expect(module).toEqual(app.module('lower'));
                expect(app_).toEqual(app);
                expect(_).toEqual(app._);
                expect(factories).toEqual(_.factories);
            });
            expect(count).toEqual(1);
        });
        it('can only initialize itself once', function () {
            var count = 0;
            app.module('level', function () {
                count++;
            });
            expect(count).toEqual(1);
            app.module('level', function () {
                count++;
            });
            expect(count).toEqual(1);
        });
        it('can have exports (can hold data)', function () {
            level.exports({
                one: 1,
                two: 2
            });
            expect(level.get('exports').one).toEqual(1);
            expect(level.get('exports').two).toEqual(2);
        });
        it('which is like giving public data', function () {
            var mod = app.module('newmodule', function () {
                this.exports({
                    here: 'there'
                });
            });
            expect(app.require('newmodule').here).toEqual('there');
            expect(function () {
                app.require('somenonexistantmodule');
            }).toThrow();
        });
    });
});