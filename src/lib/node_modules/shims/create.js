var PROTO = '__proto__';
if (typeof Object.create !== 'function') {
    Object.create = (function (undefined) {
        var TMP = function () {};
        return function (prototype, propertiesObject) {
            if (prototype !== Object(prototype) && prototype !== NULL) {
                throw TypeError('Argument must be an object, or ' + NULL);
            }
            TMP[PROTOTYPE] = prototype || {};
            var result = new TMP();
            TMP[PROTOTYPE] = NULL;
            if (propertiesObject !== UNDEFINED) {
                Object.defineProperties(result, propertiesObject);
            }
            // to imitate the case of Object.create(NULL)
            if (prototype === NULL) {
                result[PROTO] = NULL;
            }
            return result;
        };
    })();
}