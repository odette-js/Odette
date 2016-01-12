application.scope().run(function (app, _) {
    describe('Strings', function () {
        it('_.camelCase', function () {
            var thatIsCamelCased = 'thisIsCamelCased';
            // default delimiter is -
            expect(_.camelCase('this-is-camel-cased')).toEqual(thatIsCamelCased);
            expect(_.camelCase('thisIsCamelCased')).toEqual(thatIsCamelCased);
            // overridable by second param
            expect(_.camelCase('this_is_camel_cased', '_')).toEqual(thatIsCamelCased);
            expect(_.camelCase('this is camel cased', ' ')).toEqual(thatIsCamelCased);
            // does not modify the first character if it is passed in as a capital letter
            expect(_.camelCase('This Is Camel Cased', ' ')).not.toEqual(thatIsCamelCased);
        });
        it('_.upCase', function () {
            expect(_.upCase('some')).toEqual('Some');
            expect(_.upCase('Some')).toEqual('Some');
            expect(_.upCase('sOmE')).toEqual('SOmE');
        });
        it('_.unCamelCase', function () {
            var thatIsCamelCased = 'thisIsUnCamelCased';
            expect(_.unCamelCase(thatIsCamelCased)).toEqual('this-is-un-camel-cased');
            expect(_.unCamelCase(thatIsCamelCased, ' ')).toEqual('this is un camel cased');
            expect(_.unCamelCase(thatIsCamelCased, '_')).toEqual('this_is_un_camel_cased');
            expect(_.unCamelCase(thatIsCamelCased, '1')).toEqual('this1is1un1camel1cased');
        });
    });
});