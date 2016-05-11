Odette(this, 'application', '0.0.0', function (innerSharedApp, scopedApp) {
    // custom setup code for this version
    var global = this;
    // scopedApp.version === 'dev'
    // global app is the object that will be shared with all other iframes
    var globalSharedApp = innerSharedApp.touch(global);
});