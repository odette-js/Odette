var b = require('batterie');
var _ = require('./utils');
var forEach = require('./each');
b.describe('forEach', function () {
    var list = [];
    var numbers = [1, 2, 3, 4, 5];
    var result = forEach(numbers, function (number, index) {
        list.push(number);
        return index;
    });
    b.it('iterates to the left', [
        ['pushed the numbers to a new list in reverse order', numbers, list],
        ['the list never stops iterating even when a truthy value is returned', result, undefined]
    ]);
});