var b = require('batterie');
var mapKeys = require('./keys');
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
b.describe('mapKeys', function () {
    b.it('iterates', [
        ['over arrays', mapKeys(numbers, minus1), [1, 2, 3]],
        ['over arraylike objects', mapKeys(numbersLike, minus1), [1, 2, 3]],
        ['it just replaces the key', mapKeys(numbers, function (value) {
            return value + 1;
        }), [undefined, undefined, 1, 2, 3]],
        ['even objects', mapKeys(object, function (value) {
            return value;
        }), {
            '1': 1,
            '2': 2,
            '3': 3
        }]
    ]);
});

function minus1(value) {
    return value - 1;
}