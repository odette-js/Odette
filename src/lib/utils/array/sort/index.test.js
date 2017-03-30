var b = require('batterie');
var sort = require('.');
var numbers = [1, 2, 3, 4];
b.describe('sort', function () {
    var crazylist = numbers.slice(2).concat(numbers.slice(0, 2));
    b.it('arranges numbers', [
        ['by default arranges by ascending', sort(crazylist.slice(0)), [1, 2, 3, 4]],
        ['a comparator can be passed to arrange in a different manner', sort(crazylist.slice(0), function (a, b) {
            // if true is returned, then items will be flipped
            return a < b;
        }), [4, 3, 2, 1]]
    ]);
});