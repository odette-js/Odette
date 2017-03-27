var _ = require('./utils');
var fromToEnd = require('./from-to-end');
b.describe('fromToEnd', function () {
    var numbers = [1, 2, 3, 4, 5];
    b.it('is a function', function (t) {
        t.expect(fromToEnd).toBeFunction();
    });
    b.it('can iterate through lists', function (t) {
        fromToEnd(numbers, function (number, index, list) {
            t.expect(number).toBe(list[index]);
        }, 0, numbers.length - 1, 1);
    }, numbers.length);
    b.it('requires start and end to be passed to work properly', function (t) {
        var res1 = fromToEnd();
        var res2 = fromToEnd(numbers, function (number) {
            return number === 3;
        }, 0, numbers.length - 1, 1);
        t.expect(res1).toBeUndefined();
        t.expect(res2).toBe(2);
    }, 2);
    b.it('can stop its iteration when a truthy value is returned', function (t) {
        var result = fromToEnd(numbers, function (number, index, list) {
            return number === 3;
        }, 0, numbers.length - 1, 1);
        t.expect(result).toBe(2);
    });
    b.it('can stop its iteration with the range start and end values', function (t) {
        var counter = 0;
        var result = fromToEnd(numbers, function (number, index, list) {
            counter++;
            return number === 5;
        }, 1, 3, 1);
        t.expect(counter).toBe(3);
        t.expect(result).toBeUndefined();
    }, 2);
});