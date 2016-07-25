application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    app.BROWSERSTACKING = true;
    _.console.log = function (singleton) {
        window.CONSOLE_LOG = singleton;
    };
});