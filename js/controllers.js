define(['ember','models'],function(Ember,JetViewer){
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

    if (true) {
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
                that.call(this.get('path'),args,callbacks);
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
    }
    
    return JetViewer;
});
