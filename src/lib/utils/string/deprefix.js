module.exports = function (str, prefix) {
    var nuStr = str.slice(prefix && prefix.length);
    return nuStr[0] + nuStr.slice(1);
};