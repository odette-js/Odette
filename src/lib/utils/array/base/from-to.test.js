var _ = require('./utils');
var fromTo = require('./from-to');
test.describe('fromTo', function () {
    var numbers = [1, 2, 3, 4, 5];
    test.it('is a function', function () {
        test.expect(fromTo).toBeFunction();
    });
    test.it('can iterate through lists', function () {
        fromTo(numbers, function (number, index, list) {
            test.expect(number).toBe(list[index]);
        }, 0, numbers.length - 1, 1);
    }, numbers.length);
    test.it('requires start and end to be passed to work properly', function () {
        var result = fromTo(numbers, function () {
            test.expect(number).toBe(list[index]);
        });
        test.expect(result).toBeUndefined();
    });
    test.it('cannot stop its iteration when a truthy value is returned', function () {
        var result = fromTo(numbers, function (number, index, list) {
            test.expect(number).toBe(list[index]);
            return number === 3;
        }, 0, numbers.length - 1, 1);
        test.expect(result).toBeUndefined();
    }, numbers.length + 1);
});