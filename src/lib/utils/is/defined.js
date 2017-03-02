var isNil = require('./nil');
module.exports = function (value) {
    return !isNil(value);
};