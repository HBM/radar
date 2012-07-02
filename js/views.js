define(['/js/jquery.js.gz',
        '/js/bootstrap-tab.js',
        '/js/ember.js.gz',
        'app',
        'text!/templates/dash.handlebars',
        'text!/templates/main.handlebars',
        'text!/templates/nodes.handlebars',
        'text!/templates/search.handlebars',
        'text!/templates/tree-element.handlebars',],
       function(_,bs,Ember,JetViewer,dashTemplate,mainTemplate,nodesTemplate,searchTemplate,treeElementTemplate) {
            
            Ember = window.Ember;
            JetViewer = window.JetViewer;
           $ = window.jQuery;
            

            
            JetViewer.TreeView = Ember.View.extend({
                template: Ember.Handlebars.compile(nodesTemplate),
        directoryBinding: Ember.Binding.oneWay('JetViewer.treeController.directory'),
        childStatesBinding: Ember.Binding.oneWay('JetViewer.treeController.childStates'),
        childNodesBinding: Ember.Binding.oneWay('JetViewer.treeController.childNodes'),
        childMethodsBinding: Ember.Binding.oneWay('JetViewer.treeController.childMethods'),
        breadcrumbsBinding: Ember.Binding.oneWay('JetViewer.treeController.breadcrumbs'),
        clickBreadcrumb: function(event) {
            event.preventDefault();
            var dir = event.context.get('path');                        
            this.setDirectory(dir);
        },
        setDirectory: function(dir) {
            JetViewer.treeController.set('directory',dir);
        }
    });

    JetViewer.DashView = Ember.View.extend({
        template: Ember.Handlebars.compile(dashTemplate),
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
        }
    });

    JetViewer.AutoHeightTextArea = Ember.TextArea.extend({
        didInsertElement: function() {
            this.heightAdjuster();
            this.$().val(this.get('value'));
        },
        heightAdjuster: function() {
            var value = this.get('value').toString();
            var lines = value.split('\n').length;                                
            var px = lines*18;
            if (lines > 1) {
                px += 10;
            }
            var heightStyle = '' + px + 'px';
            this.$().height(heightStyle);
        }.observes('value')
    });

    JetViewer.StateRowView = Ember.View.extend({
        badgeStyle: Ember.computed(function() {
            if(this.get('item').get('history').get('updateCount') < 1) { 
                return 'display: none;';
            }
            return '';                        
        }).property('item.history.@each'),
        isDisabled: true,
        buttonResetter: function() {
            if (this.inputView) {
                if(!this.inputView.get('uncomittedChanges')) {
                    this.inputView.controlGroup().removeClass('warning');
                    this.inputView.controlGroup().removeClass('error');
                    this.set('isDisabled',true);
                }                                
            }
        }.observes('item.value'),
        JSONInputView: Ember.TextArea.extend({
            didInsertElement: function() {
                this.heightAdjuster();
                this.$().val(this.get('value'));
                if(this.get('isReadonly')) {
                    this.$().attr('readonly',true);
	                   this.$().css('resize','none');
                }
            },
            value: Ember.computed(function(){               
                var value = this.get('parentView').get('item').get('value');
                if (this.get('uncomittedChanges')) {
                    return this.$().val(); 
                }
                return JSON.stringify(value,undefined,2);
            }).property('parentView.item.value'),
            controlGroup: function() {
                return this.$().parent('.control-group');
            },
            heightAdjuster: function() {
                var lines = this.get('value').split('\n').length;                                
                var px = lines*18;
                if (lines > 1) {
                    px += 10;
                }
                var heightStyle = '' + px + 'px';
                this.$().height(heightStyle);
            }.observes('value'),
            focusIn: function() {
                this.set('uncomittedChanges',true);
            },
            keyUp: function() {
                var controlGroup = this.controlGroup();
                var parent = this.get('parentView');
                try {
                    var oldValueJSON =  JSON.stringify(parent.get('item').get('value'));
                    var newValueJSON =  JSON.stringify(JSON.parse(this.$().val()));
                    controlGroup.removeClass('error');
                    controlGroup.removeClass('warning');
                    if (newValueJSON !== oldValueJSON) {
                        this.set('hasChanged',true);
                        controlGroup.addClass('warning');
                        parent.set('isDisabled',false);
                    }
                    else {
                        this.set('hasChanged',false);
                        parent.set('isDisabled',true);
                    }
                }
                catch(e) {
                    this.set('hasChanged',false);
                    parent.set('isDisabled',true);
                    controlGroup.addClass('error');
                }
            }
        }),
        changeState: function() {
            if (this.get('isDisabled') == false) {
                this.inputView.set('uncomittedChanges',false);
                var oldValue = this.get('item').get('value');
                var that = this;
                var revert = function() {
                    that.inputView.controlGroup().removeClass('warning');
                    that.inputView.controlGroup().removeClass('error');
                    that.set('isDisabled',true);
                    that.inputView.$().val(JSON.stringify(oldValue,null,2));                    
                }
                try {
                    var newValue =  JSON.parse(this.inputView.$().val());
                    console.log('setting',this.get('item').get('path'),'to',newValue);
                    this.get('item').change(newValue,{
                        success: function(){
                            that.set('error',false);
                        },
                        error: function(err){
                            revert();
                            var err_string = JSON.stringify(err,null,2);                            
                            that.set('error',err_string);
                            console.log('error:',err_string);
                        }
                    });
                }
                catch(e) {
                    revert();
                    console.log('ERROR:',e);
                }
            }
        },
        showHistory: false,
        toggleHistory: function(event) {
            event.preventDefault();
            this.toggleProperty('showHistory');
        },
        unselect: function() {
            this.get('item').set('selected',false);
        },
    });


    JetViewer.MethodRowView = Ember.View.extend({
        isDisabled: true,
        JSONArrayInputView: Ember.TextArea.extend({
            didInsertElement: function() {
                this.$().height('18px');
            },
            controlGroup: function() {
                return this.$().parent('.control-group');
            },
            keyUp: function() {
                var controlGroup = this.controlGroup();
                var parent = this.get('parentView');
                try {
                    var args = JSON.parse(this.$().val());
                    if ($.isArray(args)) {
                        controlGroup.removeClass('error');
                        parent.set('isDisabled',false);
                    }
                    else {
                        controlGroup.addClass('error');
                        parent.set('isDisabled',true);
                    }
                }
                catch(e) {
                    controlGroup.addClass('error');
                    parent.set('isDisabled',true);
                }
            }
        }),
        callMethod: function() {
            if (this.get('isDisabled') == false) {
                var that = this;
                try {
                    var args = JSON.parse(this.inputView.$().val());
                    this.set('isDisabled',true);
                    console.log('calling',this.get('item').get('path'));
                    this.get('item').call(args,{
                        success: function(res) {
                            var res_string = JSON.stringify(res,null,2);
                            that.set('isDisabled',false);
                            that.set('error',false);                            
                            that.set('result',res_string);
                            console.log('success');
                        },
                        error: function(err) {
                            var err_string = JSON.stringify(err,null,2);
                            that.set('isDisabled',false);
                            that.set('result',false);
                            that.set('error',err_string);
                            console.log('error');
                        }
                    });
                }
                catch(e) {
                    console.log('ERROR:',e);
                }
            }
        },
        unselect: function() {
            this.get('item').set('selected',false);
        },
    });

    JetViewer.TreeElementView = Ember.View.extend({
        template: Ember.Handlebars.compile(treeElementTemplate),
        isSelectedBinding: 'item.selected',
        isNotSelectedBinding: Ember.Binding.not('item.selected'),
        toggleSelected:function(event) {
            // dont let default <a> click handler apply (reloads page with href)
            event.preventDefault();                            
            var selected = this.get('item').toggleSelected();
        },
    });

    JetViewer.LeafView = JetViewer.TreeElementView.extend({
        isLeaf: true,
        onIconClick: function(event) {
            event.preventDefault();
        },
        onNameClick: function(event) {
            this.toggleSelected(event);
        }
    });

    JetViewer.NodeView = JetViewer.TreeElementView.extend({
        isNode: true,
        changeDirectory: function(event) {
            // dont let default <a> click handler apply (reloads page with href)
            event.preventDefault();
            JetViewer.treeController.set('directory',this.get('item').get('path'));
        },
        onIconClick: function(event) {
            this.changeDirectory(event);
        },
        onNameClick: function(event) {
            this.changeDirectory(event);            
        }
    });

    JetViewer.SearchView = Ember.View.extend({
        template: Ember.Handlebars.compile(searchTemplate),
        matchesBinding: 'JetViewer.searchController.matches',
        searchExpressionBinding: 'JetViewer.searchController.searchExpression',
        inputView: Ember.TextField.extend({
            valueBinding: 'parentView.searchExpression',
        }),
        selectAll: function(event) {
            event.preventDefault();
            this.get('matches').forEach(function(item) {
                item.set('selected',true);
            });
        },
        unselectAll: function(event) {
            event.preventDefault();
            this.get('matches').forEach(function(item) {
                item.set('selected',false);
            });
        }
    });
    
    JetViewer.MainView = Ember.View.extend({
        template: Ember.Handlebars.compile(mainTemplate),
        versionBinding: 'JetViewer.version',
        statusBinding: 'JetViewer.status',
        labelType: Ember.computed(function(){
            var status = JetViewer.get('status');
            if( status=='online' ){
                return 'label-success';
            }
            else if (status=='offline'){
                return 'label-important';
            }                
            return 'label-warning';
        }).property('JetViewer.status'),
        didInsertElement: function(){
            // init bootstrap tabs
            this.$('#select_tab a').click(function(e) {
                e.preventDefault();
                $(this).tab('show');
            });
            this.$('#select_tab a:first').tab('show');
        }
    });
    return JetViewer;
});

