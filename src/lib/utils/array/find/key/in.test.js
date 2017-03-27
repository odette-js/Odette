var _ = require('./utils');
var findKeyIn = require('./in');
b.describe('findKeyIn', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 1,
        two: 2,
        three: 3
    };

    function Class() {
        this.four = 4;
        this.five = 5;
    }
    b.it('is a function', function (t) {
        t.expect(findKeyIn).toBeFunction();
    });
    b.it('finds the key of an object', function (t) {
        t.expect(findKeyIn(new Class(), function (value, key) {
            return value === 5;
        })).toBe('five');
    });
    b.it('even if the property is on the prototype', function (t) {
        t.expect(findKeyIn(new Class(), function (value, key) {
            return value === 2;
        })).toBe('two');
    });
    b.it('works with arrays too', function (t) {
        // returns the index
        t.expect(findKeyIn(numbers, function (number) {
            return number === 5;
        })).toBe(4);
    });
    b.it('and iterates from the right', function (t) {
        // returns the index
        var nums = [];
        var result = findKeyIn(numbers, function (number) {
            nums.push(number);
            return number === 5;
        });
        t.expect(result).toBe(4);
        t.expect(nums).toEqual([1, 2, 3, 4, 5]);
    }, 2);
});