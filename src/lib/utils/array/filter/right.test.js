var _ = require('./utils');
var filterRight = require('./right');
test.describe('filterRight', function () {
    var list = [1, 2, 3, 4, 5, 6, 7];
    test.it('filters elements in an array and reverses them', function () {
        var nulist = filterRight(list, function (number) {
            return number % 2;
        });
        test.expect(nulist).toEqual([7, 5, 3, 1]);
    });
});