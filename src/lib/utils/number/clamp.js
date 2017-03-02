module.exports = function (number, lower, upper) {
    return number !== number ? number : (number < lower ? lower : (number > upper ? upper : number));
};