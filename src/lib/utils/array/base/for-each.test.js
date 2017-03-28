var b = require('batterie');
var _ = require('./utils');
var baseForEach = require('./for-each');
b.describe('baseForEach', function (t) {
    var numbers = [1, 2, 3, 4, 5];
    b.it('is a function', function (t) {
        t.expect(baseForEach).toBeFunction();
    });
    b.it('can iterate through lists', function (t) {
        baseForEach(numbers, function (number, index, list) {
            t.expect(number).toBe(list[index]);
        });
    }, numbers.length);
    b.it('never returns a value', function (t) {
        var result = baseForEach(numbers, function (number, index, list) {
            return true;
        });
        t.expect(result).toBeUndefined();
    });
    b.it('does not work on objects', function (t) {
        var object = {
            one: 1,
            two: 2
        };
        baseForEach(object, function (number, index, list) {
            t.expect(true).toBe(false);
        });
        t.expect(object).toBeObject();
    });
});