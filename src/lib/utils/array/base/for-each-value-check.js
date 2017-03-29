var isKey = require('./utils/is/key');
module.exports = isValue;

function isValue(value) {
    if (isKey(value)) {
        return value;
    }
}