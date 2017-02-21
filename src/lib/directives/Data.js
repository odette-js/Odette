// app.scope(function (app) {
//     var CHANGE_COUNTER = 'counter',
//         CHANGE_TO = 'changeTo',
//         IMMUTABLES = 'immutables',
//         DataManager = factories[DATA_MANAGER] = factories.Directive.extend(DATA_MANAGER, {
//             constructor: function () {
//                 this.reset();
//                 return this;
//             },
//             set: function (key, value) {
//                 return (!this.is('frozen') && this.mutable(key)) ? this.overwrite(key, value) : BOOLEAN_FALSE;
//             },
//             immutable: function (key) {
//                 return this[IMMUTABLES][key];
//             },
//             mutable: function (key) {
//                 return !this.immutable(key);
//             },
//             overwrite: function (key, value) {
//                 var data = this,
//                     current = data[CURRENT],
//                     currentValue = current[key];
//                 if (!isEqual(currentValue, value)) {
//                     if (value === UNDEFINED) {
//                         return data.unset(key);
//                     } else {
//                         data.previous[key] = currentValue;
//                         data[CURRENT][key] = data.changes()[key] = value;
//                     }
//                     return BOOLEAN_TRUE;
//                 }
//                 return BOOLEAN_FALSE;
//             },
//             get: function (key) {
//                 return this[CURRENT][key];
//             },
//             clone: function () {
//                 return clone(this[CURRENT]);
//             },
//             changes: function () {
//                 return this[CHANGE_TO];
//             },
//             changing: function (key) {
//                 return has(this.changes(), key);
//             },
//             unset: function (key) {
//                 var current = this[CURRENT],
//                     previous = current[key];
//                 this.previous[key] = previous;
//                 this.changes()[key] = UNDEFINED;
//                 return (delete current[key]) && previous !== UNDEFINED;
//             },
//             reset: function (hash) {
//                 this[CURRENT] = hash || {};
//                 this[IMMUTABLES] = {};
//                 return this.finish();
//             },
//             finish: function () {
//                 var data = this,
//                     changeto = data.changes();
//                 data[PREVIOUS] = {};
//                 data[CHANGE_TO] = {};
//                 data[CHANGE_COUNTER] = 0;
//                 return changeto;
//             },
//             increment: function () {
//                 ++this[CHANGE_COUNTER];
//                 return this;
//             },
//             decrement: function () {
//                 --this[CHANGE_COUNTER];
//                 return this;
//             },
//             static: function () {
//                 return !this[CHANGE_COUNTER];
//             },
//             reach: function (key) {
//                 var lastkey, previous, data = this,
//                     current = data[CURRENT];
//                 return forEach(toArray(key, PERIOD), function (key, index, path) {
//                     var no_more = index === path[LENGTH];
//                     lastkey = key;
//                     if (!no_more) {
//                         current = isObject(current[key]) ? current[key] : {};
//                     }
//                 }) && (isString(lastkey) ? UNDEFINED : current[lastkey]);
//             },
//             has: function (key) {
//                 return this[CURRENT][key] !== UNDEFINED;
//             },
//             forOwn: function (fn) {
//                 return forOwn(this[CURRENT], fn, this);
//             }
//         });
//     app.defineDirective(DATA_MANAGER, DataManager[CONSTRUCTOR]);
// });