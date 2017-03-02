var access = require('./object/access');
module.exports = function (array) {
    return access(array, 'length') - 1;
};