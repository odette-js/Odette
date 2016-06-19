application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    _.describe('Modules', function () {
        var level = app.module('level');
        var lower = app.module('level.lower');
        var lowered = app.module('level.lower.lowered');
        _.it('can have children', function () {
            _.expect(lower.parent === level).toEqual(true);
            _.expect(lower === lowered.parent).toEqual(true);
        });
        _.it('can access it\'s children through the exact same api', function () {
            _.expect(lower.module('lowered') === lowered).toEqual(true);
            _.expect(lower === level.module('lower')).toEqual(true);
        });
        _.it('can be initialized after it is created', function () {
            var count = 0;
            app.module('level.lower', function () {
                count++;
            });
            _.expect(count).toEqual(1);
        });
        _.it('passes itself into it\'s initializing functions', function () {
            var count = 0;
            app.module('lower', function (module, app_, _, factories) {
                count = 1;
                _.expect(module).toEqual(app.module('lower'));
                _.expect(app_).toEqual(app);
                _.expect(_).toEqual(app._);
                _.expect(factories).toEqual(_.factories);
            });
            _.expect(count).toEqual(1);
        });
        _.it('can have multiple generation handlers', function () {
            var count = 0;
            app.module('level', function () {
                count++;
            });
            _.expect(count).toEqual(1);
            app.module('level', function () {
                count += 2;
            });
            _.expect(count).toEqual(3);
        });
        _.it('can have exports (can hold data)', function () {
            level.publicize({
                one: 1,
                two: 2
            });
            _.expect(level.exports.one).toEqual(1);
            _.expect(level.exports.two).toEqual(2);
        });
        _.it('which is like giving public data', function () {
            var mod = app.module('newmodule', function () {
                this.publicize({
                    here: 'there'
                });
            });
            _.expect(app.require('newmodule').here).toEqual('there');
            _.expect(function () {
                app.require('somenonexistantmodule');
            }).toThrow();
        });
    });
});