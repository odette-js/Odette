var _ = require('./utils');
var concatUnique = require('./unique');
test.describe('concatUnique', function () {
    test.it('concatenates different values', function () {
        test.expect(concatUnique([
            [1, 2, 3],
            [1, 2, 3]
        ])).toEqual([1, 2, 3]);
    });
    test.it('does not do a deep diff on objects', function () {
        var two = {
            two: 2
        };
        test.expect(concatUnique([
            [{
                one: 1
            }, two],
            [{
                one: 1
            }, two]
        ])).toEqual([{
            one: 1
        }, two, {
            one: 1
        }]);
    });
});