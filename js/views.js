define(['jquery','ember','app'],function($,Ember,JetViewer) {
    Ember = window.Ember;
    JetViewer = window.JetViewer;
    JetViewer.TreeView = Ember.View.extend({
        templateName:  'ember-nodes-template',
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
        isDisabled: true,
        buttonResetter: function() {
            if (this.inputView) {
                this.inputView.controlGroup().removeClass('warning');
                this.inputView.controlGroup().removeClass('error');
            }
            this.set('isDisabled',true);
        }.observes('item.value'),
        JSONArrayInputView: Ember.TextArea.extend({
            didInsertElement: function() {
                this.heightAdjuster();
                this.$().val(this.get('value'));
                if(this.get('isReadonly')) {
                    this.$().attr('readonly',true);
                }
            },
            valueBinding: Ember.Binding.oneWay('parentView.item.value').transform(function(value,binding){
                
                return JSON.stringify(value,undefined,2);
            }),
            controlGroup: function() {
                return this.$().parent('.control-group');
            },
            heightAdjuster: function() {
                var lines = this.get('value').split('\n').length;                                
                var heightStyle = '' + lines*18 + 'px';
                this.$().height(heightStyle);
            }.observes('value'),
            keyUp: function() {
                var controlGroup = this.controlGroup();
                try {
                    var parent = this.get('parentView');
                    controlGroup.removeClass('warning');
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
            try {
                var newValue =  JSON.parse(this.inputView.get('value'));
                console.log('setting',this.get('item').get('path'),'to',newValue);
                this.get('item').change(newValue);
            }
            catch(e) {
                console.log('ERROR:',e);
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
        unselect: function(event) {
            event.preventDefault();
            this.get('item').set('selected',false);
        }
    });

    JetViewer.TreeElementView = Ember.View.extend({
        templateName: 'ember-tree-element-template',
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
        templateName:  'ember-search-template',
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

    JetViewer.mainView = Ember.View.create({
        templateName:  'ember-main-template',
        versionBinding: 'JetViewer.version',
        statusBinding: 'JetViewer.status',
        labelType: Ember.computed(function(){
            var status = JetViewer.get('status');
            if( status=='online' ){
          //      this.$('#main').fadeTo('slow',1);
                return 'label-success';
            }
            else if (status=='offline'){
        //        this.$('#main').fadeTo('slow',0.5);
                return 'label-important';
            }                
      //      this.$('#main').fadeTo('slow',1);
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

