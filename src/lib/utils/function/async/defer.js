var toArray = require('./utils/to/array');
module.exports = function defer(fn, time, context) {
    var id;
    return function deferInstance() {
        var context = context || this,
            args = toArray(arguments);
        clearTimeout(id);
        id = setTimeout(function deferTimer() {
            fn.apply(context, args);
        });
        return id;
    };
};