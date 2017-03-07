var cryptoCheck = 'crypto' in window && 'getRandomValues' in crypto;
var uuidHash = {};
module.exports = function () {
    return _uuid(4);
};

function _uuid(idx) {
    var sid = ('xxxxxxxx-xxxx-' + idx + 'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, function (c) {
        var rnd, r, v;
        if (cryptoCheck) {
            rnd = window.crypto.getRandomValues(new Uint32Array(1));
            if (rnd === undefined) {
                cryptoCheck = false;
            }
        }
        if (!cryptoCheck) {
            rnd = [Math.floor(Math.random() * 10e12)];
        }
        rnd = rnd[0];
        r = rnd % 16;
        v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    // if crypto check passes, you can trust the browser
    return uuidHash[sid] ? _uuid(idx + 1) : (uuidHash[sid] = true) && sid;
}