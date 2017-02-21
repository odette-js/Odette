// application.scope().run(function (module, app, _) {
//     test.describe('Strings', function () {
//         test.it('_.camelCase', function () {
//             var thatIsCamelCased = 'thisIsCamelCased';
//             // default delimiter is -
//             test.expect(_.camelCase('this-is-camel-cased')).toEqual(thatIsCamelCased);
//             test.expect(_.camelCase('thisIsCamelCased')).toEqual(thatIsCamelCased);
//             // overridable by second param
//             test.expect(_.camelCase('this_is_camel_cased')).toEqual(thatIsCamelCased);
//             test.expect(_.camelCase('this is camel cased')).toEqual(thatIsCamelCased);
//             // does not modify the first character if it is passed in as a capital letter
//             // test.expect(_.camelCase('This Is Camel Cased', ' ')).not.toEqual(thatIsCamelCased);
//         }, 4);
// test.it('_.units', function () {
//     test.expect(_.units('')).toEqual(false);
//     test.expect(_.units(500)).toEqual(false);
//     test.expect(_.units('500')).toEqual(false);
//     test.expect(_.units('500px')).toEqual('px');
//     test.expect(_.units('500rem')).toEqual('rem');
//     test.expect(_.units('500em')).toEqual('em');
//     test.expect(_.units('500%')).toEqual('%');
//     test.expect(_.units('500ex')).toEqual('ex');
//     test.expect(_.units('500in')).toEqual('in');
//     test.expect(_.units('500cm')).toEqual('cm');
//     test.expect(_.units('500vh')).toEqual('vh');
//     test.expect(_.units('500vw')).toEqual('vw');
//     test.expect(_.units('500pc')).toEqual('pc');
//     test.expect(_.units('500pt')).toEqual('pt');
//     test.expect(_.units('500mm')).toEqual('mm');
// }, 15);
//         test.it('_.capitalize', function () {
//             test.expect(_.capitalize('some')).toEqual('Some');
//             test.expect(_.capitalize('Some')).toEqual('Some');
//             test.expect(_.capitalize('sOmE')).toEqual('SOmE');
//         }, 3);
//         // test.it('_.unCamelCase', function () {
//         //     var thatIsCamelCased = 'thisIsUnCamelCased';
//         //     test.expect(_.unCamelCase(thatIsCamelCased)).toEqual('this-is-un-camel-cased');
//         //     test.expect(_.unCamelCase(thatIsCamelCased, ' ')).toEqual('this is un camel cased');
//         //     test.expect(_.unCamelCase(thatIsCamelCased, '_')).toEqual('this_is_un_camel_cased');
//         //     test.expect(_.unCamelCase(thatIsCamelCased, '1')).toEqual('this1is1un1camel1cased');
//         // });
//         test.describe('_.customUnits', function () {
//             test.it('does not use any root, or base units', function () {
//                 test.expect(_.customUnits('1000whats', ['evers', 'whats'])).toEqual('whats');
//                 test.expect(_.customUnits('1000px', [])).toEqual(false);
//             }, 2);
//         });
//         test.it('_.reference', function () {
//             test.expect(_.isString(_.reference(document))).toEqual(true);
//         }, 1);
//         test.it('_.string.match', function () {
//             test.expect(_.string.match('strings are my stringy friends', 'string')).toEqual(['string']);
//         }, 1);
//         test.it('_.string.toLowerCase', function () {
//             test.expect(_.string.toLowerCase('YaYlOwErcasD')).toEqual('yaylowercasd');
//         }, 1);
//         test.it('_.string.toUpperCase', function () {
//             test.expect(_.string.toUpperCase('YaYlOwErcasD')).toEqual('YAYLOWERCASD');
//         }, 1);
//         test.it('_.baseUnitList', function () {
//             test.expect(_.baseUnitList.slice(0).sort()).toEqual(['vmax', 'vmin', 'rem', 'cm', 'em', 'ex', 'in', 'mm', 'pc', 'pt', 'px', 'vh', 'vw', '%'].slice(0).sort());
//         }, 1);
//         test.it('_.parseHash', function () {
//             test.expect(_.parseHash('#{"things":true}')).toEqual({
//                 things: true
//             });
//             test.expect(_.parseHash('#route/here')).toEqual('route/here');
//             test.expect(_.parseHash('#48330382')).toEqual(48330382);
//             test.expect(_.parseHash('#48330382/2891-44303')).toEqual('48330382/2891-44303');
//         }, 4);
//         test.it('_.isHttp', function () {
//             test.expect(_.isHttp('http://localhost:8080')).toEqual(true);
//             test.expect(_.isHttp('https://localhost:8080')).toEqual(true);
//             test.expect(_.isHttp('//localhost:8080')).toEqual(true);
//             test.expect(_.isHttp('localhost:8080')).toEqual(false);
//             test.expect(_.isHttp('//localhost:8080//')).toEqual(false);
//             test.expect(_.isHttp(' //localhost:8080')).toEqual(false);
//             test.expect(_.isHttp('//localhost/alsdf.js')).toEqual(true);
//         }, 7);
//         test.it('can return a time, in ms from now when given a string', function () {
//             test.expect(_.time('1secs')).toEqual(1000);
//         }, 1);
//         test.it('can even take compunded time in a comma delineated list', function () {
//             test.expect(_.time('9hrs,3mins,5secs')).toBe((9 * 1000 * 60 * 60) + (3 * 1000 * 60) + (5 * 1000));
//         }, 1);
//     });
// });