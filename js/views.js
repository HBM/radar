define(['/js/jquery.js.gz',
        '/js/bootstrap-dropdown.js',
        '/js/ember.js.gz',
        'app',
        'text!/templates/dash.handlebars',
        'text!/templates/main.handlebars',
        'text!/templates/nodes.handlebars',
        'text!/templates/search.handlebars',
        'text!/templates/tree-element.handlebars',
       ],
       function(_,bs,Ember,JetViewer,dashTemplate,mainTemplate,nodesTemplate,searchTemplate,treeElementTemplate,closableTextareaTemplate) {
           
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
                   event.stopPropagation();
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

           JetViewer.AutoHeightTextArea = Ember.TextArea.extend({
               didInsertElement: function() {
                   this.heightAdjuster();
                   this.$().val(this.get('value'));
               },
               heightAdjuster: function() {
                   if( this.get('value')) {
                       var value = this.get('value').toString();
                       var lines = value.split('\n').length;                                
                       var px = lines*18;
                       if (lines > 1) {
                           px += 10;
                       }
                       var heightStyle = '' + px + 'px';
                       this.$().height(heightStyle);
                   }
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
               refreshAvailable: false,
               refreshInputView: function(event){
                   event.preventDefault();
                   this.set('uncomittedChanges',false);
                   this.set('refreshAvailable',false);
                   this.inputView.controlGroup().removeClass('warning');
                   this.inputView.controlGroup().removeClass('error');
                   this.set('isDisabled',true);
                   this.inputView.$().val(JSON.stringify(this.item.get('value'),null,2));
               },
               buttonResetter: function() {
                   if (this.inputView) {
                       if(!this.inputView.get('uncomittedChanges')) {
                           this.inputView.controlGroup().removeClass('warning');
                           this.inputView.controlGroup().removeClass('error');
                           this.set('isDisabled',true);
                       }
                       else {
                           this.set('refreshAvailable',true);
                       }
                   }
               }.observes('item.value'),
               didInsertElement: function() {
                   var that = this;
                   this.$().hover(function(){
                       that.$('.close-badge').show();
                   },function(){
                       that.$('.close-badge').hide();
                   });
               },
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
                       return this.$().parents('.control-group');
                   },
                   heightAdjuster: function() {
                       var lines = this.get('value').split('\n').length;                                
                       var px = lines*18;
                       var heightStyle = '' + px + 'px';
                       this.$().height(heightStyle);
                   }.observes('value'),
                   focusOut: function() {
                       try {
                           var oldValueJSON =  JSON.stringify(parent.get('item').get('value'));
                           var newValueJSON =  JSON.stringify(JSON.parse(this.$().val()));
                           if (newValueJSON == oldValueJSON) {
                               this.set('uncomittedChanges',false);
                           }
                       }
                       catch(e) {
                       }
                   },
                   keyUp: function() {
                       var controlGroup = this.controlGroup();
                       var parent = this.get('parentView');
                       this.set('uncomittedChanges',true);
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
               hideErrorString: function(event) {
                   event.preventDefault();
                   this.set('errorString',null);
               },
               changeState: function() {
                   if (this.get('isDisabled') == false) {
                       this.inputView.set('uncomittedChanges',false);
                       this.set('refreshAvailable',false);
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
                               error: function(err){                            
                                   console.log('error:',err);
                                   revert();        
                                   that.set('errorString',JSON.stringify(err,null,2));
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
               toggleShowHistory: function(event) {
                   event.preventDefault();
                   this.toggleProperty('showHistory');
               },
               unselect: function() {
                   this.get('item').set('selected',false);
               },
           });


           JetViewer.MethodRowView = Ember.View.extend({
               isDisabled: true,
               didInsertElement: function() {
                   var that = this;
                   this.$().hover(function(){
                       that.$('.close-badge').show();
                   },function(){
                       that.$('.close-badge').hide();
                   });
               },
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
                           var input = this.$().val();
                           if( input === '') {
                               controlGroup.removeClass('error');
                               parent.set('isDisabled',true);
                               return;
                           }
                           var args = JSON.parse(input);
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
               hideResult: function(event) {
                   event.preventDefault();
                   this.set('result',null);
               },
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
                                   that.set('result',Ember.Object.create({
                                       isSuccess: true,
                                       jsonString: res_string
                                   }));
                                   console.log('success');
                               },
                               error: function(err) {
                                   var err_string = JSON.stringify(err,null,2);
                                   that.set('isDisabled',false);
                                   that.set('result',Ember.Object.create({
                                       isError: true,
                                       jsonString: err_string
                                   }));
                                   console.log('error',err_string);
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
                   event.stopPropagation();                       
                   this.get('item').toggleProperty('selected');
               },
           });

           JetViewer.LeafView = JetViewer.TreeElementView.extend({
               isLeaf: true,
               onIconClick: function(event) {
                   event.stopPropagation();
               },
               onNameClick: function(event) {
                   event.stopPropagation();
                   this.toggleSelected(event);
               },
               parts: Ember.computed(function(){
                   return this.get('item').get('path').split('/');
               }).property('item.path')
           });

           JetViewer.NodeView = JetViewer.TreeElementView.extend({
               isNode: true,
               changeDirectory: function(event) {
                   // dont let default <a> click handler apply (reloads page with href)
                   event.stopPropagation();
                   JetViewer.treeController.set('directory',this.get('item').get('path'));
               },
               onIconClick: function(event) {
                   event.stopPropagation();
                   this.changeDirectory(event);
               },
               onNameClick: function(event) {
                   event.stopPropagation();
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
                   event.stopPropagation();
                   this.get('matches').forEach(function(item) {
                       item.set('selected',true);
                   });
               },
               unselectAll: function(event) {
                   event.stopPropagation();
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
                   if( status=='on' ){
                       return 'label-success';
                   }
                   else if (status=='debug'){
                       return 'label-warning';
                   }                
                   return 'label-important';
               }).property('JetViewer.status')               
           });
           return JetViewer;
       });

