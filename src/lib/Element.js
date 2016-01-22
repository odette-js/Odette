// application.scope().module('Node', function (module, app, _, factories) {
//     var blank, BOOLEAN_TRUE = !0,
//         BOOLEAN_FALSE = !1,
//         isBlank = _.isBlank,
//         uniqueId = _.uniqueId,
//         isString = _.isString,
//         isArray = _.isArray,
//         duff = _.duff,
//         gapSplit = _.gapSplit,
//         stringify = _.stringify,
//         intendedObject = _.intendedObject,
//         Node = factories.Collection.extend('Node', {
//             constructor: function (el) {
//                 var node = this;
//                 node._el = el;
//                 node.load(el);
//                 return this;
//             },
//             load: function () {
//                 queuedata[CLASSNAME].load(this._el);
//                 queuedata.data.load(this._el);
//             },
//             apply: function () {
//                 var node = this,
//                     el = node._el;
//                 queuedata[CLASSNAME].unload(el);
//                 queuedata.data.unload(el);
//                 return node;
//             },
//             data: function (key, passedValue, addremoveDefault_) {
//                 var el = this._el,
//                     addremoveDefault = !!addremoveDefault_,
//                     dataset = queuedata.data.where(el);
//                 intendedObject(key, passedValue, function (key, value, wasanobject) {
//                     if (wasanobject) {
//                         addremoveDefault = !!passedValue;
//                     }
//                     intendedObject(value, blank, function (value, addremove, object) {
//                         if (!object) {
//                             queuedata.data.singleton(el, key, value);
//                         } else {
//                             if (isArray(object)) {
//                                 value = addremove;
//                                 addremove = addremoveDefault;
//                             }
//                             queuedata.data.upsert(el, key, value, addremove);
//                         }
//                     });
//                 });
//                 return this;
//             }
//         }, BOOLEAN_TRUE);
// });