define(['/js/ember.js.gz','models'],function(Ember,JetViewer){
    Ember = window.Ember;
    JetViewer.Container = Ember.ArrayProxy.extend({                    
        factory: null,
        create: function(n){
            var obj = this.factory.create({path:n.path});
            for(var key in n) {
                obj.set(key,n[key]);
            }
            this.pushObject(obj);
            //this.pushObject(this.factory.create(n));
        },
        destroy: function(n){
            this.filterProperty('path',n.path).forEach(this.removeObject,this);
        }
    });

    JetViewer.nodesController = JetViewer.Container.create({
        content: [],
        factory: JetViewer.Node
    });

    JetViewer.statesController = JetViewer.Container.create({
        content: [],
        factory: JetViewer.State,
        updateChild: function(n){
            var state = this.findProperty('path',n.path);
            state.set('value',n.value);
            state.get('value');
        }
    });

    JetViewer.methodsController = JetViewer.Container.create({
        content: [],
        factory: JetViewer.Method
    });

    JetViewer.treeController = Ember.Object.create({
        directory:'',
        nodesBinding: Ember.Binding.oneWay('JetViewer.nodesController.content'),
        statesBinding: Ember.Binding.oneWay('JetViewer.statesController.content'),
        methodsBinding: Ember.Binding.oneWay('JetViewer.methodsController.content'),
        childMethods: function(){
            return this.get('methods').filterProperty('parent',this.directory);
        }.property('directory','methods.@each'),
        childStates: function(){
            return this.get('states').filterProperty('parent',this.directory);
        }.property('directory','states.@each'),
        childNodes: function(){
            return this.get('nodes').filterProperty('parent',this.directory);
        }.property('directory','nodes.@each'),
        checkNodeExists: function(){
            var exists = this.directory == '' || this.get('nodes').filterProperty('path',this.directory).get('length') > 0;
            if(!exists) {
                console.log('dir disappeared!',this.directory);
                this.set('directory','');
            }
            
        }.observes('nodes.@each','directory'),
        breadcrumbs: function(){
            var i;
            var bcs = [];
            bcs.push(Ember.Object.create({
                name: 'root',
                path: ''
            }));
            if(this.directory.length>0) { 
                var dirs = this.directory.split('.');
                var fullPath = '';
                for(i = 0; i < dirs.length; ++i) {
                    fullPath += dirs[i];
                    bcs.push(Ember.Object.create({
                        path: fullPath,
                        name: dirs[i]
                    }));
                    fullPath += '.';
                }
            }                        
            return bcs;
        }.property('directory')
    });

    JetViewer.selectedController = Ember.Object.create({
        statesBinding: Ember.Binding.oneWay('JetViewer.statesController.content'),
        methodsBinding: Ember.Binding.oneWay('JetViewer.methodsController.content'),
        nodesBinding: Ember.Binding.oneWay('JetViewer.nodesController.content'),
        selectedStates: function() {
            var s = this.get('states').filterProperty('selected',true);
            return s;
        }.property('states.@each.selected'),
        selectedMethods: function() {
            var s = this.get('methods').filterProperty('selected',true);
            return s;
        }.property('methods.@each.selected'),
    });

    JetViewer.searchController = Ember.Object.create({
        statesBinding: Ember.Binding.oneWay('JetViewer.statesController.content'),
        methodsBinding: Ember.Binding.oneWay('JetViewer.methodsController.content'),
        searchExpression:'horst',
        matches: function() {
            var pathMatches = function(item,index,self) {
                var expr = this.get('searchExpression');
                if( expr !== '' ) {
                    if( item.get('path').indexOf(expr) != -1 ) {
                        return true;
                    }
                }
            };
            var s = this.get('states').filter(pathMatches,this);
            var m = this.get('methods').filter(pathMatches,this);
            return s.concat(m);
        }.property('searchExpression','states.@each','methods.@each')
    });

    var debug = false;
    if (debug) {
        JetViewer.State.reopen({
            change: function(newVal) {
                this.set('value',newVal);
            }
        });
        JetViewer.Method.reopen({
            count: 0,
            call: function(args,callbacks) {
                this.set('count',this.get('count')+1);
                if (this.get('count')%3 == 0) {
                    if(callbacks.error) {
                        callbacks.error({message:"oh ohoh",id:1234});
                    }
                }
                else {
                    if(callbacks.success) {
                        callbacks.success({bla:123});
                    }
                }
            },
        });
        JetViewer.set('status','debug');
        JetViewer.nodesController.create({
            path: 'test'
        });
        JetViewer.statesController.create({
            path: 'test.horst',
            value: 1234,
            schema: {
                read_only: true
            }
        });
        JetViewer.statesController.create({
            path: 'test.peter',
            value: 'hallo',
            schema: 'asdds'
        });
        JetViewer.statesController.create({
            path: 'test.horst',
            value: {sub:111,pi:3.1415},
            schema: 'asdds'
        });
        JetViewer.methodsController.create({
            path: 'test.funcy'
        });
        JetViewer.methodsController.create({
            path: 'test.popoapoapoa'
        });
    }
    else {
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
        /*            ping_ws.onopen = function(){
                var ping = function(){                    
                    var t;
                    t = setTimeout(function(){
                        t = null;
                        event.trigger({event:'close'});
                    },3000);
                    ping_ws.onmessage = function(){
                        clearTimeout(t);
                        setTimeout(ping,3000);
                    }
                    ping_ws.send('ping');
                };
                ping();
            };*/
        var ws = new_websocket('ws://' + window.document.domain + ':8004','jet');
        ws.onopen = function() {
	    var pending = {};
	    var id = 0;
            var makeJetViewerState = function(n) {                    
                var parts = n.method.split(':');
                var path = parts[0];
                var event = parts[1];
                var data = n.params[0];
                var desc = {
                    path: path
                };
                if(path.split('.').length < 20) {
                    if(event=='create') {
                        desc.value = data.value;
                        desc.schema = data.schema;
                        JetViewer[data.type+'sController'].create(desc);
                    }
                    else if(event=='delete') {
                        JetViewer[data.type+'sController'].destroy(desc);
                    }
                    else if(event=='value') {
                        desc.value = data;
                        JetViewer.statesController.updateChild(desc);
                    }
                    else if(event=='schema') {
                        desc.schema = data;
                        JetViewer.statesController.updateChild(desc);
                    }
                }
                else {
                    Ember.Object.create({
                        path: path
                    });
                }
            };

	    ws.onmessage = function(msg) {
                var i;
		var notifications;
                var resp;
                var notification;
                var rpc;
                try {
		    resp = JSON.parse(msg.data);
                    if($.isArray(resp)) {
                        notifications = resp;
			for(i = 0; i < notifications.length; ++i) {
                            console.log(notifications.length);
                            makeJetViewerState(notifications[i]);
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
            
	    rpc = function(method,params,on_response) {
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
	    
	    /*.close = function(){
                ping_ws.close();
                ws.close();
	    }*/

            JetViewer.changeState = function(prop,val,callbacks) {
                callbacks = callbacks || {};
                rpc('set',[prop,val],function(response){
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

            JetViewer.callMethod = function(method,args,callbacks) {
                callbacks = callbacks || {};
                args.unshift(method);
                rpc('call',args,function(response){
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

	    var fetch = function(path,callbacks) {
                callbacks = callbacks || {};                    
                rpc('fetch',[path],function(response){
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
            }();
            JetViewer.set('status','online');
//            that.fetch();
        };
    }
    
    return JetViewer;
});
