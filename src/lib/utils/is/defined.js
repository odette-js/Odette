var isNil = require('./utils/is/nil');
module.exports = function isDefined(value) {
    return !isNil(value);
};