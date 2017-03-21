var _ = require('./utils');
var dropWhile = require('./while');
test.describe('dropWhile', function () {
    var list = [{
        one: 1
    }, {
        two: 2
    }, {
        one: 1,
        two: 2
    }, {
        one: 1,
        two: 1
    }, {
        one: 2,
        two: 2
    }];
    test.it('filters items against a hash', function () {
        test.expect(dropWhile(list, {
            one: 1
        })).toEqual([{
            two: 2
        }, {
            one: 2,
            two: 2
        }]);
    });
});