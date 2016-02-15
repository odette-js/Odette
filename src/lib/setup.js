// arguments: context, where, version, handler
Application(this, 'application', 'dev', function (innerGlobalApp, scopedApp) {
    // custom setup code for this version
    var global = this;
    // global app is the object that will be shared with all other iframes
    var globalApplication = innerGlobalApp.touchTop(global);
    // log it out for you to see
    // console.log(scopedApp);
    // puts the scoped app on the global object
    global.app = scopedApp;
});