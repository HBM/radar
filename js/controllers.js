define(['ember','app','jquery','models'],function(Ember,Radar,$){
    Radar.Container = Ember.ArrayProxy.extend({                    
        factory: null,
        create: function(n){
            var content = this.get('content');
            var obj = this.factory.create({path:n.path});
            for(var key in n.data) {
                obj.set(key,n.data[key]);
            }            
            content.pushObject(obj);
        },
        destroy: function(n){
            var content = this.get('content');
            content.filterProperty('path',n.path).forEach(content.removeObject,content);
        }
    });

    Radar.nodesController = Radar.Container.create({
        content: Ember.A(), 
        factory: Radar.Node,
        
    });

    Radar.statesController = Radar.Container.create({
        factory: Radar.State,
        content: Ember.A(), 
        updateChild: function(n){
            var state = this.findProperty('path',n.path);
            state.set('value',n.data.value);
        }
    });

    Radar.methodsController = Radar.Container.create({
        content: Ember.A(), 
        factory: Radar.Method
    });

    Radar.LogEntry = Ember.Object.extend({
        path: null,
        event: null,
        data: null,
        init: function() {
            this.set('date',new Date());
        }
    });

    Radar.logEntriesController = Ember.ArrayProxy.create({
        content: [],
        add: function(obj) {
            this.pushObject(obj);
            if(this.content.length > 1000) {
                this.popObject();
            }
        }
    });

    Radar.treeController = Ember.Object.create({
        directory:'',
        nodesBinding: Ember.Binding.oneWay('Radar.nodesController.content'),
        statesBinding: Ember.Binding.oneWay('Radar.statesController.content'),
        methodsBinding: Ember.Binding.oneWay('Radar.methodsController.content'),
        breadcrumbs: function(){
            var that = this;
            var i;
            var bcs = [];
            bcs.push(Ember.Object.create({
                name: 'root',
                path: '',
                childNodes: this.get('nodes').filterProperty('parent',''),
                childMethods: this.get('methods').filterProperty('parent',''),
                childStates: this.get('states').filterProperty('parent','')
            }));
            if(this.directory.length>0) { 
                var dirs = this.directory.split('/');
                var fullPath = '';
                for(i = 0; i < dirs.length; ++i) {
                    fullPath += dirs[i];
                    bcs.push(Ember.Object.create({
                        path: fullPath,
                        name: dirs[i],
                        childNodes: this.get('nodes').filterProperty('parent',fullPath),
                        childMethods: this.get('methods').filterProperty('parent',fullPath),
                        childStates: this.get('states').filterProperty('parent',fullPath)
                    }));
                    fullPath += '/';
                }
            }                        
            return bcs;
        }.property('directory','nodes.@each','methods.@each','states.@each')
    });

    
    Radar.selector = Ember.Object.create({
        statesBinding: 'Radar.statesController.content',
        methodsBinding: 'Radar.methodsController.content',
        paths: Ember.A(),
        itemWatcher: function() {
            var states = this.get('states');
            var methods = this.get('methods');
            var paths = this.get('paths');
            methods.forEach(function(method){
                var path = method.get('path');
                method.set('selected',paths.indexOf(path) !== -1);
            });
            states.forEach(function(method){
                var path = method.get('path');
                method.set('selected',paths.indexOf(path) !== -1);
            });
        }.observes('states.@each','methods.@each','paths.@each'),
    });
    
    Radar.DashController = Ember.Controller.extend({
        statesBinding: Ember.Binding.oneWay('Radar.statesController.content'),
        methodsBinding: Ember.Binding.oneWay('Radar.methodsController.content'),
        selectedStates: function() {
            return this.get('states').filterProperty('selected',true);                        
        }.property('states.@each.selected'),
        selectedMethods: function() {
            return this.get('methods').filterProperty('selected',true);
        }.property('methods.@each.selected'),
    });

    Radar.DashToolbarController = Ember.Object.extend({});

    Radar.searchController = Ember.Object.create({
        statesBinding: Ember.Binding.oneWay('Radar.statesController.content'),
        methodsBinding: Ember.Binding.oneWay('Radar.methodsController.content'),
        searchExpression:'',
        allMatches: function() {
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
        }.property('searchExpression','states.@each','methods.@each'),
        first20Matches: function() {
            return this.get('allMatches').slice(0,20);
        }.property('allMatches')
    });
   
    Radar.initJet = function() {
        var debug = false;
        if (debug) {
            Radar.State.reopen({
                change: function(newVal) {
                    this.set('value',newVal);
                }
            });
            Radar.Method.reopen({
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
            Radar.set('status','debug');
            Radar.nodesController.create({
                path: 'test'
            });
            Radar.statesController.create({
                path: 'test.horst',
                value: 1234,
                schema: {
                    read_only: true
                }
            });
            Radar.statesController.create({
                path: 'test.peter',
                value: 'hallo',
                schema: 'asdds'
            });
            Radar.statesController.create({
                path: 'test.horst',
                value: {sub:111,pi:3.1415},
                schema: 'asdds'
            });
            Radar.methodsController.create({
                path: 'test.funcy'
            });
            Radar.methodsController.create({
                path: 'test.popoapoapoa'
            });
        }
        else {
            var newWebsocket = function(url,protocol) {
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
            var wsURL = 'ws://' + (window.document.domain || 'localhost')+ ':11123';
            var ws = newWebsocket(wsURL,'jet');
            ws.onopen = function() {
	        var pending = {};
	        var id = 0;
                var dispatchNotification = function(n) {
                    var info = n.params;
//                    var logEntry = Radar.LogEntry.create(info);                    
//                    Radar.logEntriesController.add(logEntry);
//                    info.data.schema = {};
                    if(info.event=='add') {               
                        Radar[info.data.type+'sController'].create(info);
                    }
                    else if(info.event=='remove') {
                        Radar[info.data.type+'sController'].destroy(info);
                    }
                    else if(info.event=='change') {
                        Radar.statesController.updateChild(info);
                    }
                    else {
                        console.log('unhandled Notification',n);
                    }
                };

	        ws.onmessage = function(wsMessage) {
                    var i;
                    var messageObject;
                    var isDefined = function(x) {
                        return !Ember.none(x);
                    };
                    var isResponse = function(message) {
                        return isDefined(message.id) && (isDefined(message.result) || isDefined(message.error));
                    };
                    var isNotification = function(message) {
                        return isDefined(message.method) && isDefined(message.params);
                    }
                    var isBatch = $.isArray;
                    var dispatchSingleMessage = function(message) {                        
                        if (isResponse(message)) {
                            if (pending[message.id]) {
                                pending[message.id](message);
                            }
                            else {
                                console.log('Unknwon response',message.id);
                            }
                        }
                        else if(isNotification(message)) {
                            dispatchNotification(message);
                        }
                        else {
                            console.log('message is neither Response nor Notification',message);
                        }
                    };
                    Ember.set('Radar.network.receiving',true);
                    $('body').css('cursor','progress');
                    
                    try {
		        messageObject = JSON.parse(wsMessage.data);
                    }
                    catch(e) {
                        console.log('Message is no valid JSON',wsMessage.data,e);
                        Ember.set('Radar.network.receiving',false);
                        $('body').css('cursor','');
                        return;
                    }                
                    try {
                        if(isBatch(messageObject)) {                            
                            for(i = 0; i < messageObject.length; ++i) {
                                dispatchSingleMessage(messageObject[i]);
                            }                        
                        }
                        else {
                            dispatchSingleMessage(messageObject);  
                        }
                    }
                    catch(e) {
                        console.log('Error processing',wsMessage.data,e);
                    }
                    Ember.set('Radar.network.receiving',false);
                    $('body').css('cursor','');
	        };
                
	        rpc = function(method,params,callbacks) {
                    var request = {
		        method: method,
		        params: params                            
                    };
                    var onResponse = function(response) {
                        if(typeof(response.result) !== 'undefined' && response.result !== null ) {
                            if(callbacks.success) {
                                callbacks.success(response.result);
                            }
                        }
                        else {
                            if(callbacks.error) {
                                callbacks.error(response.error);
                            }
                        }
                    };
                    id += 1;
                    request.id = id;                    
                    pending[id] = onResponse;
                    ws.send(JSON.stringify(request));                    
                };
	        

                Radar.changeState = function(prop,val,callbacks) {
                    callbacks = callbacks || {};
                    rpc('set',{path:prop,value:val},callbacks);
                    
                };

                Radar.callMethod = function(method,args,callbacks) {
                    callbacks = callbacks || {};
                    rpc('call',{path:method,args:args},callbacks);
                };                

	        var fetch = function(path,callbacks) {
                    callbacks = callbacks || {};    
                    rpc('fetch',{id:'radar',match:['.*']},callbacks);
                };

                fetch();
                Radar.set('status','on');
                //            that.fetch();
            };
        }
    }
//    });// document ready
    
    return Radar;
});
