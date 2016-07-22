application.scope().run(function (app, _) {
    _.test.describe('Strings', function () {
        _.test.it('_.camelCase', function () {
            var thatIsCamelCased = 'thisIsCamelCased';
            // default delimiter is -
            _.test.expect(_.camelCase('this-is-camel-cased')).toEqual(thatIsCamelCased);
            _.test.expect(_.camelCase('thisIsCamelCased')).toEqual(thatIsCamelCased);
            // overridable by second param
            _.test.expect(_.camelCase('this_is_camel_cased', '_')).toEqual(thatIsCamelCased);
            _.test.expect(_.camelCase('this is camel cased', ' ')).toEqual(thatIsCamelCased);
            // does not modify the first character if it is passed in as a capital letter
            _.test.expect(_.camelCase('This Is Camel Cased', ' ')).not.toEqual(thatIsCamelCased);
        });
        _.test.it('_.capitalize', function () {
            _.test.expect(_.capitalize('some')).toEqual('Some');
            _.test.expect(_.capitalize('Some')).toEqual('Some');
            _.test.expect(_.capitalize('sOmE')).toEqual('SOmE');
        });
        _.test.it('_.unCamelCase', function () {
            var thatIsCamelCased = 'thisIsUnCamelCased';
            _.test.expect(_.unCamelCase(thatIsCamelCased)).toEqual('this-is-un-camel-cased');
            _.test.expect(_.unCamelCase(thatIsCamelCased, ' ')).toEqual('this is un camel cased');
            _.test.expect(_.unCamelCase(thatIsCamelCased, '_')).toEqual('this_is_un_camel_cased');
            _.test.expect(_.unCamelCase(thatIsCamelCased, '1')).toEqual('this1is1un1camel1cased');
        });
        _.test.describe('_.customUnits', function () {
            _.test.it('does not use any root, or base units', function () {
                _.test.expect(_.customUnits('1000whats', ['evers', 'whats'])).toEqual('whats');
                _.test.expect(_.customUnits('1000px', [])).toEqual(false);
            });
        });
        _.test.it('_.reference', function () {
            _.test.expect(_.isString(_.reference(document))).toEqual(true);
        });
        _.test.it('_.string.match', function () {
            _.test.expect(_.string.match('strings are my stringy friends', 'string')).toEqual(['string']);
        });
        _.test.it('_.string.toLowerCase', function () {
            _.test.expect(_.string.toLowerCase('YaYlOwErcasD')).toEqual('yaylowercasd');
        });
        _.test.it('_.string.toUpperCase', function () {
            _.test.expect(_.string.toUpperCase('YaYlOwErcasD')).toEqual('YAYLOWERCASD');
        });
        _.test.it('_.baseUnitList', function () {
            _.test.expect(_.baseUnitList.slice(0).sort()).toEqual(['vmax', 'vmin', 'rem', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'vh', 'vw', '%'].slice(0).sort());
        });
        _.test.it('_.parseHash', function () {
            _.test.expect(_.parseHash('#{"things":true}')).toEqual({
                things: true
            });
            _.test.expect(_.parseHash('#route/here')).toEqual('route/here');
            _.test.expect(_.parseHash('#48330382')).toEqual(48330382);
            _.test.expect(_.parseHash('#48330382/2891-44303')).toEqual('48330382/2891-44303');
        });
        _.test.it('_.isHttp', function () {
            _.test.expect(_.isHttp('http://localhost:8080')).toEqual(true);
            _.test.expect(_.isHttp('https://localhost:8080')).toEqual(true);
            _.test.expect(_.isHttp('//localhost:8080')).toEqual(true);
            _.test.expect(_.isHttp('localhost:8080')).toEqual(false);
            _.test.expect(_.isHttp('//localhost:8080//')).toEqual(false);
            _.test.expect(_.isHttp(' //localhost:8080')).toEqual(false);
            _.test.expect(_.isHttp('//localhost/alsdf.js')).toEqual(true);
        });
        _.test.it('can return a time, in ms from now when given a string', function () {
            _.test.expect(_.time('1secs')).toEqual(1000);
        });
        _.test.it('can even take compunded time in a comma delineated list', function () {
            _.test.expect(_.time('9hrs,3mins,5secs')).toBe((9 * 1000 * 60 * 60) + (3 * 1000 * 60) + (5 * 1000));
        });
    });
});