var _ = require('./utils');
var each = require('./each');
b.describe('each', function () {
    b.it('should be a function', function (t) {
        t.expect(each).toBeFunction(true);
    });
    b.it('should return a function', function (t) {
        t.expect(each()).toBeFunction(true);
    });
    b.it('should return undefined when nothing is passed', function (t) {
        var iterates = each();
        t.expect(iterates()).toBeUndefined();
    });
});