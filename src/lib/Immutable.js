var Immutable = _.Immutable = app.block(function (app) {
    var ImmutableMap = Directive.extend('ImmutableMap', {
            //
        }),
        ImmutableCollection;
    return {
        Map: ImmutableMap,
        Collection: ImmutableCollection
    };
});