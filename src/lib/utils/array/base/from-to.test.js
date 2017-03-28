var b = require('batterie');
var _ = require('./utils');
var fromTo = require('./from-to');
b.describe('fromTo', function (t) {
    var numbers = [1, 2, 3, 4, 5];
    b.it('is a function', function (t) {
        t.expect(fromTo).toBeFunction();
    });
    b.it('can iterate through lists', function (t) {
        fromTo(numbers, function (number, index, list) {
            t.expect(number).toBe(list[index]);
        }, 0, numbers.length - 1, 1);
    }, numbers.length);
    b.it('requires start and end to be passed to work properly', function (t) {
        var result = fromTo(numbers, function () {
            t.expect(number).toBe(list[index]);
        });
        t.expect(result).toBeUndefined();
    });
    b.it('cannot stop its iteration when a truthy value is returned', function (t) {
        var result = fromTo(numbers, function (number, index, list) {
            t.expect(number).toBe(list[index]);
            return number === 3;
        }, 0, numbers.length - 1, 1);
        t.expect(result).toBeUndefined();
    }, numbers.length + 1);
});