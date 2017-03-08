var isNil = require('./utils/is/nil');
module.exports = function (object) {
    var wasNil = isNil(object);
    return function (key) {
        if (!wasNil) {
            return object[key];
        }
    };
};