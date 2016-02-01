application.scope().module('Associator', function (module, app, _, factories) {
    /**
     * @class Associator
     * @augments Model
     */
    var blank, DATA = 'data',
        ITEMS = 'items',
        LENGTH = 'length',
        DATASET = DATA + 'set',
        IS_ELEMENT = 'isElement',
        INDEX_OF = 'indexOf',
        __ELID__ = '__elid__',
        BOOLEAN_TRUE = !0,
        extend = _.extend,
        isObject = _.isObject,
        removeAt = _.removeAt,
        Associator = factories.Model.extend('Associator', {
            /**
             * @func
             * @name Associator#get
             * @param {Object} obj - object that data is being gotten against in the Associator
             * @param {String} [type] - toString version of the object being passed in
             */
            get: function (obj, type) {
                var returnData, idxOf, dataset, n, key, instance = this,
                    canRead = 0,
                    data = {
                        dataset: {}
                    },
                    current = instance.sameType(obj),
                    els = current[ITEMS] = current[ITEMS] || [],
                    eldata = current[__ELID__] = current[__ELID__] || {},
                    dataArray = current[DATA] = current[DATA] || [];
                if (obj && current.readData) {
                    dataset = obj[DATASET];
                    key = obj[__ELID__] = obj[__ELID__] || _.uniqueId('el');
                    if (key) {
                        data = eldata[key] = eldata[key] = {};
                    }
                    // copy dataset over from one to the other
                    if (isObject(dataset) && _[IS_ELEMENT](obj)) {
                        data[DATASET] = extend(data[DATASET], dataset);
                    }
                    return data;
                } else {
                    idxOf = current[ITEMS][INDEX_OF](obj);
                    if (idxOf === blank || idxOf === -1) {
                        idxOf = current[ITEMS][LENGTH];
                        current[ITEMS].push(obj);
                        dataArray[idxOf] = data;
                    }
                    return dataArray[idxOf];
                }
            },
            /**
             * @func
             * @name Associator#set
             * @param {Node} el - Element to store data against
             * @param {Object} obj - object to extend onto current data
             * @param {String} [type] - toString evaluation of element, if it has already been evaluated
             * @returns {Object} data that is being held on the Associator
             */
            set: function (el, extensor, type) {
                var n, data = this.get(el, type);
                extend(data, extensor || {});
                return data;
            },
            remove: function (el) {
                var type = this.sameType(el),
                    idx = _[INDEX_OF](type[ITEMS], el),
                    ret = removeAt(type[DATA], idx);
                removeAt(type[ITEMS], idx);
                return ret;
            },
            /**
             * @func
             * @name Associator#sameType
             * @param {Object} obj - object to find matched types against
             */
            sameType: function (obj) {
                var instance = this,
                    type = _.toString(obj),
                    current = instance[type] = instance[type] || {},
                    lowerType = type.toLowerCase(),
                    globalindex = lowerType[INDEX_OF]('global');
                // skip reading data
                if (globalindex === -1 && lowerType[INDEX_OF]('window') === -1) {
                    current.readData = BOOLEAN_TRUE;
                }
                return current;
            }
        }, BOOLEAN_TRUE);
    _.exports({
        associator: factories.Associator()
    });
});