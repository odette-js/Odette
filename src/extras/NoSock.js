application.scope(function (app) {
    var _ = app._,
        factories = app.factories,
        AF = _.AF,
        Timeline = factories.Model.extend('Timeline', {
            constructor: function () {
                return this;
            },
            play: function () {},
            pause: function () {},
            restart: function () {},
            seek: function () {},
            duration: function () {},
            fromTo: function () {},
            kill: function () {},
            repeat: function () {}
        }, true);
});