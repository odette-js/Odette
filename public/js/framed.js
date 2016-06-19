application.scope().run(window, function (app, _, factories, documentView, scopedFactories, $) {
    var buster = scopedFactories.Buster(window, window.parent, {
        strip: true
    }, {
        'received:delayed': function (e) {
            var buster = this;
            setTimeout(function () {
                buster.respond(e.message.id, {
                    success: true
                });
            }, 100);
            buster.respond(e.message.id);
        }
    });
});