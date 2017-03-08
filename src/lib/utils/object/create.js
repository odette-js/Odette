var PROTO = '__proto__';
module.exports = Object.create || (Object.create = (function (undefined) {
    var TMP = function () {};
    return function (prototype, propertiesObject) {
        if (prototype !== Object(prototype) && prototype !== null) {
            throw TypeError('Argument must be an object, or ' + null);
        }
        TMP[PROTOTYPE] = prototype || {};
        var result = new TMP();
        TMP[PROTOTYPE] = null;
        if (propertiesObject !== UNDEFINED) {
            Object.defineProperties(result, propertiesObject);
        }
        // to imitate the case of Object.create(null)
        if (prototype === null) {
            result[PROTO] = null;
        }
        return result;
    };
})());