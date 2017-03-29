var b = require('batterie');
var _ = require('./utils');
var forEachEndRight = require('./for-each-end-right');
b.describe('forEachEndRight', function () {
    var numbers = [1, 2, 3, 4, 5];
    b.it('should be a function', function (t) {
        t.expect(forEachEndRight).toBeFunction();
    });
    b.it('iteration will proceed in reverse', function (t) {
        var values = [];
        forEachEndRight(numbers, function (value, index) {
            values.push(value);
        });
        t.expect(values).toEqual([5, 4, 3, 2, 1]);
    });
    b.it('iteration can be interupted', function (t) {
        var values = [];
        var interruptor = forEachEndRight(numbers, function (value) {
            values.push(value);
            return value === 3;
        });
        t.expect(values).toEqual([5, 4, 3]);
    });
    b.it('when interrupted, the index is returned', function (t) {
        var interruptor = forEachEndRight(numbers, function (number) {
            return number === 3;
        });
        t.expect(interruptor).toBe(2);
    });
    b.it('subsets of a list can be iterated through', function (t) {
        var values = [];
        var interruptor = forEachEndRight(numbers, function (value) {
            values.push(value);
            return value === 1;
        }, 3, 1);
        t.expect(values).toEqual([4, 3, 2]);
        t.expect(interruptor).toBe(-1);
    }, 2);
    b.it('if ascending ranges are passed, no iterations will occur', function (t) {
        var values = [];
        var interruptor = forEachEndRight(numbers, function (value) {
            values.push(value);
            return value === 3;
        }, 2, 3);
        t.expect(values).toEqual([]);
        t.expect(interruptor).toBe(-1);
    }, 2);
});