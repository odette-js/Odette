var access = require('./utils/object/get');
module.exports = function (array) {
    return access(array, 'length') - 1;
};