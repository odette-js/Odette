var _ = require('./utils');
var concat = require('.');
test.describe('concat', function () {
    test.it('flattens a list', function () {
        test.expect(concat([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
    });
    test.it('even with nested arrays', function () {
        test.expect(concat([1, 2, [3], 4, [5]])).toEqual([1, 2, 3, 4, 5]);
    });
    test.it('will only go one layer deep', function () {
        test.expect(concat([1, 2, [3], 4, [
            [5]
        ]])).toEqual([1, 2, 3, 4, [5]]);
    });
});
require('./unique.test');