var b = require('batterie');
var mapValues = require('./values');
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
b.describe('mapValues', function () {
    b.it('iterates', [
        ['over arrays', mapValues(numbers, minus1), [0, 1, 2]],
        ['over arraylike objects', mapValues(numbersLike, minus1), [0, 1, 2]],
        ['it just replaces the key', mapValues(numbers, function (value) {
            return value + 1;
        }), [2, 3, 4]],
        ['even objects', mapValues(object, function (value) {
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