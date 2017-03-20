var access = require('./utils/object/get');
module.exports = function lastIndex(array) {
    return access(array, 'length') - 1;
};