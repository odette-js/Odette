if (!Function[PROTOTYPE].bind) {
    Function[PROTOTYPE].bind = function (oThis) {
        if (typeof this !== 'function') {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError('Function[PROTOTYPE].bind - what is trying to be bound is not callable');
        }
        var aArgs = Array[PROTOTYPE].slice.call(arguments, 1),
            fToBind = this,
            FNOP = function () {},
            fBound = function () {
                return fToBind.apply(this instanceof FNOP ? this : oThis, aArgs.concat(Array[PROTOTYPE].slice.call(arguments)));
            };
        if (this[PROTOTYPE]) {
            // native functions don't have a prototype
            FNOP[PROTOTYPE] = this[PROTOTYPE];
        }
        fBound[PROTOTYPE] = new FNOP();
        return fBound;
    };
}