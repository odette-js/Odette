var isStrictlyEqual = require('./utils/is/not-nan');
var isNil = require('./utils/is/nil');
module.exports = function (value) {
    return notNan(value) && !isNil(value);
};