application.scope().run(function (app, _, factories) {
    buster = factories.Buster(window, window.parent, {
        strip: true
    });
});