var notNaN = require('./utils/is/not/nan');
var isNil = require('./utils/is/nil');
module.exports = function (value) {
    return notNaN(value) && !isNil(value);
};