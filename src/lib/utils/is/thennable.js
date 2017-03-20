var castBoolean = require('./utils/boolean/cast');
var get = require('./utils/object/get');
module.exports = function (thennable) {
    return isFunction(get(thennable, 'then')) && isFunction(get(thennable, 'catch'));
};