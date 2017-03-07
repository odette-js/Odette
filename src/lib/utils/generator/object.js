var arrayKeyGenerator = require('./utils/generator/array');
var keys = require('./utils/keys');
module.exports = function (object, dir, cap, incrementor) {
    var objectKeys = keys(object);
    return arrayKeyGenerator(objectKeys, dir, cap, incrementor, proxy);

    function proxy(value) {
        return objectKeys[value];
    }
};