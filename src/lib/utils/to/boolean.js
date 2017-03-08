var booleans = {
    true: true,
    false: false
};
var has = require('./utils/object/has');
var castBoolean = require('./utils/cast-boolean');
module.exports = function toBoolean(thing) {
    var converted = (thing + '').trim();
    if (booleans[converted] && has(booleans, converted)) {
        return baseDataTypes[converted];
    }
    return castBoolean(thing);
};