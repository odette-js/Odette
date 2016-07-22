application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.test.describe('Modules', function () {
        var level = app.module('level');
        var lower = app.module('level.lower');
        var lowered = app.module('level.lower.lowered');
        _.test.it('can have children', function () {
            _.test.expect(lower.parent === level).toEqual(true);
            _.test.expect(lower === lowered.parent).toEqual(true);
        });
        _.test.it('can access it\'s children through the exact same api', function () {
            _.test.expect(lower.module('lowered') === lowered).toEqual(true);
            _.test.expect(lower === level.module('lower')).toEqual(true);
        });
        _.test.it('can be initialized after it is created', function () {
            var count = 0;
            app.module('level.lower', function () {
                count++;
            });
            _.test.expect(count).toEqual(1);
        });
        _.test.it('passes itself into it\'s initializing functions', function () {
            var count = 0;
            app.module('lower', function (module, app_, _, factories) {
                count = 1;
                _.test.expect(module).toEqual(app.module('lower'));
                _.test.expect(app_).toEqual(app);
                _.test.expect(_).toEqual(app._);
                _.test.expect(factories).toEqual(_.factories);
            });
            _.test.expect(count).toEqual(1);
        });
        _.test.it('can have multiple generation handlers', function () {
            var count = 0;
            app.module('level', function () {
                count++;
            });
            _.test.expect(count).toEqual(1);
            app.module('level', function () {
                count += 2;
            });
            _.test.expect(count).toEqual(3);
        });
        _.test.it('can have exports (can hold data)', function () {
            level.publicize({
                one: 1,
                two: 2
            });
            _.test.expect(level.exports.one).toEqual(1);
            _.test.expect(level.exports.two).toEqual(2);
        });
        _.test.it('which is like giving public data', function () {
            var mod = app.module('newmodule', function () {
                this.publicize({
                    here: 'there'
                });
            });
            _.test.expect(app.require('newmodule').here).toEqual('there');
            _.test.expect(function () {
                app.require('somenonexistantmodule');
            }).toThrow();
        });
    });
});