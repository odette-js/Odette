application.scope().module('Element', function (module, app, _, $) {
    var factories = _.factories,
        each = _.each,
        duff = _.duff,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        isUnitlessNumber = {
            columnCount: BOOLEAN_TRUE,
            columns: BOOLEAN_TRUE,
            fontWeight: BOOLEAN_TRUE,
            lineHeight: BOOLEAN_TRUE,
            opacity: BOOLEAN_TRUE,
            zIndex: BOOLEAN_TRUE,
            zoom: BOOLEAN_TRUE,
            animationIterationCount: BOOLEAN_TRUE,
            boxFlex: BOOLEAN_TRUE,
            boxFlexGroup: BOOLEAN_TRUE,
            boxOrdinalGroup: BOOLEAN_TRUE,
            flex: BOOLEAN_TRUE,
            flexGrow: BOOLEAN_TRUE,
            flexPositive: BOOLEAN_TRUE,
            flexShrink: BOOLEAN_TRUE,
            flexNegative: BOOLEAN_TRUE,
            flexOrder: BOOLEAN_TRUE,
            lineClamp: BOOLEAN_TRUE,
            order: BOOLEAN_TRUE,
            orphans: BOOLEAN_TRUE,
            tabSize: BOOLEAN_TRUE,
            widows: BOOLEAN_TRUE,
            // SVG-related properties
            fillOpacity: BOOLEAN_TRUE,
            stopOpacity: BOOLEAN_TRUE,
            strokeDashoffset: BOOLEAN_TRUE,
            strokeOpacity: BOOLEAN_TRUE,
            strokeWidth: BOOLEAN_TRUE
        },
        timeBasedCss = {
            transitionDuration: BOOLEAN_TRUE,
            animationDuration: BOOLEAN_TRUE,
            transitionDelay: BOOLEAN_TRUE,
            animationDelay: BOOLEAN_TRUE
        },

        /**
        * Support style names that may come passed in prefixed by adding permutations
        * of vendor prefixes.
        */
        prefixes = ['Webkit', 'ms', 'Moz', 'O'],


        /**
        * Most style properties can be unset by doing .style[prop] = '' but IE8
        * doesn't like doing that with shorthand properties so for the properties that
        * IE8 breaks on, which are listed here, we instead unset each of the
        * individual properties. See http://bugs.jquery.com/ticket/12385.
        * The 4-value 'clock' properties like margin, padding, border-width seem to
        * behave without any problems. Curiously, list-style works too without any
        * special prodding.
        */
        shorthandPropertyExpansions = {
            background: {
                backgroundAttachment: BOOLEAN_TRUE,
                backgroundColor: BOOLEAN_TRUE,
                backgroundImage: BOOLEAN_TRUE,
                backgroundPositionX: BOOLEAN_TRUE,
                backgroundPositionY: BOOLEAN_TRUE,
                backgroundRepeat: BOOLEAN_TRUE
            },
            backgroundPosition: {
                backgroundPositionX: BOOLEAN_TRUE,
                backgroundPositionY: BOOLEAN_TRUE
            },
            border: {
                borderWidth: BOOLEAN_TRUE,
                borderStyle: BOOLEAN_TRUE,
                borderColor: BOOLEAN_TRUE
            },
            borderBottom: {
                borderBottomWidth: BOOLEAN_TRUE,
                borderBottomStyle: BOOLEAN_TRUE,
                borderBottomColor: BOOLEAN_TRUE
            },
            borderLeft: {
                borderLeftWidth: BOOLEAN_TRUE,
                borderLeftStyle: BOOLEAN_TRUE,
                borderLeftColor: BOOLEAN_TRUE
            },
            borderRight: {
                borderRightWidth: BOOLEAN_TRUE,
                borderRightStyle: BOOLEAN_TRUE,
                borderRightColor: BOOLEAN_TRUE
            },
            borderTop: {
                borderTopWidth: BOOLEAN_TRUE,
                borderTopStyle: BOOLEAN_TRUE,
                borderTopColor: BOOLEAN_TRUE
            },
            font: {
                fontStyle: BOOLEAN_TRUE,
                fontVariant: BOOLEAN_TRUE,
                fontWeight: BOOLEAN_TRUE,
                fontSize: BOOLEAN_TRUE,
                lineHeight: BOOLEAN_TRUE,
                fontFamily: BOOLEAN_TRUE
            },
            outline: {
            outlineWidth: BOOLEAN_TRUE,
            outlineStyle: BOOLEAN_TRUE,
            outlineColor: BOOLEAN_TRUE
            }
        },

        CSSProperty = {
            isUnitlessNumber: isUnitlessNumber,
            shorthandPropertyExpansions: shorthandPropertyExpansions
        },
        convertStyleType = function (key, value) {
            if (value === +value) {
                if (timeBasedCss[n]) {
                    value += 'ms';
                }
                if (!isUnitlessNumber[n]) {
                    value += 'px';
                }
            }
            return value;
        },
        isNode = function (object) {
          return !!(object && (_.isFunction(Node) ? _.isInstance(object, Node) : _.isObject(object) && _.isNumber(object.nodeType) && _.isString(object.nodeName)));
        },
        isWin = function (obj) {
            return obj && obj === obj.window;
        },
        /**
         * @private
         * @func
         */
        isDoc = function (obj) {
            return obj && isNumber(obj.nodeType) && obj.nodeType === obj.DOCUMENT_NODE;
        },
        isFrag = function (frag) {
            return frag && frag.nodeType === sizzleDoc.DOCUMENT_FRAGMENT_NODE;
        },
        styles = function (el, css_) {
            _.each(css_, function (key_, value) {
                var key = _.camelCase(key_);
                el.style[key] = convertStyleType(key, value);
            });
        },
        Element = factories.Element = _.extendFrom.Model('Element', {
            constructor: function (el, skip) {
                var element = this;
                element._el = el;
                element._validated = !skip;
                element.validate();
                element.apply();
                return element;
            },
            apply: function () {
                var element = this;
                _.each(element._queue, function (key, value) {});
                element._queue = {};
                return element;
            },
            validate: function () {
                var element = this;
                var el = element._el;
                element._isNode = isNode(el);
                element._isDoc = element._isNode ? BOOLEAN_FALSE : isDoc(el);
                element._isWin = element._isNode || element._isDoc ? BOOLEAN_FALSE : isWin(el);
                element._isFrag = element._isNode || element._isDoc || element._isWin ? BOOLEAN_FALSE : isFrag(el);
                element._isValid =  element._isWin || element._isNode || element._isDoc || element._isFrag;
            },
            valid: function (type, preventRevalidation) {
                var element = this;
                if (!element._validated && !preventRevalidation) {
                    element.validate();
                }
                return this['_is' + type];
            },
            style: function (css) {
                var element = this;
                if (element.valid('DOM')) {
                    styles(element._el, css);
                }
                return element;
            }
        }, BOOLEAN_TRUE);
        /**
         * @param {string} prefix vendor-specific prefix, eg: Webkit
         * @param {string} key style name, eg: transitionDuration
         * @return {string} style name prefixed with `prefix`, properly camelCased, eg:
         * WebkitTransitionDuration
         */
        function prefixKey(prefix, key) {
          return prefix + key.charAt(0).toUpperCase() + key.substring(1);
        }
        // Using Object.keys here, or else the vanilla for-in loop makes IE8 go into an
        // infinite loop, because it iterates over the newly added props too.
        each(isUnitlessNumber, function (truth, prop) {
            duff(prefixes, function (prefix) {
                isUnitlessNumber[prefixKey(prefix, prop)] = isUnitlessNumber[prop];
            });
        });
});