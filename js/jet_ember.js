define(
    ['jquery','event','ember','underscore'],
    function($,event,ember){
        var _ = window._;
        var connect = function(){
            var xxx = 0;
            var ping_ws;
            var reformatNotification = function(notification) {
                var parts = notification.method.split(':');
                var path = parts[0];
                var ename = parts[1];
                var name = path.substring(path.lastIndexOf('.')+1);
                var parent = path.substring(0,path.lastIndexOf('.'));                      
                return {
                    event : ename,
                    data : notification.params[0],
                    path : path,
                    parent : parent,
                    name : name,
                    depth:path.split('.').length
                };
            }

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
		var notification;
		var call;        
		var that = {};
		var pending = {};
		var id = 0;
                window.JetViewer = Ember.Application.create();

                JetViewer.Base = Ember.Object.extend({
                    path: null,
                    name:null,
                    parent: null,                    
                    selected: false,
                    toggling: false,
                    toggleSelected: function(){
                        this.set('toggling',true);
                        this.toggleProperty('selected');
                        this.set('toggling',false);
                    },                    
                    init: function(){
                        this.set('name',this.get('path').split('.').pop());
                        this.set('parent',this.get('path').substring(0,this.path.lastIndexOf('.')));  
                    },
                    watchParentIsSelected: function(){
                        var parent_nodes;
                        var parent;                        
                        if(this.parent !== '' && !this.get('toggling')) {
                            parent_nodes = JetViewer.nodesController.content.filterProperty('path',this.parent);
                            if(parent_nodes && parent_nodes[0]) {
                                parent = parent_nodes[0];
                                this.set('selected',parent.get('selected'));                           
                            }                            
                        }
                    }.observes('JetViewer.nodesController.content.@each.selected')
                });

                JetViewer.Method = JetViewer.Base.extend({
                    schema: null,
                    init: function(){
                        this._super();
                        //console.log('JetViewer.methodsController.create({path:"'+this.path+'"});');
                    },
                    call: function(args,callbacks) {
                        that.call(this.get('path'),args,callbacks);
                    },
                });

                JetViewer.State = JetViewer.Base.extend({
                    schema: null,
                    prev: null,                    
                    value: Ember.computed(function(key,value) {
                        var prev = this.get('prev');
                        if(arguments.length===1) {
                            return prev.value;
                        }
                        else {
                            if(prev) {
                                this.get('history').add(prev);
                            }
                            this.set('prev',{date:new Date(), value:value});
                            return value;
                        }
                    }),
                    init: function(){
                        this.history = Ember.ArrayProxy.create({
                            content: [],
                            updateCount: 0,
                            add: function(value) {                            
                                if(this.length > 10) {
                                    this.shiftObject();
                                }
                                this.incrementProperty('updateCount');
                                this.unshiftObject(Ember.Object.create(value));
                            }
                        });
                        this._super();
                        //console.log('JetViewer.statesController.create({path:"'+this.path+'"});');
                    },
                    change: function(new_val) {    
                        that.set(this.get('path'),new_val,{
                            success: function() {                            
                                console.log('SET SUCCEEDED');
                            },
                            error: function() {
                                console.log('SET FAILED');
                            }
                        });
                    },
                });

                JetViewer.Node = JetViewer.Base.extend({
                    states: [],
                    methods: [],
                    nodes: [],
                    init: function(){
                        this._super();
                        //console.log('JetViewer.nodesController.create({path:"'+this.path+'"});');
                    },
                });

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

                JetViewer.treeView = Ember.View.create({
                    templateName:  'ember-nodes-template',
                    directoryBinding: Ember.Binding.oneWay('JetViewer.treeController.directory'),
                    childStatesBinding: Ember.Binding.oneWay('JetViewer.treeController.childStates'),
                    childNodesBinding: Ember.Binding.oneWay('JetViewer.treeController.childNodes'),
                    childMethodsBinding: Ember.Binding.oneWay('JetViewer.treeController.childMethods'),
                    breadcrumbsBinding: Ember.Binding.oneWay('JetViewer.treeController.breadcrumbs'),
                    clickBreadcrumb: function(event) {
                        var dir = event.context.get('path');
                        this.setDirectory(dir);
                    },
                    setDirectory: function(dir) {
                        JetViewer.treeController.set('directory',dir);
                    }
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

                JetViewer.dashView = Ember.View.create({
                    templateName:'ember-dash-template',
                    selectedStatesBinding: Ember.Binding.oneWay('JetViewer.selectedController.selectedStates'),
                    selectedMethodsBinding: Ember.Binding.oneWay('JetViewer.selectedController.selectedMethods')
                });

                
                JetViewer.FadeInView = Ember.View.extend({
                    isVisible: false,
                    didInsertElement: function(){
                        this.$().slideDown();
                    },
                    destroyElement: function(){
                        this.$().slideUp();
//                        this._super();
                    }
                });

                JetViewer.StateRowView = Ember.View.extend({
                    badgeStyle: Ember.computed(function() {
                        if(this.get('item').get('history').get('updateCount') < 1) { 
                            return 'display: none;';
                        }
                        return '';                        
                    }).property('item.history.@each'),
                    JSONArrayInputView: Ember.View.extend({
                        templateName: 'ember-json-array-input-template',
                        inputView: Ember.TextField.extend({                            
                            valueBinding: Ember.Binding.oneWay('parentView.item.value').transform(function(value,binding){                      
                                return JSON.stringify(value);
                            }),
                            change: function() {
                                try {
                                    var newValue =  JSON.parse(this.get('value'));
                                    console.log('setting',this.get('parentView').get('item').get('path'),'to',newValue);
                                this.get('parentView').get('item').change(newValue);
                                }
                                catch(e) {
                                    console.log('ERROR:',e);
                                }
                            }
                        })
                    }),
                    showHistory: false,
                    toggleHistory: function() {
                        this.toggleProperty('showHistory');
                    },
                    unselect: function() {
                        this.get('item').set('selected',false);
                    },
                });

                JetViewer.MethodRowView = Ember.View.extend({
                    JSONArrayInputView: Ember.View.extend({
                        templateName: 'ember-json-array-input-template',
                        inputView: Ember.TextField.extend({
                            callMethod: function() {
                                try {
                                    var args = JSON.parse('[' + this.get('value') + ']');
                                    console.log('calling',this.get('parentView').get('item').get('path'));
                                    this.get('parentView').get('item').call(args,{
                                        success: function() {
                                            console.log('success');
                                        },
                                        error: function() {
                                            console.log('error');
                                    }
                                    });
                                }
                                catch(e) {
                                    console.log('ERROR:',e);
                                }
                            },
                            insertNewline: function() {
                                this.callMethod();
                            }
                        })
                    }),
                    unselect: function() {
                        this.get('item').set('selected',false);
                    }
                });

                JetViewer.TreeElementView = Ember.View.extend({
                    templateName: 'ember-tree-element-template',
                    isSelectedBinding: 'item.selected',
                    isNotSelectedBinding: Ember.Binding.not('item.selected'),
                    toggleSelected:function() {
                        var selected = this.get('item').toggleSelected();
                    },
                    onClick: function() {
                        toggleSelected();
                        this.get('parentView').setDirectory(this.get('item').get('path'));
                    }
                });

                JetViewer.LeafView = JetViewer.TreeElementView.extend({
                    isLeaf: true                   
                });

                JetViewer.NodeView = JetViewer.TreeElementView.extend({
                    isNode: true,
                    onClick: function() {
                        JetViewer.treeController.set('directory',this.get('item').get('path'));
                    }
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

                JetViewer.searchView = Ember.View.create({
                    templateName:  'ember-search-template',
                    matchesBinding: 'JetViewer.searchController.matches',
                    searchExpressionBinding: 'JetViewer.searchController.searchExpression',
                    inputView: Ember.TextField.extend({
                        valueBinding: 'parentView.searchExpression',
                    }),
                    selectAll: function() {
                        this.get('matches').forEach(function(item) {
                            item.set('selected',true);
                        });
                    },
                    unselectAll: function() {
                        this.get('matches').forEach(function(item) {
                            item.set('selected',false);
                        });
                    }
                });

                JetViewer.dashView.appendTo('#dash');

                JetViewer.treeView.appendTo('#tree');
//                JetViewer.selectedView.appendTo('#ember-selected');
                JetViewer.searchView.appendTo('#search');
//                JetViewer.statesView.appendTo('#ember-states');
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
