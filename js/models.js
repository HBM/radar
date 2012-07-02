define(['ember','app'],function(Ember,JetViewer){
    Ember = window.Ember;
    JetViewer.Base = Ember.Object.extend({
        path: null,
        name:null,
        parent: null,                    
        selected: false,
        toggling: false,
        toggleSelected: function(){
            //                        event.preventDefault();
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
            JetViewer.callMethod(this.get('path'),args,callbacks);
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
        change: function(new_val,callbacks) {    
            JetViewer.changeState(this.get('path'),new_val,{
                success: function() {                            
                    console.log('SET SUCCEEDED');
                    if(callbacks.success) {
                        callbacks.success();
                    }
                },
                error: function(err) {
                    console.log('SET FAILED',err);
                    if(callbacks.error) {
                        callbacks.error(err);
                    }
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
    return JetViewer;
});
