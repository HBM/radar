define(['/js/jquery.js.gz',
        '/js/bootstrap-dropdown.js',
        '/js/ember.js.gz',
        'app',
        'text!/templates/dash.handlebars',
        'text!/templates/main.handlebars',
        'text!/templates/nodes.handlebars',
        'text!/templates/search.handlebars',
        'text!/templates/tree-element.handlebars',
        'text!/templates/log.handlebars'
       ],
       function(_,bs,Ember,Radar,
                dashTemplate,mainTemplate,nodesTemplate,
                searchTemplate,treeElementTemplate,logTemplate) {
           
           Ember = window.Ember;
           Radar = window.Radar;
           $ = window.jQuery;
                      
           Radar.TreeView = Ember.View.extend({
               template: Ember.Handlebars.compile(nodesTemplate),
               directoryBinding: Ember.Binding.oneWay('Radar.treeController.directory'),
               childStatesBinding: Ember.Binding.oneWay('Radar.treeController.childStates'),
               childNodesBinding: Ember.Binding.oneWay('Radar.treeController.childNodes'),
               childMethodsBinding: Ember.Binding.oneWay('Radar.treeController.childMethods'),
               breadcrumbsBinding: Ember.Binding.oneWay('Radar.treeController.breadcrumbs'),              
               clickBreadcrumb: function(event) {
                   event.stopPropagation();
                   var dir = event.context.get('path');                        
                   this.setDirectory(dir);
               },
               setDirectory: function(dir) {
                   Radar.treeController.set('directory',dir);
               }
           });

           Radar.DashView = Ember.View.extend({
               template: Ember.Handlebars.compile(dashTemplate),
               selectedStatesBinding: Ember.Binding.oneWay('Radar.selectedController.selectedStates'),
               selectedMethodsBinding: Ember.Binding.oneWay('Radar.selectedController.selectedMethods')
           });

           Radar.AutoHeightTextArea = Ember.TextArea.extend({
               didInsertElement: function() {
                   this.heightAdjuster();
                   this.$().val(this.get('value'));
               },
               heightAdjuster: function() {
                   if( this.get('value')) {
                       var value = this.get('value').toString();
                       var lines = value.split('\n').length;                                
                       this.$().attr('rows',lines);
                   }
				   else {
                       this.$().attr('rows',1);
                   }
               }.observes('value')
           });

           Radar.StateRowView = Ember.View.extend({
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
                   this.inputView.set('uncomittedChanges',false);
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
                       var value = this.get('value');
                       if(value) {
                           var lines = value.split('\n').length;
                           this.$().attr('rows',lines);
                       } 
                       else {
                           this.$().attr('rows',1);
                       }
                   }.observes('value'),
                   focusOut: function() {
                       try {
                           var oldValueJSON =  JSON.stringify(parent.get('item').get('value'));
                           var newValueJSON =  JSON.stringify(JSON.parse(this.$().val()));
                           if (newValueJSON == oldValueJSON) {
                               this.set('uncomittedChanges',false);
                               this.get('parentView').set('refreshAvailable',false);
                           }
                       }
                       catch(e) {
                       }
                   },
                   keyUp: function(event) {
                       event.stopPropagation();
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


           Radar.MethodRowView = Ember.View.extend({
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

           Radar.TreeElementView = Ember.View.extend({
               template: Ember.Handlebars.compile(treeElementTemplate),
               isSelectedBinding: 'item.selected',
               isNotSelectedBinding: Ember.Binding.not('item.selected'),
               toggleSelected:function(event) {
                   event.stopPropagation();                       
                   this.toggleProperty('isSelected');
               },
           });

           Radar.LeafView = Radar.TreeElementView.extend({
               isLeaf: true,
               onIconClick: function(event) {
                   event.stopPropagation();
               },
               onNameClick: function(event) {
                   event.stopPropagation();
                   this.toggleSelected(event);
               }
           });

           Radar.NodeView = Radar.TreeElementView.extend({
               isNode: true,
               changeDirectory: function(event) {
                   // dont let default <a> click handler apply (reloads page with href)
                   event.stopPropagation();
                   Radar.treeController.set('directory',this.get('item').get('path'));
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

           Radar.SearchView = Ember.View.extend({
               template: Ember.Handlebars.compile(searchTemplate),
               allMatchesBinding: Ember.Binding.oneWay('Radar.searchController.allMatches'),
               moreMatchesNumber: Ember.computed(function(){
                   var size = Radar.searchController.get('allMatches').get('length');
                   if (size > 20) {
                       return size - 20;
                   }                   
                   return 0;
               }).property('allMatches','first20Matches'),
               first20MatchesBinding: Ember.Binding.oneWay('Radar.searchController.first20Matches'),
               searchExpressionBinding: 'Radar.searchController.searchExpression',
               selectAll: function(event) {
                   event.stopPropagation();
                   this.get('allMatches').forEach(function(item) {
                       item.set('selected',true);
                   });
               },
               unselectAll: function(event) {
                   event.stopPropagation();
                   this.get('allMatches').forEach(function(item) {
                       item.set('selected',false);
                   });
               }
           });


           Radar.LogView = Ember.View.extend({
               template: Ember.Handlebars.compile(logTemplate),
               statusBinding: 'Radar.status',
               logEntriesBinding: Ember.Binding.oneWay('Radar.logEntriesController.content'),
               last10Entries: Ember.computed(function(){
                   try {
                       var n = 10;
                       var logEntries = this.get('logEntries');
                       var l = logEntries.get('length');
                       if (l > n) {
                           return logEntries.slice(l-n,l).reverse();
                       }
                       else {
                           return logEntries.reverse();
                       }                       
                   }
                   catch(e) {
                       console.log(e);
                   }
               }).property('logEntries.@each'),
               labelType: Ember.computed(function(){
                   var status = Radar.get('status');
                   if( status=='on' ){
                       return 'label-success';
                   }
                   else if (status=='debug'){
                       return 'label-warning';
                   }                
                   return 'label-important';
               }).property('Radar.status'),
               ItemView: Ember.View.extend({
                   dataShort: function() {
                       var d = JSON.stringify(this.get('item').get('data'));                       
                       if (d) {
                           return d.substr(0,30);
                       }
                       return '';
                   }.property('item.data'),
                   dataLong: function() {
                       return JSON.stringify(this.get('item').get('data'),null,2) || ''                  
                   }.property('item.data'),
                   pathBinding: Ember.Binding.oneWay('item.path'),
                   eventBinding: Ember.Binding.oneWay('item.event'),
                   icon: function() {
                       var event = this.get('item').get('event');
                       if( event === 'create' ) {
                           return 'icon-plus-sign';
                       }
                       else if( event === 'delete' ) {
                           return 'icon-minus-sign';
                       }
                       else if( event === 'value' ) {
                           return 'icon-exclamation-sign';
                       }
                       return 'icon-info-sign';                       
                   }.property('item.event'),
                   dateShort: function() {
                       return this.get('item').get('date').toLocaleTimeString();
                   }.property('item.date'),
                   dateLong: function() {
                       return this.get('item').get('date').toString();
                   }.property('item.date')
               })
           });
           
           Radar.MainView = Ember.View.extend({
               template: Ember.Handlebars.compile(mainTemplate),
               versionBinding: Ember.Binding.oneWay('Radar.version')
           });
           return Radar;
       });

