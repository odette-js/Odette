var notNaN = require('./not/nan');
var isNil = require('./nil');
module.exports = function (value) {
    return notNaN(value) && !isNil(value);
};