var _ = require('./utils');
var findIn = require('./in');
test.describe('findIn', function () {
    var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    Class.prototype = {
        one: 5,
        two: 10,
        three: 15,
        four: 20
    };

    function Class() {
        this.one = 1;
        this.two = 2;
        this.five = 'fiver';
    }
    test.it('is a function', function () {
        test.expect(findIn).toBeFunction();
    });
    test.it('iterates through lists in reverse', function () {
        var list = [];
        findIn(numbers, function (value) {
            list.push(value);
        });
        test.expect(list).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    test.it('can be stopped by returning a truthy value', function () {
        var list = [];
        var value = findIn(numbers, function (number) {
            list.push(number);
            return number === 5;
        });
        test.expect(value).toEqual(5);
        test.expect(list).toEqual([1, 2, 3, 4, 5]);
    }, 2);
    test.it('works with objects', function () {
        var keys = [];
        var value = findIn(new Class(), function (number, key) {
            keys.push(key);
        });
        test.expect(value).toBeUndefined();
        test.expect(_.contains(keys, 'one')).toBeTrue();
        test.expect(_.contains(keys, 'two')).toBeTrue();
        test.expect(_.contains(keys, 'three')).toBeTrue();
        test.expect(_.contains(keys, 'four')).toBeTrue();
        test.expect(_.contains(keys, 'five')).toBeTrue();
    }, 6);
    test.it('can also stop early when iterating over an object', function () {
        var keys = [];
        var value = findIn(new Class(), function (value, key) {
            keys.push(key);
            return value === 15;
        });
        test.expect(keys.length).not.toBeGreaterThan(4);
        test.expect(value).toBe(15);
    }, 2);
});