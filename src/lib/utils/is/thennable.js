var castBoolean = require('./utils/cast-boolean');
var get = require('./utils/object/get');
module.exports = function (thennable) {
    return castBoolean(get(thennable, 'then'), get(thennable, 'catch'));
};