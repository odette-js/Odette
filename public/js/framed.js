application.scope().run(function (app, _, factories) {
    buster = factories.Buster(window, window.parent, {
        strip: true
    });
    buster.on('received:delayed', function (e) {
        setTimeout(function () {
            buster.respond(e.message.id, {
                success: true
            });
        }, 100);
        buster.respond(e.message.id);
    });
});