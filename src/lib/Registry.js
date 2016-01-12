// Specless.module('Associator', function (module, specless, _, extendFrom, factories) {
    // /**
    //  * @class Associator
    //  * @augments Model
    //  */
    // var lengthString = 'length';
    // extendFrom.Model('Associator', {
    //     /**
    //      * @func
    //      * @name Associator#get
    //      * @param {Object} obj - object that data is being gotten against in the Associator
    //      * @param {String} [type] - toString version of the object being passed in
    //      */
    //     get: function (obj, type) {
    //         var returnData, idxOf, dataset, n, els, dataArray, current,
    //             instance = this,
    //             canRead = 0,
    //             data = {
    //                 dataset: {}
    //             };
    //         current = this.sameType(obj);
    //         els = current.items;
    //         dataArray = current.data;
    //         if (!els) {
    //             els = current.items = [];
    //         }
    //         if (!dataArray) {
    //             dataArray = current.data = [];
    //         }
    //         if (obj && _.isDom && current.readData) {
    //             dataset = obj.dataset;
    //             // copy dataset over from one to the other
    //             if (_.isObject(dataset) && _.isDom(obj)) {
    //                 data.dataset = _.extend(data.dataset, dataset);
    //             }
    //         }
    //         idxOf = current.items.indexOf(obj);
    //         if (idxOf === -1) {
    //             idxOf = current.items[lengthString];
    //             current.items.push(obj);
    //             dataArray[idxOf] = data;
    //         }
    //         return dataArray[idxOf];
    //     },
    //     /**
    //      * @func
    //      * @name Associator#set
    //      * @param {Node} el - Element to store data against
    //      * @param {Object} obj - object to extend onto current data
    //      * @param {String} [type] - toString evaluation of element, if it has already been evaluated
    //      * @returns {Object} data that is being held on the Associator
    //      */
    //     set: function (el, extensor, type) {
    //         var n, data = this.get(el, type);
    //         _.extend(data, extensor || {});
    //         return data;
    //     },
    //     remove: function (el) {
    //         var type = this.sameType(el);
    //         var idx = _.indexOf(type.items, el);
    //         var ret = _.removeAt(type.data, idx);
    //         _.removeAt(type.items, idx);
    //         return ret;
    //     },
    //     /**
    //      * @func
    //      * @name Associator#sameType
    //      * @param {Object} obj - object to find matched types against
    //      */
    //     sameType: function (obj) {
    //         var instance = this,
    //             type = _.toString(obj),
    //             current = instance[type],
    //             lowerType = type.toLowerCase();
    //         if (!current) {
    //             // makes things easier to find
    //             current = instance[type] = {};
    //         }
    //         if (lowerType.indexOf('global') === -1 && lowerType.indexOf('window') === -1) {
    //             current.readData = 1;
    //         }
    //         return current;
    //     }
    // }, !0);
    // _.xport({
    //     associator: _.Associator()
    // });
// });