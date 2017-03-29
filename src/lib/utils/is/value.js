var isStrictlyEqual = require('./utils/is/not-nan');
var isNil = require('./utils/is/nil');
var notNan = require('./utils/is/not-nan');
module.exports = function (value) {
    return notNan(value) && !isNil(value);
};