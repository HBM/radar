var Jet = (function() {
    var create = function(wsURL, callbacks) {
        wsURL = wsURL || ('ws://' + (window.document.domain || 'localhost') + ':11123');
        var newWebsocket = function(url, protocol) {
            if (navigator.userAgent.search("Firefox") != -1) {
                try {
                    return new WebSocket(url, protocol);
                } catch (e) {
                    return new MozWebSocket(url, protocol);
                }
            } else {
                return new WebSocket(url, protocol);
            }
        };
        var ws = newWebsocket(wsURL, 'jet');
        callbacks.onopen = callbacks.onopen || function() {
            console.log('jet', wsURL, 'connected');
        };
        callbacks.onerror = callbacks.onerror || function(a, b, c) {
            console.log('jet error', a, b, c);
        };
        ws.onopen = callbacks.onopen;
        var dispatchers = {};
        var id = 0;
        var isDefined = function(x) {
            return typeof x !== 'undefined' && x !== null;
        };
        var dispatchSingleMessage = function(message) {
            var dispatch;
            try {
                if (isDefined(message.id)) {
                    dispatch = dispatchers[message.id];
                    dispatch(message.error, message.result);
                } else {
                    dispatch = dispatchers[message.method];
                    dispatch(message.params);
                }
            } catch (e) {
                callbacks.onerror('Dispatching message failed', message, e);
            }
        };
        ws.onmessage = function(wsMessage) {
            var i;
            var messageObject;
            try {
                messageObject = JSON.parse(wsMessage.data);
            } catch (e) {
                console.log('Message is no valid JSON', wsMessage.data, e);
                return;
            }
            if ($.isArray(messageObject)) {
                for (i = 0; i < messageObject.length; ++i) {
                    dispatchSingleMessage(messageObject[i]);
                }
            } else {
                dispatchSingleMessage(messageObject);
            }
        };

        var request = function(method, params, callback) {
            var request = {
                method: method,
                params: params
            };
            if (callback) {
                id += 1;
                request.id = id;
                dispatchers[id] = callback;
            }
            ws.send(JSON.stringify(request));
        };

        var fetchId = 0;

        var instance = {
            set: function(path, val, callback) {
                request('set', {
                    path: path,
                    value: val
                }, callback);
            },
            call: function(path, args, callback) {
                request('set', {
                    path: path,
                    args: args
                }, callback);
            },
            fetch: function(params, fetchcb, callback) {
                params.id = 'f' + fetchId++;
                dispatchers[params.id] = fetchcb;
                request('fetch', params, callback);
            }
        };

        return instance;
    };
    return {
        create: create
    };
})();
