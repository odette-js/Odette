var _ = require('./utils');
var findKeyInRight = require('./in-right');
test.describe('findKeyInRight', function () {
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
    test.it('is a function', function () {
        test.expect(findKeyInRight).toBeFunction();
    });
    test.it('finds the key of an object', function () {
        test.expect(findKeyInRight(new Class(), function (value, key) {
            return value === 5;
        })).toBe('five');
    });
    test.it('even if the property is on the prototype', function () {
        test.expect(findKeyInRight(new Class(), function (value, key) {
            return value === 2;
        })).toBe('two');
    });
    test.it('works with arrays too', function () {
        // returns the index
        test.expect(findKeyInRight(numbers, function (number) {
            return number === 5;
        })).toBe(4);
    });
    test.it('and iterates from the right', function () {
        // returns the index
        var nums = [];
        var result = findKeyInRight(numbers, function (number) {
            nums.push(number);
            return number === 5;
        });
        test.expect(result).toBe(4);
        test.expect(nums).toEqual([9, 8, 7, 6, 5]);
    }, 2);
});