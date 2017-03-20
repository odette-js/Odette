var _ = require('./utils');
var forEachEndRight = require('./for-each-end-right');
test.describe('forEachEndRight', function () {
    var numbers = [1, 2, 3, 4, 5];
    test.it('should be a function', function () {
        test.expect(forEachEndRight).toBeFunction();
    });
    test.it('iteration will proceed in reverse', function () {
        var values = [];
        forEachEndRight(numbers, function (value, index) {
            values.push(value);
        });
        test.expect(values).toEqual([5, 4, 3, 2, 1]);
    });
    test.it('iteration can be interupted', function () {
        var values = [];
        var interruptor = forEachEndRight(numbers, function (value) {
            values.push(value);
            return value === 3;
        });
        test.expect(values).toEqual([5, 4, 3]);
    });
    test.it('when interrupted, the index is returned', function () {
        var interruptor = forEachEndRight(numbers, function (number) {
            return number === 3;
        });
        test.expect(interruptor).toBe(2);
    });
    test.it('subsets of a list can be iterated through', function () {
        var values = [];
        var interruptor = forEachEndRight(numbers, function (value) {
            values.push(value);
            return value === 1;
        }, 3, 1);
        test.expect(values).toEqual([4, 3, 2]);
        test.expect(interruptor).toBeUndefined();
    }, 2);
    test.it('if ascending ranges are passed, no iterations will occur', function () {
        var values = [];
        var interruptor = forEachEndRight(numbers, function (value) {
            values.push(value);
            return value === 3;
        }, 2, 3);
        test.expect(values).toEqual([]);
        test.expect(interruptor).toBeUndefined();
    }, 2);
});