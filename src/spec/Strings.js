application.scope().run(function (app, _) {
    _.describe('Strings', function () {
        _.it('_.camelCase', function () {
            var thatIsCamelCased = 'thisIsCamelCased';
            // default delimiter is -
            _.expect(_.camelCase('this-is-camel-cased')).toEqual(thatIsCamelCased);
            _.expect(_.camelCase('thisIsCamelCased')).toEqual(thatIsCamelCased);
            // overridable by second param
            _.expect(_.camelCase('this_is_camel_cased', '_')).toEqual(thatIsCamelCased);
            _.expect(_.camelCase('this is camel cased', ' ')).toEqual(thatIsCamelCased);
            // does not modify the first character if it is passed in as a capital letter
            _.expect(_.camelCase('This Is Camel Cased', ' ')).not.toEqual(thatIsCamelCased);
        });
        _.it('_.upCase', function () {
            _.expect(_.upCase('some')).toEqual('Some');
            _.expect(_.upCase('Some')).toEqual('Some');
            _.expect(_.upCase('sOmE')).toEqual('SOmE');
        });
        _.it('_.unCamelCase', function () {
            var thatIsCamelCased = 'thisIsUnCamelCased';
            _.expect(_.unCamelCase(thatIsCamelCased)).toEqual('this-is-un-camel-cased');
            _.expect(_.unCamelCase(thatIsCamelCased, ' ')).toEqual('this is un camel cased');
            _.expect(_.unCamelCase(thatIsCamelCased, '_')).toEqual('this_is_un_camel_cased');
            _.expect(_.unCamelCase(thatIsCamelCased, '1')).toEqual('this1is1un1camel1cased');
        });
        _.describe('_.customUnits', function () {
            _.expect(_.customUnits('1000whats', ['evers', 'whats'])).toEqual('whats');
            _.it('does not use any root, or base units', function () {
                _.expect(_.customUnits('1000px', [])).toEqual(false);
            });
        });
        _.it('_.reference', function () {
            var expectation = _.expect(_.reference(document));
            if (app.global.touch(window, window.top)) {
                expectation.toEqual('');
            } else {
                expectation.not.toEqual('');
            }
        });
        _.it('_.string.match', function () {
            _.expect(_.string.match('strings', 'string')).toEqual(['string']);
        });
    });
});
window._ = application.scope()._;
window.factories = application.scope()._.factories;