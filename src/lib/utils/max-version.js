var map = require('./utils/array/map');
var convertVersionString = require('./utils/convert-version');
module.exports = function (string1, string2) {
    // string 2 is always the underdogl
    var split1, split2, provenLarger, cvs1Result = convertVersionString(string1);
    var cvs2Result = convertVersionString(string2);
    // keyword checks
    if (cvs1Result === true) {
        return true;
    }
    if (cvs2Result === true) {
        return true;
    }
    if (cvs1Result === false && cvs2Result === false) {
        // compare them as version strings
        split1 = string1.split('.');
        split2 = string2.split('.');
        map(split1, function (value, index) {
            if (+value < +(split2[index] || 0)) {
                provenLarger = true;
            }
        });
        if (split1.length === 1 && split2.length === 3) {
            return true;
        }
        if (split1.length === 3 && split2.length === 1) {
            return false;
        }
        if (provenLarger === undefined && split2.length > split1.length) {
            provenLarger = true;
        }
        return !!provenLarger;
    } else {
        return string1 <= string2;
    }
};