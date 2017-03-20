module.exports = function wraptry(trythis, errthat, finalfunction) {
    var returnValue, err = null;
    try {
        returnValue = trythis();
    } catch (e) {
        err = e;
        returnValue = errthat ? errthat(e, returnValue) : returnValue;
    } finally {
        returnValue = finalfunction ? finalfunction(err, returnValue) : returnValue;
    }
    return returnValue;
};