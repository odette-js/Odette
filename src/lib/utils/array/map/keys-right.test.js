var b = require('batterie');
var mapKeysRight = require('./keys-right');
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
b.describe('mapKeysRight', function () {
    b.it('iterates', [
        ['over arrays', mapKeysRight(numbers, minus1), [1, 2, 3]],
        ['over arraylike objects', mapKeysRight(numbersLike, minus1), [1, 2, 3]],
        ['it just replaces the key', mapKeysRight(numbers, function (value) {
            return value + 1;
        }), [undefined, undefined, 1, 2, 3]],
        ['even objects', mapKeysRight(object, function (value) {
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