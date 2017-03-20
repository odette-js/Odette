var _ = require('./utils');
var each = require('./each');
test.describe('each', function () {
    test.it('should be a function', function () {
        test.expect(each).toBeFunction(true);
    }, 1);
    test.it('should return a function', function () {
        test.expect(each()).toBeFunction(true);
    }, 1);
    test.it('should return undefined when nothing is passed', function () {
        var iterates = each();
        test.expect(iterates()).toBeUndefined();
    }, 1);
});