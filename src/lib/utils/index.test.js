var _ = require('.');
test.describe('_', function () {
    test.it('is an object', function () {
        test.expect(_).toBeObject();
    }, 1);
});
require('./array/index.test');