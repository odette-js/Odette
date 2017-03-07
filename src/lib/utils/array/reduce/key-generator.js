var isObject = require('./utils/is/object');
var objectKeyGenerator = require('./utils/generator/object');
var isArrayLike = require('./utils/is/array-like');
var arrayKeyGenerator = require('./utils/generator/array');
var noop = require('./utils/noop');
module.exports = function (object, dir, cap, incrementor) {
    return isArrayLike(object) ? arrayKeyGenerator(object, dir, cap, incrementor) : (isObject(object) ? objectKeyGenerator(object, dir, cap, incrementor) : noop);
};