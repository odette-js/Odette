var b = require('batterie');
var uniqueWith = require('./with');
var isStrictlyEqual = require('./utils/is/strictly-equal');
var duplicates = [5, 1, 6, 2, 5, 3, 2, 1, 6, 4, 5];
b.describe('uniqueWith', function () {
    b.it('filters values in objects', [
        ['noop by default', uniqueWith(duplicates), duplicates],
        ['dedupes objects', uniqueWith(duplicates, isStrictlyEqual), [5, 1, 6, 2, 3, 4]]
    ]);
});