var reduce = require('./utils/array/reduce');
var toArray = require('./utils/to/array');
var _console = global.console;
var ignores = {
    trace: true,
    error: true
};
module.exports = reduce(toArray('trace,warn,log,dir,error,clear,table,profile,profileEnd,time,timeEnd,timeStamp'), function (memo, key) {
    var method = _console[key] || _console.log;
    memo[key] = function () {
        var result = method && method.apply && method.apply(_console, arguments);
        if (!ignores[key] && _console.trace) {
            _console.trace.apply(_console, arguments);
        }
        return result;
    };
}, {
    exception: exception,
    assert: function assert(boolean_, options) {
        if (!boolean_) {
            exception(options);
        }
    }
});

function exception(msg) {
    throw new Error(msg);
}