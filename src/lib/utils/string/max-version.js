var map = require('./utils/array/map');
var convertVersionString = require('./utils/string/convert-version');
var isStrictlyEqual = require('./utils/is/strictly-equal');
var isTrue = require('./utils/is/true');
var isFalse = require('./utils/is/false');
var isUndefined = require('./utils/is/undefined');
var toNumber = require('./utils/to/number');
module.exports = function (string1, string2) {
    // string 2 is always the underdogl
    var split1, split2, provenLarger, cvs1Result = convertVersionString(string1);
    var cvs2Result = convertVersionString(string2);
    // keyword checks
    if (isTrue(cvs1Result)) {
        return true;
    }
    if (isTrue(cvs2Result)) {
        return true;
    }
    if (isFalse(cvs1Result) && isFalse(cvs2Result)) {
        // compare them as version strings
        split1 = string1.split('.');
        split2 = string2.split('.');
        map(split1, function (value, index) {
            if (toNumber(value) < toNumber(split2[index] || 0)) {
                provenLarger = true;
            }
        });
        if (isStrictlyEqual(split1.length, 1) && isStrictlyEqual(split2.length, 3)) {
            return true;
        }
        if (isStrictlyEqual(split1.length, 3) && isStrictlyEqual(split2.length, 1)) {
            return false;
        }
        if (isUndefined(provenLarger) && split2.length > split1.length) {
            provenLarger = true;
        }
        return !!provenLarger;
    } else {
        return string1 <= string2;
    }
};