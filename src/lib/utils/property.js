var get = require('./utils/object/get');
module.exports = function (string) {
    return function (object) {
        return get(object, string);
    };
};