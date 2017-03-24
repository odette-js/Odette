var _ = require('./utils');
var accessor = require('./accessor');
test.describe('accessor', function () {
    test.it('is a function', function () {
        test.expect(accessor).toBeFunction();
    });
    test.it('creates a curry which subsequently accesses the original object', function () {
        var accessing = accessor(function (list, iterator) {
            return 0;
        });
        test.expect(accessing([1], _.noop)).toBe(1);
    });
    test.it('works the same way with object keys', function () {
        var accessing = accessor(function (list, iterator) {
            return 'key';
        });
        test.expect(accessing({
            key: 'value'
        }, _.noop)).toBe('value');
    });
    test.it('always returns undefined when given null', function () {
        var accessing = accessor(function () {
            return null;
        });
        test.expect(accessing([1], _.noop)).toBeUndefined();
        test.expect(accessing({
            'null': true
        }, _.noop)).toBeUndefined();
    }, 2);
    test.it('always returns undefined when given undefined', function () {
        var accessing = accessor(function () {
            return undefined;
        });
        test.expect(accessing([1], _.noop)).toBeUndefined();
        test.expect(accessing({
            'undefined': true
        }, _.noop)).toBeUndefined();
    }, 2);
    test.it('returns undefined when given -1 with an array', function () {
        var accessing = accessor(function () {
            return undefined;
        });
        test.expect(accessing([1], _.noop)).toBeUndefined();
    });
    test.it('returns the value when accessing an object', function () {
        var accessing = accessor(function () {
            return -1;
        });
        test.expect(accessing({
            '-1': true
        }, _.noop)).toBeTrue();
    });
});