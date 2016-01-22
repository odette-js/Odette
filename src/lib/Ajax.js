application.scope().module('Ajax', function (module, app, _, factories) {
    var gapSplit = _.gapSplit,
        duff = _.duff,
        posit = _.posit,
        extendFrom = _.extendFrom,
        validTypes = gapSplit('GET POST PUT DELETE'),
        baseEvents = gapSplit('progress timeout error abort'),
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
                        ajax.dispatchEvent(evnt, {
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
                try {
                    xhrReq.send.apply(xhrReq, args);
                } catch (e) {
                    // reports on send error
                    factories.reportError('xhr', e + '');
                }
            };
        },
        sendRequest = function (ajax, xhrReq, type, url) {
            var args = [],
                data = ajax.get('data');
            if (url) {
                xhrReq.open(type, url, ajax.get('async'));
                if (data) {
                    args.push(_.stringify(data));
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
        /**
         * @class Ajax
         * @alias _.Ajax
         * @augments Box
         * @augments Model
         * @classdesc XHR object wrapper Triggers events based on xhr state changes and abstracts many anomalies that have to do with IE
         */
        Ajax = _.factories.Ajax = _.extendFrom.Promise('Ajax', {
            events: {
                'alter:url': function () {
                    var ajax = this,
                        xhrReq = ajax.requestObject,
                        type = ajax.get('type'),
                        thingToDo = decide[type] || decide.GET;
                    if (thingToDo) {
                        thingToDo(ajax, xhrReq, type);
                    }
                }
            },
            associativeStates: {
                timeout: true,
                abort: true
            },
            defaults: function () {
                return {
                    async: true,
                    type: 'GET'
                };
            },
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
                // ajax.async = true;
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
                str.type = (str.type || 'GET').toUpperCase();
                str.method = method;
                factories.Promise.apply(ajax);
                _.extend(ajax, secondary);
                /** @member {XMLHttpRequest} */
                ajax.requestObject = xhrReq;
                return ajax.on('error abort timeout', function (e) {
                    factories.reportError('xhr error', e.type);
                }).set(str).always(function (evnt) {
                    ajax.dispatchEvent('status:' + evnt.status, evnt);
                });
            },
            status: function (code, handler) {
                return this.once(_.simpleObject('status:' + code, handler));
            },
            setHeaders: function (headers) {
                var ajax = this,
                    xhrReq = ajax.requestObject;
                _.each(headers, function (val, key) {
                    xhrReq.setRequestHeader(_.unCamelCase(key), val);
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
                if (_.isObject(url) && !_.isArray(url)) {
                    url = _.stringifyQuery(url);
                }
                return url;
            },
            /**
             * @description makes public the ability to attach a response handler if one has not already been attached. We recommend not passing a function in and instead just listening to the various events that the xhr object will trigger directly, or indirectly on the ajax object
             * @param {function} [fn=handler] - pass in a function to have a custom onload, onreadystatechange handler
             * @returns {ajax}
             * @name Ajax#attachResponseHandler
             */
            attachResponseHandler: function (fn) {
                var ajax = this,
                    xhrReqObj = ajax.requestObject,
                    hasSucceeded = 0,
                    method = ajax.get('method'),
                    handler = function (evnt) {
                        var doIt, responseTxt, xhrReqObj = this;
                        if (xhrReqObj && !hasSucceeded) {
                            responseTxt = xhrReqObj.responseText;
                            ajax.dispatchEvent('readychange', [evnt, xhrReqObj]);
                            if (method === 'onreadystatechange') {
                                if (xhrReqObj.readyState === 4) {
                                    doIt = 1;
                                }
                            }
                            if (method === 'onload') {
                                doIt = 1;
                            }
                            if (doIt) {
                                if ((xhrReqObj.status >= 200 && xhrReqObj.status <= 205) || xhrReqObj.status === 304 || xhrReqObj.status === 302) {
                                    responseTxt = _.parse(responseTxt);
                                    ajax.resolve(responseTxt);
                                    ajax.dispatchEvent('load', [responseTxt, evnt, xhrReqObj]);
                                    hasSucceeded = 1;
                                } else {
                                    ajax.reject(evnt, responseTxt);
                                }
                            }
                        }
                    };
                if (_.isFunction(fn)) {
                    handler = fn;
                }
                if (!xhrReqObj[method]) {
                    xhrReqObj[method] = handler;
                }
                return ajax;
            }
        }, !0);
});