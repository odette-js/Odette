var _ = require('./utils');
var forEachEnd = require('./for-each-end');
test.describe('forEachEnd', function () {
    var numbers = [1, 2, 3, 4, 5];
    test.it('is a function', function () {
        test.expect(forEachEnd).toBeFunction();
    });
    test.it('can iterate through lists', function () {
        var values = [];
        forEachEnd(numbers, function (value) {
            values.push(value * 2);
        });
        test.expect(values).toEqual([2, 4, 6, 8, 10]);
    });
    test.it('is interruptable by returning a truthy value', function () {
        var values = [];
        var value = forEachEnd(numbers, function (value) {
            values.push(value);
            return value === 3;
        });
        test.expect(values).toEqual([1, 2, 3]);
    });
    test.it('returns the index when it is interrupted', function () {
        var value = forEachEnd(numbers, function (number) {
            return number >= 3;
        });
        test.expect(value).toBe(2);
    });
    test.it('can iterate over a subset', function () {
        var values = [];
        forEachEnd(numbers, function (number) {
            values.push(number);
        }, 1, 3);
        test.expect(values).toEqual([2, 3, 4]);
    });
    test.it('can be interrupted when iterating over a subset', function () {
        var values = [];
        var value = forEachEnd(numbers, function (number) {
            values.push(number);
            return number === 3;
        }, 1, 3);
        test.expect(values).toEqual([2, 3]);
        test.expect(value).toBe(2);
    }, 2);
    test.it('will not iterate if numbers are reversed', function () {
        var values = [];
        var value = forEachEnd(numbers, function (number) {
            values.push(number);
            return number === 3;
        }, 3, 1);
        test.expect(values).toEqual([]);
        test.expect(value).toBeUndefined();
    }, 2);
    test.it('can also have custom steps', function () {
        var values = [];
        forEachEnd(numbers, function (number) {
            values.push(number);
        }, null, null, 2);
        test.expect(values).toEqual([1, 3, 5]);
    });
});