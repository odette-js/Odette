var _ = require('./utils');
var forEachEnd = require('./for-each-end');
b.describe('forEachEnd', function () {
    var numbers = [1, 2, 3, 4, 5];
    b.it('is a function', function (t) {
        t.expect(forEachEnd).toBeFunction();
    });
    b.it('can iterate through lists', function (t) {
        var values = [];
        forEachEnd(numbers, function (value) {
            values.push(value * 2);
        });
        t.expect(values).toEqual([2, 4, 6, 8, 10]);
    });
    b.it('is interruptable by returning a truthy value', function (t) {
        var values = [];
        var value = forEachEnd(numbers, function (value) {
            values.push(value);
            return value === 3;
        });
        t.expect(values).toEqual([1, 2, 3]);
    });
    b.it('returns the index when it is interrupted', function (t) {
        var value = forEachEnd(numbers, function (number) {
            return number >= 3;
        });
        t.expect(value).toBe(2);
    });
    b.it('can iterate over a subset', function (t) {
        var values = [];
        forEachEnd(numbers, function (number) {
            values.push(number);
        }, 1, 3);
        t.expect(values).toEqual([2, 3, 4]);
    });
    b.it('can be interrupted when iterating over a subset', function (t) {
        var values = [];
        var value = forEachEnd(numbers, function (number) {
            values.push(number);
            return number === 3;
        }, 1, 3);
        t.expect(values).toEqual([2, 3]);
        t.expect(value).toBe(2);
    }, 2);
    b.it('will not iterate if numbers are reversed', function (t) {
        var values = [];
        var value = forEachEnd(numbers, function (number) {
            values.push(number);
            return number === 3;
        }, 3, 1);
        t.expect(values).toEqual([]);
        t.expect(value).toBeUndefined();
    }, 2);
    b.it('can also have custom steps', function (t) {
        var values = [];
        forEachEnd(numbers, function (number) {
            values.push(number);
        }, null, null, 2);
        t.expect(values).toEqual([1, 3, 5]);
    });
});