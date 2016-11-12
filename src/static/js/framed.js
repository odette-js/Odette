application.hoist(window.parent);
application.scope().run(window, function (module, app, _, factories, $) {
    var buster = $.Buster(window, window.parent, {
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