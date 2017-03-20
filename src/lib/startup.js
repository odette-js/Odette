module.exports = require('./odette')(this, 'application', '0.0.0', function (innerSharedApp, scopedApp) {
    // custom setup code for this version
    // global app is the object that will be shared with all other iframes
}, function () {
    //
}, [window.parent]);