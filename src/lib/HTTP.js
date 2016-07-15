app.scope(function (app) {
    var _ = app._,
        factories = _.factories,
        CATCH = 'catch',
        ERROR = 'error',
        STATUS = 'status',
        FAILURE = 'failure',
        SUCCESS = 'success',
        READY_STATE = 'readyState',
        XDomainRequest = win.XDomainRequest,
        stringifyQuery = _.stringifyQuery,
        GET = 'GET',
        PROGRESS = 'progress',
        validTypes = toArray(GET + ',POST,PUT,DELETE,HEAD,TRACE,OPTIONS,CONNECT'),
        baseEvents = toArray(PROGRESS + ',timeout,abort,' + ERROR),
        attachBaseListeners = function (ajax) {
            var prog = 0,
                req = ajax.options.requestObject;
            duff(baseEvents, function (evnt) {
                if (evnt === PROGRESS) {
                    // we put it directly on the xhr object so we can
                    // account for certain ie bugs that show up
                    req['on' + evnt] = function (e) {
                        var percent = (e.loaded / e.total);
                        prog++;
                        ajax[DISPATCH_EVENT](PROGRESS, {
                            percent: percent || (prog / (prog + 1)),
                            counter: prog
                        }, {
                            originalEvent: e
                        });
                    };
                } else {
                    req['on' + evnt] = function (e) {
                        ajax.resolveAs(evnt, e);
                    };
                }
            });
        },
        sendthething = function (xhrReq, args, ajax) {
            return function () {
                return wraptry(function () {
                    return xhrReq.send.apply(xhrReq, args);
                }, function (e) {
                    ajax.resolveAs(CATCH, e, e.message);
                });
            };
        },
        /**
         * @class HTTP
         * @alias factories.HTTP
         * @augments Model
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
         */
        HTTP = factories.HTTP = Promise.extend('HTTP', {
            /**
             * @func
             * @name HTTP#constructor
             * @param {string} str - url to get from
             * @returns {HTTP} new ajax object
             */
            parse: parse,
            constructor: function (str) {
                var promise, url, thingToDo, typeThing, type, ajax = this,
                    method = 'onreadystatechange',
                    // Add a cache buster to the url
                    // ajax.async = BOOLEAN_TRUE;
                    xhrReq = new XMLHttpRequest();
                // covers ie9
                if (!isUndefined(XDomainRequest)) {
                    xhrReq = new XDomainRequest();
                    method = 'onload';
                }
                if (!isObject(str)) {
                    str = str || EMPTY_STRING;
                    type = GET;
                    typeThing = str.toUpperCase();
                    if (indexOf(validTypes, typeThing) !== -1) {
                        type = typeThing;
                    } else {
                        url = str;
                    }
                    str = {
                        url: url || EMPTY_STRING,
                        type: type
                    };
                }
                ajax.options = _.extend({
                    async: BOOLEAN_TRUE,
                    method: method,
                    type: type,
                    requestObject: xhrReq
                }, str);
                Promise[CONSTRUCTOR].call(ajax, function () {
                    var type = ajax.options.type,
                        url = ajax.options.url,
                        args = [],
                        data = ajax.options.data;
                    if (isObject(url) && !isArray(url)) {
                        url = stringifyQuery(url);
                    }
                    if (!url || !type) {
                        return exception('http object must have a url and a type');
                    }
                    ajax.attachResponseHandler();
                    xhrReq.open(type, url, ajax.options.async);
                    if (data) {
                        args.push(stringify(data));
                    }
                    ajax.headers(ajax.options.headers);
                    attachBaseListeners(ajax);
                    // have to wrap in set timeout for ie
                    setTimeout(sendthething(xhrReq, args, ajax));
                });
                return ajax;
            },
            status: function (code, handler) {
                return this.handle(STATUS + COLON + code, handler);
            },
            headers: function (headers) {
                var ajax = this,
                    xhrReq = ajax.requestObject;
                each(headers, function (val, key) {
                    xhrReq.setRequestHeader(key, val);
                });
                return ajax;
            },
            /**
             * @description specialized function to stringify url if it is an object
             * @returns {string} returns the completed string that will be fetched / posted / put / or deleted against
             * @name HTTP#getUrl
             */
            /**
             * @description makes public the ability to attach a response handler if one has not already been attached. We recommend not passing a function in and instead just listening to the various events that the xhr object will trigger directly, or indirectly on the ajax object
             * @param {function} [fn=handler] - pass in a function to have a custom onload, onreadystatechange handler
             * @returns {ajax}
             * @name HTTP#attachResponseHandler
             */
            auxiliaryStates: function () {
                return {
                    // cross domain error
                    'status:0': FAILURE,
                    'status:200': SUCCESS,
                    'status:202': SUCCESS,
                    'status:204': SUCCESS,
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
                    'timeout': FAILURE,
                    'abort': FAILURE
                };
            },
            attachResponseHandler: function () {
                var ajax = this,
                    xhrReqObj = ajax.options.requestObject,
                    hasFinished = BOOLEAN_FALSE,
                    method = ajax.options.method,
                    handler = function (evnt) {
                        var status, doIt, allStates, rawData, xhrReqObj = this;
                        if (!xhrReqObj || hasFinished) {
                            return;
                        }
                        status = xhrReqObj[STATUS];
                        rawData = xhrReqObj.responseText;
                        if (method === 'onload' || (method === 'onreadystatechange' && xhrReqObj[READY_STATE] === 4)) {
                            allStates = result(ajax, 'allStates');
                            rawData = ajax.options.preventParse ? rawData : ajax.parse(rawData);
                            hasFinished = BOOLEAN_TRUE;
                            ajax.resolveAs(STATUS + COLON + xhrReqObj[STATUS], rawData);
                        }
                    };
                if (!xhrReqObj[method]) {
                    xhrReqObj[method] = handler;
                }
                return ajax;
            }
        });
    _.foldl(validTypes, function (memo, key_) {
        var key = key_;
        key = key.toLowerCase();
        memo[key] = function (url, options) {
            return HTTP(_.extend({
                type: key_,
                url: url
            }, options));
        };
    }, HTTP);
});