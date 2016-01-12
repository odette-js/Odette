// application.scope().run(function (app, _, $) {
//     var counter = 0,
//         SomeView = _.factories.View.extend('SomeView', {
//             template: _.htmlCompile('#basic'),
//             className: function () {
//                 return 'mine' + (counter++);
//             }
//         });
// });
// application.scope().run(function (app, _, $) {
//     var factories = _.factories;
//     var view = new factories.SomeView();
//     app.addRegions({
//         main: '#main-region'
//     });
//     var main = app.getRegion('main');
//     view.add([{
//         text: 1
//     }, {
//         text: 2
//     }, {
//         text: 3,
//         children: [{
//             text: 4
//         }, {
//             text: 5
//         }]
//     }]);
//     view.children.index(0).add([{
//         text: 6
//     }, {
//         text: 7
//     }, {
//         text: 8
//     }]);
//     main.fill(view);
//     view.add({
//         text: 9
//     });
//     window.view = view;
//     console.log(view);
// });
// application.scope().run(function (app, _, $) {
//     debugger;
// });