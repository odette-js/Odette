var _ = require('./utils');
var fromToEnd = require('./from-to-end');
test.describe('fromToEnd', function () {
    var numbers = [1, 2, 3, 4, 5];
    test.it('is a function', function () {
        test.expect(fromToEnd).toBeFunction();
    });
    test.it('can iterate through lists', function () {
        fromToEnd(numbers, function (number, index, list) {
            test.expect(number).toBe(list[index]);
        }, 0, numbers.length - 1, 1);
    }, numbers.length);
    test.it('requires start and end to be passed to work properly', function () {
        var res1 = fromToEnd();
        var res2 = fromToEnd(numbers, function (number) {
            return number === 3;
        }, 0, numbers.length - 1, 1);
        test.expect(res1).toBeUndefined();
        test.expect(res2).toBe(2);
    }, 2);
    test.it('can stop its iteration when a truthy value is returned', function () {
        var result = fromToEnd(numbers, function (number, index, list) {
            return number === 3;
        }, 0, numbers.length - 1, 1);
        test.expect(result).toBe(2);
    });
    test.it('can stop its iteration with the range start and end values', function () {
        var counter = 0;
        var result = fromToEnd(numbers, function (number, index, list) {
            counter++;
            return number === 5;
        }, 1, 3, 1);
        test.expect(counter).toBe(3);
        test.expect(result).toBeUndefined();
    }, 2);
});