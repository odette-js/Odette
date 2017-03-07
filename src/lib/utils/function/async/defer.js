var toArray = require('./utils/to/array');
module.exports = function (fn, time, context) {
    var id;
    return function () {
        var context = context || this,
            args = toArray(arguments);
        clearTimeout(id);
        id = setTimeout(function () {
            fn.apply(context, args);
        });
        return id;
    };
};