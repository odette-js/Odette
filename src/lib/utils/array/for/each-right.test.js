var b = require('batterie');
var _ = require('./utils');
var forEachRight = require('./each-right');
b.describe('forEachRight', function () {
    var list = [];
    var numbers = [1, 2, 3, 4, 5];
    var result = forEachRight(numbers, function (number, index) {
        list.push(number);
        return index;
    });
    b.it('iterates to the right', [
        ['pushed the numbers to a new list in reverse order', numbers, list.slice(0).reverse()],
        ['the list never stops iterating even when a truthy value is returned', result, undefined]
    ]);
});