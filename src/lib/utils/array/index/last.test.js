var lastIndex = require('./last');
var b = require('batterie');
b.describe('lastIndex', function () {
    b.it('gets the length of the array minus 1', [
        ['works on arrays', lastIndex([1, 2, 3]), 2],
        ['works on empty arrays', lastIndex([]), -1],
        ['works on arraylike objects', lastIndex({
            length: 500
        }), 499]
    ]);
});