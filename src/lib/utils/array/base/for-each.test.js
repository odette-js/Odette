var _ = require('./utils');
var baseForEach = require('./for-each');
test.describe('baseForEach', function () {
    var numbers = [1, 2, 3, 4, 5];
    test.it('is a function', function () {
        test.expect(baseForEach).toBeFunction();
    });
    test.it('can iterate through lists', function () {
        baseForEach(numbers, function (number, index, list) {
            test.expect(number).toBe(list[index]);
        });
    }, numbers.length);
    test.it('never returns a value', function () {
        var result = baseForEach(numbers, function (number, index, list) {
            return true;
        });
        test.expect(result).toBeUndefined();
    });
    test.it('does not work on objects', function () {
        var object = {
            one: 1,
            two: 2
        };
        baseForEach(object, function (number, index, list) {
            test.expect(true).toBe(false);
        });
        test.expect(object).toBeObject();
    });
});