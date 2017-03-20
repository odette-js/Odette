var isStrictlyEqual = require('./utils/is/strictly-equal');
module.exports = function (assertment, lookingFor) {
    var boolAssertment = !assertment;
    var boolLookingFor = !lookingFor;
    return isStrictlyEqual(boolAssertment, boolLookingFor);
};