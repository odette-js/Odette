var _ = require('./utils');
var filterRight = require('./right');
b.describe('filterRight', function () {
    var list = [1, 2, 3, 4, 5, 6, 7];
    b.it('filters elements in an array and reverses them', function (t) {
        var nulist = filterRight(list, function (number) {
            return number % 2;
        });
        t.expect(nulist).toEqual([7, 5, 3, 1]);
    });
});