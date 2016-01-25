application.scope().module('Ajax', function (module, app, _, factories) {
    var gapSplit = _.gapSplit,
        duff = _.duff,
        each = _.each,
        unCamelCase = _.unCamelCase,
        posit = _.posit,
        result = _.result,
        wraptry = _.wraptry,
        BOOLEAN_TRUE = !0,
        BOOLEAN_FALSE = !1,
        STATUS = 'status',
        // ERROR = 'error',
        FAILURE = 'failure',
        SUCCESS = 'success',
        READY_STATE = 'readyState',
        isObject = _.isObject,
        isArray = _.isArray,
        stringify = _.stringify,
        parse = _.parse,
        extend = _.extend,
        stringifyQuery = _.stringifyQuery,
        validTypes = gapSplit('GET POST PUT DELETE'),
        baseEvents = gapSplit('progress timeout abort error'),
        cache = {},
        /**
         * @description helper function to attach a bunch of event listeners to the request object as well as help them trigger the appropriate events on the Ajax object itself
         * @private
         * @arg {Ajax} instance to listen to
         * @arg {Xhr} instance to place event handlers to trigger events on the Ajax instance
         * @arg {string} event name
         */
        attachBaseListeners = function (ajax) {
            var prog = 0,
                req = ajax.requestObject;
            duff(baseEvents, function (evnt) {
                if (evnt === 'progress') {
                    req['on' + evnt] = function (e) {
                        prog++;
                        ajax.executeHandlers(evnt, {
                            percent: (e.loaded / e.total) || (prog / (prog + 1)),
                            counter: prog
                        });
                    };
                } else {
                    req['on' + evnt] = function (e) {
                        ajax.rejectAs(evnt);
                    };
                }
            });
        },
        sendthething = function (xhrReq, args) {
            return function () {
                wraptry(function () {
                    xhrReq.send.apply(xhrReq, args);
                    // }, function (e) {
                    // handle an xhr req send error here
                    // factories.reportError('xhr', e + '');
                });
            };
        },
        sendRequest = function (ajax, xhrReq, type, url) {
            var args = [],
                data = ajax.get('data');
            if (url) {
                xhrReq.open(type, url, ajax.get('async'));
                if (data) {
                    args.push(stringify(data));
                }
                ajax.setHeaders(ajax.get('headers'));
                attachBaseListeners(ajax);
                // have to wrap in set timeout for ie
                setTimeout(sendthething(xhrReq, args));
            }
        },
        decide = {
            /**
             * @description get pathway for actually sending out a get request
             * @private
             */
            GET: function (ajax, xhrReq, type) {
                var url = ajax.getUrl();
                ajax.attachResponseHandler();
                sendRequest(ajax, xhrReq, type, url);
            },
            /**
             * @description pathway for actually sending out a put request
             * @private
             */
            PUT: function () {},
            /**
             * @description pathway for actually sending out a post request
             * @private
             */
            POST: function (ajax, xhrReq, type) {
                var url = ajax.getUrl();
                ajax.attachResponseHandler();
                sendRequest(ajax, xhrReq, type, url);
            },
            /**
             * @description pathway for actually sending out a delete request
             * @private
             */
            DELETE: function () {}
        },
        alterurlHandler = function () {
            var ajax = this,
                xhrReq = ajax.requestObject,
                type = ajax.get('type'),
                thingToDo = decide[type] || decide.GET;
            if (thingToDo) {
                thingToDo(ajax, xhrReq, type);
            }
        },
        /**
         * @class Ajax
         * @alias _.Ajax
         * @augments Box
         * @augments Model
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
         */
        Ajax = factories.Promise.extend('Ajax', {
            /**
             * @func
             * @name Ajax#constructor
             * @param {string} str - url to get from
             * @returns {Ajax} new ajax object
             */
            constructor: function (str, secondary) {
                var promise, url, thingToDo, typeThing, type, xhrReq, ajax = this,
                    method = 'onreadystatechange';
                // Add a cache buster to the url
                // ajax.async = BOOLEAN_TRUE;
                xhrReq = new XMLHttpRequest();
                // covers ie9
                if (typeof XDomainRequest !== 'undefined') {
                    xhrReq = new XDomainRequest();
                    method = 'onload';
                }
                if (!_.isObject(str)) {
                    str = str || '';
                    type = 'GET';
                    typeThing = str.toUpperCase();
                    if (posit(validTypes, typeThing)) {
                        type = typeThing;
                    } else {
                        url = str;
                    }
                    str = {
                        url: url || '',
                        type: type
                    };
                }
                str = extend({
                    async: BOOLEAN_TRUE
                }, str);
                str.type = (str.type || 'GET').toUpperCase();
                str.method = method;
                factories.Promise.constructor.apply(ajax);
                ajax.on('change:url', alterurlHandler);
                extend(ajax, secondary);
                ajax.requestObject = xhrReq;
                ajax.set(str);
                return ajax;
            },
            status: function (code, handler) {
                return this.handle('status:' + code, handler);
            },
            setHeaders: function (headers) {
                var ajax = this,
                    xhrReq = ajax.requestObject;
                each(headers, function (val, key) {
                    xhrReq.setRequestHeader(unCamelCase(key), val);
                });
                return ajax;
            },
            /**
             * @description specialized function to stringify url if it is an object
             * @returns {string} returns the completed string that will be fetched / posted / put / or deleted against
             * @name Ajax#getUrl
             */
            getUrl: function () {
                var url = this.get('url');
                if (isObject(url) && !isArray(url)) {
                    url = stringifyQuery(url);
                }
                return url;
            },
            /**
             * @description makes public the ability to attach a response handler if one has not already been attached. We recommend not passing a function in and instead just listening to the various events that the xhr object will trigger directly, or indirectly on the ajax object
             * @param {function} [fn=handler] - pass in a function to have a custom onload, onreadystatechange handler
             * @returns {ajax}
             * @name Ajax#attachResponseHandler
             */
            auxilaryStates: function () {
                return {
                    'status:200': SUCCESS,
                    'status:202': SUCCESS,
                    'status:205': SUCCESS,
                    'status:302': SUCCESS,
                    'status:304': SUCCESS,
                    'status:400': FAILURE,
                    'status:401': FAILURE,
                    'status:403': FAILURE,
                    'status:404': FAILURE,
                    'status:405': FAILURE,
                    'status:406': FAILURE,
                    'status:500': FAILURE,
                    'status:502': FAILURE,
                    'status:505': FAILURE,
                    'status:511': FAILURE,
                    timeout: FAILURE,
                    abort: FAILURE
                };
            },
            parse: function (rawData) {
                return parse(rawData);
            },
            attachResponseHandler: function () {
                var ajax = this,
                    xhrReqObj = ajax.requestObject,
                    hasFinished = BOOLEAN_FALSE,
                    method = ajax.get('method'),
                    handler = function (evnt) {
                        var status, doIt, allStates, rawData, readystate, xhrReqObj = this;
                        if (!xhrReqObj || hasFinished) {
                            return;
                        }
                        status = xhrReqObj[STATUS];
                        readystate = xhrReqObj[READY_STATE];
                        rawData = xhrReqObj.responseText;
                        ajax.currentEvent = evnt;
                        ajax.set('readystate', readystate);
                        if (method === 'onload' || (method === 'onreadystatechange' && readystate === 4)) {
                            ajax.set('status', status);
                            allStates = result(ajax, 'allStates');
                            if (allStates[STATUS + ':' + xhrReqObj[STATUS]] === SUCCESS) {
                                rawData = result(ajax, 'parse', rawData);
                            }
                            rawData = parse(rawData);
                            hasFinished = BOOLEAN_TRUE;
                            ajax.resolveAs(STATUS + ':' + xhrReqObj[STATUS], rawData);
                        }
                    };
                if (!xhrReqObj[method]) {
                    xhrReqObj[method] = handler;
                }
                return ajax;
            }
        }, !0);
});