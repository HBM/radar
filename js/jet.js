define(
    ['jquery','event','underscore'],
    function($,event,zbus){
        var _ = window._;
        var connect = function(){
            var trigger;
            var trigger_connect;
            var trigger_close;
            var trigger_error;
            var trigger_notification;            
            var ping_ws;
            trigger_close = function(){
                event.trigger({event:'close'});
            };
            trigger_error = function(){
                event.trigger({event:'error'});
            };
            trigger_notification = function(notification){
                var parts = notification.method.split(':');
                var path = parts[0];
                var ename = parts[1];
                var name = path.substring(path.lastIndexOf('.')+1);
                var parent = path.substring(0,path.lastIndexOf('.'));                      
                event.trigger({
                    event : ename,
                    data : notification.params[0],
                    path : path,
                    parent : parent,
                    name : name,
                    depth:path.split('.').length
                });                            
            };

            var new_websocket = function(url,protocol) {
		if( navigator.userAgent.search("Firefox") != -1 ) {
                    try {
		        return new WebSocket(url,protocol);
                    }
                    catch(e) {
                        return new MozWebSocket(url,protocol);
                    }
		}
		else {
		    return new WebSocket(url,protocol);
		}
	    }
            ping_ws = new_websocket('ws://' + window.document.domain + ':8004','ping');
            ping_ws.onopen = function(){
                var ping = function(){                    
                    var t;
                    t = setTimeout(function(){
                        t = null;
                        trigger_close();
                    },3000);
                    ping_ws.onmessage = function(){
                        clearTimeout(t);
                        setTimeout(ping,3000);
                    }
                    ping_ws.send('ping');
                };
                ping();
            };
            var ws = new_websocket('ws://' + window.document.domain + ':8004','jet');
            ws.onopen = function() {
		var notification;
		var call;        
		var that = {};
		var pending = {};
		var id = 0;
		ws.onmessage = function(msg) {
                    var i;
		    var notifications;
                    var resp;
                    try {
		        resp = JSON.parse(msg.data);
                        if($.isArray(resp)) {
                            notifications = resp;
			    for(i = 0; i < notifications.length; ++i) {
			        trigger_notification(notifications[i]);
			    }
                        }
                        else if(resp.id) {
		            pending[resp.id](resp);
                        }
                        else {
                            console.log('message is no batch notifications nor response',msg.data);
                        }
                    }
                    catch(e) {
                        console.log('message is no JSON',msg.data,e);
                    }
		};
                
	        call = function(method,params,on_response) {
                    var request = {
		        method: method,
		        params: params                            
                    };
                    if( $.isArray(params) == false ) {
		        throw "invalid arguments to jet.call";
                    }                            
                    id += 1;
                    request.id = id;
                    pending[id] = on_response;
                    ws.send(JSON.stringify(request));                    
                };
	        
		that.close = function(){
                    ping_ws.close();
                    ws.close();
		}

                that.set = function(prop,val,callbacks) {
                    callbacks = callbacks || {};
                    call('set',[prop,val],function(response){
                        if(response.result) {
                            if(callbacks.success) {
                                callbacks.success();
                            }
                        }
                        else if(response.error) {
                            if(callbacks.error) {
                                callbacks.error(response.error);
                            }
                        }
                    });
                    
                };

		that.call = function(method,args,callbacks) {
                    callbacks = callbacks || {};
                    args.unshift(method);
                    call('call',args,function(response){
                        if(response.result) {
                            if(callbacks.success) {
                                callbacks.success(response.result);
                            }
                        }
                        else if(response.error) {
                            if(callbacks.error) {
                                callbacks.error(response.error);
                            }
                        }
                    });                                    
                };

		that.fetch = function(path,callbacks) {
                    callbacks = callbacks || {};                    
                    call('fetch',[path],function(response){
                        if(response.result) {
                            if(callbacks.success) {
                                callbacks.success(response.result);
                            }
                        }
                        else if(response.error) {
                            if(callbacks.error) {
                                callbacks.error(response.error);
                            }
                        }
                    });                                    
                };
                event.trigger({event:'connect',jet:that});
	    };
	};

        return {
            connect : connect
        };
    }
)
