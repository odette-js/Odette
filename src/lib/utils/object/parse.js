var isNotNan = require('./utils/is/not/nan');
var isString = require('./utils/is/string');
var wraptry = require('./utils/function/wrap-try');
var couldBeJSON = require('./utils/JSON/could-be');
var JSONParse = require('./utils/JSON/parse');
var toNumber = require('./utils/to/number');
var has = require('./utils/object/has');
var baseDataTypes = require('./utils/base-data-types');
module.exports = function (val_) {
    var valTrimmed, valLength, coerced, val = val_;
    if (!isString(val)) {
        // already parsed
        return val;
    }
    val = valTrimmed = val.trim();
    valLength = val.length;
    if (!valLength) {
        return val;
    }
    if (couldBeJSON(val)) {
        if ((val = wraptry(function () {
                return JSONParse(val);
            }, function () {
                return val;
            })) !== valTrimmed) {
            return val;
        }
    }
    coerced = toNumber(val);
    if (isNotNan(coerced)) {
        return coerced;
    }
    if (has(baseDataTypes, val)) {
        return baseDataTypes[val];
    }
    if (val.slice(0, 8) === 'function') {
        return new FUNCTION_CONSTRUCTOR_CONSTRUCTOR('return ' + val)();
    }
    return val;
}