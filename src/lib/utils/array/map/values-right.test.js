var b = require('batterie');
var mapValuesRight = require('./values-right');
var numbers = [1, 2, 3];
var numbersLike = {
    '0': 1,
    '1': 2,
    '2': 3,
    length: 3
};
var object = {
    '0': 1,
    '1': 2,
    '2': 3
};
b.describe('mapValuesRight', function () {
    b.it('iterates', [
        ['over arrays', mapValuesRight(numbers, minus1), [2, 1, 0]],
        ['over arraylike objects', mapValuesRight(numbersLike, minus1), [2, 1, 0]],
        ['it just replaces the key', mapValuesRight(numbers, function (value) {
            return value + 1;
        }), [4, 3, 2]],
        ['even objects', mapValuesRight(object, function (value) {
            return value;
        }), {
            '0': 1,
            '1': 2,
            '2': 3
        }]
    ]);
});

function minus1(value) {
    return value - 1;
}