var arrayKeyGenerator = require('./utils/generator/array');
var keys = require('./utils/object/keys');
module.exports = function objectGenerator(object, dir, cap, incrementor) {
    var objectKeys = keys(object);
    return arrayKeyGenerator(objectKeys, dir, cap, incrementor, proxy);

    function proxy(value) {
        return objectKeys[value];
    }
};