application.scope().module('Associator', function (module, app, _, factories) {
    /**
     * @class Associator
     * @augments Model
     */
    var ITEMS = 'items',
        DATASET = DATA + 'set',
        IS_ELEMENT = 'isElement',
        extend = _.extend,
        isObject = _.isObject,
        removeAt = _.removeAt,
        objectToString = {}.toString,
        Associator = factories.Directive.extend('Associator', {
            /**
             * @func
             * @name Associator#get
             * @param {Object} obj - object that data is being gotten against in the Associator
             * @param {String} [type] - toString version of the object being passed in
             */
            get: function (obj, type) {
                var returnData, idxOf, dataset, n, key, instance = this,
                    canRead = 0,
                    data = {},
                    objIsObj = isObject(obj),
                    current = instance.sameType(obj, objIsObj),
                    els = current[ITEMS] = current[ITEMS] || [],
                    eldata = current[__ELID__] = current[__ELID__] || {},
                    dataArray = current[DATA] = current[DATA] || [];
                if (objIsObj) {
                    if (obj && current.readData) {
                        key = obj[__ELID__] = obj[__ELID__] || uniqueId('el');
                        if (key) {
                            data = eldata[key] = eldata[key] || {};
                        }
                    } else {
                        idxOf = current[ITEMS][INDEX_OF](obj);
                        if (idxOf === UNDEFINED || idxOf === -1) {
                            idxOf = current[ITEMS][LENGTH];
                            current[ITEMS].push(obj);
                            dataArray[idxOf] = data;
                        }
                        data = dataArray[idxOf];
                    }
                } else {
                    current[__ELID__][obj] = current[__ELID__][obj] || {};
                    data = current[__ELID__][obj];
                }
                data.target = obj;
                return data;
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
                var idx, type = this.sameType(el);
                if (type.readData) {
                    idx = el[__ELID__];
                    delete type[__ELID__][idx];
                } else {
                    idx = _[INDEX_OF](type[ITEMS], el);
                    removeAt(type[DATA], idx);
                    removeAt(type[ITEMS], idx);
                }
            },
            /**
             * @func
             * @name Associator#sameType
             * @param {Object} obj - object to find matched types against
             */
            sameType: function (obj, isObj_) {
                var instance = this,
                    isObj = isObj_ === UNDEFINED ? isObject(obj) : isObj_,
                    type = objectToString.call(obj),
                    current = instance[type] = instance[type] || {},
                    lowerType = type.toLowerCase(),
                    globalindex = lowerType[INDEX_OF]('global'),
                    indexOfWindow = lowerType[INDEX_OF](WINDOW) === -1;
                // skip reading data
                if (globalindex === -1 && indexOfWindow && isObj) {
                    current.readData = BOOLEAN_TRUE;
                }
                return current;
            },
            ensure: function (el, attr, failure) {
                var data = this.get(el);
                data[attr] = data[attr] || failure(el);
                return data[attr];
            }
        }, BOOLEAN_TRUE);
    _.exports({
        associator: Associator()
    });
});