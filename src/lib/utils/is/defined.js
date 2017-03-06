var isNil = require('./utils/is/nil');
module.exports = function (value) {
    return !isNil(value);
};