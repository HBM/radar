define(['/js/ember.js.gz','app'],function(Ember,JetViewer){
    Ember = window.Ember;
    JetViewer.Base = Ember.Object.extend({
        path: null,
        name:null,
        parent: null,                    
        selected: false,
        init: function(){
            var parentNodes;
            var that = this;
            var parent = this.get('path').substring(0,this.path.lastIndexOf('.'))
            this.set('name',this.get('path').split('.').pop());
            this.set('parent',parent);  
            if(parent !== '' ) {                
                parentNodes = JetViewer.nodesController.content.filterProperty('path',this.parent);
                if(parentNodes && parentNodes[0]) {
                    if( parentNodes[0].get('selected') ) {
                        this.set('selected',true);
                    }
                    parentNodes[0].addObserver('selected',this,function(sender,key,value,rev){
                        console.log(sender,key,value,rev,this,that);
                        that.set('selected',value);
                    });
                }
            }
        }
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
            var date;
            var prev = this.get('prev');
            if(arguments.length===1) {
                return prev.value;
            }
            else {
                if(prev) {
                    this.get('history').add(prev);
                }    
                date = new Date();
                var days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];                
                this.set('prev',{
                    date:{
                        time: date.toLocaleTimeString(),
                        day: days[date.getDay()-1]
                    },
                    value:value
                });
                return value;
            }
        }),
        init: function(){
            this.history = Ember.ArrayProxy.create({
                content: [],
                updateCount: 0,
                add: function(value) {                            
                    if(this.content.length > 3) {
                        this.popObject();
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
