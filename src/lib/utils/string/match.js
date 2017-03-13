module.exports = function (string, regexp) {
    return string.match(regexp) || [];
};