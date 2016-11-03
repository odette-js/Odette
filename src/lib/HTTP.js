app.block(function (app) {
    var CATCH = 'catch',
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
        readAndApply = function (ajax, key, e) {
            ajax.resolveAs(key, e);
        },
        basehandlers = {
            // progress: readAndApply,
            timeout: readAndApply,
            abort: readAndApply,
            error: readAndApply
        },
        attachBaseListeners = function (ajax) {
            var prog = 0,
                req = ajax.options.requestObject;
            duff(baseEvents, function (key) {
                if (key === PROGRESS) {
                    // we put it directly on the xhr object so we can
                    // account for certain ie bugs that show up
                    req['on' + key] = function (e) {
                        if (!e) {
                            return;
                        }
                        var percent = (e.loaded / e.total);
                        prog++;
                        ajax[DISPATCH_EVENT](PROGRESS, {
                            percent: percent || (prog / (prog + 1)),
                            counter: prog
                        }, {
                            instigator: e
                        });
                    };
                } else {
                    req['on' + key] = function (e) {
                        return ajax.resolveAs(key, e);
                    };
                }
            });
        },
        sendthething = function (xhrReq, data, ajax) {
            return function () {
                return wraptry(function () {
                    return data ? xhrReq.send(data) : xhrReq.send();
                }, function (e) {
                    ajax.resolveAs(CATCH, e, e.message);
                });
            };
        },
        /**
         * @class HTTP
         * @alias _.HTTP
         * @augments Deferred
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE, and other browsers that have historically had difficulty with ajax requests.
         */
        STATUS_2xx = 'status:2xx',
        STATUS_3xx = 'status:3xx',
        STATUS_4xx = 'status:4xx',
        STATUS_5xx = 'status:5xx',
        cache = {},
        states = function () {
            return {
                // cross domain error
                error: FAILURE,
                'status:0': FAILURE,
                'catch': 'status:0',
                'status:2xx': SUCCESS,
                'status:200': STATUS_2xx,
                'status:202': STATUS_2xx,
                'status:204': STATUS_2xx,
                'status:205': STATUS_2xx,
                'status:3xx': SUCCESS,
                'status:302': STATUS_3xx,
                'status:304': STATUS_3xx,
                'status:4xx': FAILURE,
                'status:400': STATUS_4xx,
                'status:401': STATUS_4xx,
                'status:403': STATUS_4xx,
                'status:404': STATUS_4xx,
                'status:405': STATUS_4xx,
                'status:406': STATUS_4xx,
                'status:408': STATUS_4xx,
                'timeout': 'status:408',
                'status:5xx': FAILURE,
                'status:500': STATUS_5xx,
                'status:502': STATUS_5xx,
                'status:505': STATUS_5xx,
                'status:511': STATUS_5xx,
                'abort': FAILURE
            };
        },
        HTTP = _.HTTP = factories.Deferred.extend('HTTP',
            /**
             * @lends HTTP.prototype
             */
            {
                /**
                 * Sets up auxiliary states for the deferred object to work off of.
                 * @method
                 * @returns {Object} Hash of states and what they resolve to.
                 */
                auxiliaryStates: states,
                /**
                 * Set a parser for the retrieved value. By default the [parse]{@link _.parse} function is used from the {@link _} object, but this can be overwritten if needed. If it is overwritten, the user will have to account for any and all parts of the response. The parse method is not just a JSON.parse. It will account for numbers, as well as wrapped functions, and will check the string for leading and trailing brackets; "{...}" for objects and "[...]" for arrays.
                 * @method
                 * @example <caption>An example of replacing the parse method with a custom method, in this case, just a JSON.parse.</caption>
                 * var http = _.HTTP({
                 *     url: "https://someurl.com",
                 *     type: "get"
                 * });
                 * http.parse = function (response) {
                 *     return JSON.parse(response);
                 * };
                 */
                parse: parse,
                constructor: function (str) {
                    var url, thingToDo, typeThing, type, ajax = this,
                        method = 'onreadystatechange',
                        // Add a cache buster to the url
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
                    var options = ajax.options = merge({
                        async: BOOLEAN_TRUE,
                        method: method,
                        type: type,
                        requestObject: xhrReq,
                        withCredentials: BOOLEAN_TRUE
                    }, str);
                    var headers, cached, key, sending,
                        args = [],
                        data = ajax.options.data;
                    type = ajax.options.type;
                    url = ajax.options.url;
                    if (isObject(url) && !isArray(url)) {
                        url = stringifyQuery(url);
                    }
                    if (!url || !type) {
                        return exception('http object must have a url and a type');
                    }
                    if (data) {
                        data = isObject(data) ? foldl(data, function (memo, value, key) {
                            memo.push(encodeURIComponent(key) + '=' + encodeURIComponent((isObject(value) ? JSON.stringify(value) : (isFunction(value) ? NULL : value))));
                        }, []).join('&') : encodeURIComponent(data);
                    }
                    if (isString(data)) {
                        data = data.replace(/%20/g, '+');
                    }
                    headers = merge({
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    }, ajax.options.headers);
                    if (ajax.options.cacheable) {
                        key = [ajax.options.type, ajax.options.url, stringify(headers), data].join(',');
                        cached = cache[key];
                        if (cached) {
                            return cached;
                        }
                        cache[key] = this;
                    }
                    // have to wrap in set timeout for ie
                    var promise = ajax.promise = Promise(function (success, failure, custom) {
                        var sending = sendthething(xhrReq, data, ajax, success, failure);
                        // attachResponseHandler(ajax);
                        var xhrReqObj = ajax.options.requestObject,
                            hasFinished = BOOLEAN_FALSE,
                            method = ajax.options.method;
                        if (!xhrReqObj[method]) {
                            xhrReqObj[method] = function (evnt) {
                                var type, originalType, lasttype, path, status, doIt, allStates, rawData, xhrReqObj = this;
                                if (!xhrReqObj || hasFinished) {
                                    return;
                                }
                                status = xhrReqObj[STATUS];
                                rawData = xhrReqObj.responseText;
                                if (method === 'onload' || (method === 'onreadystatechange' && xhrReqObj[READY_STATE] === 4)) {
                                    allStates = result(ajax, 'allStates');
                                    rawData = ajax.options.preventParse ? rawData : ajax.parse(rawData);
                                    hasFinished = BOOLEAN_TRUE;
                                    type = STATUS + COLON + (xhrReqObj[STATUS] === UNDEFINED ? 200 : xhrReqObj[STATUS]);
                                    originalType = type;
                                    path = states();
                                    while (isString(type)) {
                                        lasttype = type;
                                        type = path[type];
                                    }
                                    if (lasttype === SUCCESS) {
                                        success(rawData);
                                    } else {
                                        failure(rawData);
                                    }
                                    ajax.resolveAs(originalType, rawData);
                                }
                            };
                        }
                        wraptry(function () {
                            xhrReq.open(type.toUpperCase(), url, ajax.options.async);
                        });
                        ajax.headers(headers);
                        attachBaseListeners(ajax);
                        if (_.isIE) {
                            setTimeout(sending);
                        } else {
                            sending();
                        }
                    }, options.sendAsync ? NULL : BOOLEAN_TRUE);
                    return ajax;
                },
                status: function (code, handler) {
                    return this.handle(STATUS + COLON + code, handler);
                },
                /**
                 * Sets headers on the XMLHttp object that is doing the request.
                 * @method
                 * @param  {Object} headers hash of headers to apply to the request object.
                 * @return {ajax}
                 */
                headers: intendedApi(function (key, val) {
                    this.options.requestObject.setRequestHeader(key, val);
                }),
                /**
                 * Proxy for the promise that is underlying this object. Allows an access point to chain and return regular old promises.
                 * @param  {Function} one Success handler to be called when promise is fulfilled.
                 * @param  {Function} two Failure handler to be called when the promise is rejected.
                 * @return {Promise} Promise that was created for the HTTP object.
                 */
                then: function (one, two) {
                    return this.promise.then(one, two);
                },
                /**
                 * Proxy for the promise underlying this object. Allows a catch / then sequence to occur. (best to use after the success or handle methods).
                 * @param  {Function} one handler to run on promise catch
                 * @return {Promise} internally used promise.
                 */
                catch: function (one) {
                    return this.promise.catch(one);
                }
            });
    _.foldl(validTypes, function (memo, key_) {
        var key = key_;
        key = key.toLowerCase();
        memo[key] = function (url, options) {
            return HTTP(merge({
                type: key_,
                url: url
            }, options));
        };
    }, HTTP);
});