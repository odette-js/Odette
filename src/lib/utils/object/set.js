module.exports = function (object, value, key) {
    return (object[key] = value);
};