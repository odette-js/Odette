/**
 * Status directive for all of your boolean states.
 * @class Status
 * @extends {Directive}
 */
var Extendable = require('./lib/Extendable'),
    isUndefined = require('./lib/utils/is/undefined'),
    isStrictlyEqual = require('./lib/utils/is/strictly-equal'),
    isTrue = require('./lib/utils/is/true'),
    isFalse = require('./lib/utils/is/false'),
    cloneJSON = require('./lib/utils/JSON/clone'),
    STATUS = 'status',
    STATUSES = STATUS + 'es';
module.exports = Extendable.extend(STATUS,
    /**
     * @lends Status.prototype
     * @enum {Function}
     */
    {
        constructor: function () {
            this[STATUSES] = {};
            return this;
        },
        has: function (status) {
            return !isUndefined(this[STATUSES][status]);
        },
        mark: function (status) {
            var previous = this[STATUSES][status];
            this[STATUSES][status] = true;
            return !isTrue(previous);
        },
        unmark: function (status) {
            var previous = this[STATUSES][status];
            this[STATUSES][status] = false;
            return !isFalse(previous);
        },
        /**
         * Acts kind of like a directed toggle for the Directive
         * @method
         * @param {String} key value that you would like to associate with false.
         * @returns {Boolean} True is returned if the value registered is being changed. False is returned if it does not change.
         * @example <caption>In this example the truth variable will have the value true returned to it after the key name has been marked as false on the {@link Status} directive.</caption>
         * var truth = directive.unmark("name");
         * @example <caption>When this code is run after the previous example the value set to untruth will be false because the directive has already set the name property on the {@link Status} object as false.</caption>
         * var untruth = directive.unmark("name");
         */
        remark: function (status, direction) {
            var statusObject = this;
            var previous = statusObject[STATUSES][status];
            var result = statusObject[STATUSES][status] = isUndefined(direction) ? !statusObject[STATUSES][status] : !!direction;
            return isStrictlyEqual(previous, result);
        },
        is: function (status) {
            return !!this[STATUSES][status];
        },
        isNot: function (status) {
            return !this[STATUSES][status];
        },
        toJSON: function () {
            return cloneJSON(this[STATUSES]);
        }
    });