var callMethod = require('./utils/function/call-method');
var isString = require('./utils/is/string');
module.exports = function (fromHere, toHere) {
    var toIsString = isString(toHere),
        fromIsString = isString(fromHere);
    return function (arg) {
        return callMethod(toIsString, toHere, this, callMethod(fromIsString, fromHere, this, arg));
    };
};