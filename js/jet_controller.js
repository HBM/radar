define(
    ["jquery","event","jet","underscore"],
    function($,event,jet) {      
        var cjet;
        var _ = window._;
        var localStorage = window.localStorage || {};
        var event_filter = {};
        var dom_modifiers = {};
        var view_factory = {};        
        var set_breadcrumb_path;
        var make_leaf;
        var set_nav_path = function(path) {
            $('#dirs ul:visible').hide();
            $('#dirs ul[data-path="'+path+'"]').show();
            set_breadcrumb_path(path);
        };

        var new_breadcrumb = function(name,path) {
            var tmpl = _.template($('#breadcrumb-template').html());
            var bc = $(tmpl({name:name}));
            bc.click(function(){
                set_nav_path(path);
            });
            return bc;
        };

        $('.search-query').keyup(function(){
            var s = $(this).val();
            $('#search-leafs li.leaf').hide();
            if(s !== '') {
                $('#search-leafs li[data-path*="'+s+'"].leaf').show();
            }
        });
                
        $('.select-all').click(function(){
            _.each($('#search-leafs li:visible'),function(e){
                event.trigger({
                    event:'select_for_dash',
                    path:$(e).data('path')            
                });
            });
        });

        $('.unselect-all').click(function(){
            _.each($('#search-leafs li:visible'),function(e){
                event.trigger({
                    event:'unselect_for_dash',
                    path:$(e).data('path')            
                });
            });
        });

        set_breadcrumb_path = function(path) {
            var pieces = path.split('.');
            var i;
            var breadcrumb = $('#tree .breadcrumb');
            var data_path = '';            
            breadcrumb.empty();            
            breadcrumb.append(new_breadcrumb('root',''));
            for(i = 0; i < pieces.length; ++i ){
                if( data_path.length > 0 ) {
                    data_path += '.';
                }
                data_path += pieces[i];
                breadcrumb.append(new_breadcrumb(pieces[i],data_path));
            }
        };
        view_factory.create = function(notification) {
            var row_template = _.template($('#row-template').html());
            var row = $(row_template(notification));            
            if(notification.data.type != 'method') {
                return view_factory.create_property(notification,row);
            }
            else {
                return view_factory.create_method(notification,row);
            }
        };
        view_factory.create_property = function(notification,row) {
            var path = notification.path;
            var hist_template = _.template($('#history-template').html());
            var read_only = notification.data.type == "monitor" || notification.data.read_only === true;
            var last_val = notification.data.value;
            var value_ticket;
            var schema_ticket;
            var delete_ticket;
            var history_visible = false;
            var history = row.find('.history');
            var add_to_history = function(value) {
                var now = new Date();
                var hist_entry = $(hist_template({
                    date:now.toUTCString()
                }));
                hist_entry.find('input').val(JSON.stringify(value));
                history.prepend(hist_entry);
                if(history.children().length > 10) {
                    history.children().last().remove(); 
                }
            }
            var set_value = function(value){                
                var str = JSON.stringify(value);
                last_val = value;
                row.find('.jet-current-value').val(str);                
            };
            history.hide();
            row.find('input').popover({
                placement:'top',
                title:'schema',
                content:'no schema avaiable',
                delay:{
                    show: 1000,
                    hide: 100
                }
            });

            if(notification.data.schema) {
                row.find('input').attr('data-content',JSON.stringify(notification.data.schema));
            }
            row.find('.count').click(function(){
                if(history_visible){
                    history_visible = false;
                    history.slideUp();
                }
                else {
                    history_visible = true;
                    history.slideDown();
                }
            });
            if(read_only) {
                row.find('input').attr('uneditable-input',true);
                row.find('.execute-call').addClass('disabled');
                row.find('.execute-call').removeClass('btn-primary');
            }
            else {
                row.find('input').change(function(){                
                    var params = JSON.parse('['+$(this).val()+']');
		    cjet.set(path,params[0],{
		        error:function(err){
			    console.log('setting',path,params[0],'failed with',err);
                            var error_template = _.template($('#method-error-template').html());
                            var err = $(error_template({value:err}));
                            err.alert();
                            row.find('.jet-row-content').append(err);                            
                            set_value(last_val);
		        },
		        success:function(){                        
			    console.log('setting',path,params[0],'ok');
		        }
		    });
                });
            }
            value_ticket = event.bind(function(e){
                return e.event=='value' && e.path==path;
            },function(e){
                set_value(e.data);
                add_to_history(e.data);
            });
            schema_ticket = event.bind(function(e){
                return e.event=='schema' && e.path==path;
            },function(e){
                row.find('input').attr('data-content',JSON.stringify(e.data));
            });
            delete_ticket = event.bind(function(e){
                return e.event=='delete' && e.path==path;
            },function(){
                event.unbind(schema_ticket);
                event.unbind(value_ticket);
                event.unbind(delete_ticket);
            });
            set_value(last_val);
            return row;
        };
        view_factory.create_method = function(notification,row) {
            var params;
            var path = notification.path;
            var call_method = function() {
                var warning_template;
                var warning;
                params = JSON.parse('[' + row.find('.jet-input input').val() + ']');
                try {
                    row.trigger('callmethod',[params]);
                }
                catch(e) {
                    warning_template = _.template($('#method-warning-template').html());
                    warning = $(warning_template({heading:'Arguments rejected:',message:e.message}));
                    warning.alert();
                    row.append(warning);
                }                            
            };     
            row.find('.jet-input  input').popover({
                placement:'top',
                title:'schema',
                content:'no schema avaiable',
                delay:{
                    show: 1000,
                    hide: 100
                }
            });

            if(notification.data.schema) {
                row.find('.jet-input input').attr('data-content',JSON.stringify(notification.data.schema));
            }       
            row.find('.jet-input input').blur(function(){
                var warning_template;
                var warning;
                try {
                    params = JSON.parse('[' + $(this).val() + ']');
                    row.find('.execute-call').removeClass('disabled');
                }
                catch (e) {
                    warning_template = _.template($('#method-warning-template').html());
                    warning = $(warning_template({heading:'Invalid JSON argument:',message:e.message}));
                    warning.alert();
                    row.append(warning);
                }
            }).keyup(function(){
                try {
                    params = JSON.parse('[' + $(this).val() + ']');
                    row.find('.execute-call').removeClass('disabled');
                    $(this).parents('.control-group').removeClass('warning');
                }
                catch (e) {
                    row.find('.execute-call').addClass('disabled');
                    $(this).parents('.control-group').addClass('warning');
                }
            }).keypress(function(event){
                if( event.keyCode == '13' ) {
                    call_method();
                    event.preventDefault();
                }
            }).focus(function(){
                try {
                    params = JSON.parse('[' + $(this).val() + ']');
                    row.find('.execute-call').removeClass('disabled');
                    $(this).parents('.control-group').removeClass('warning');
                }
                catch (e) {
                    row.find('.execute-call').addClass('disabled');
                    $(this).parents('.control-group').addClass('warning');
                }
            });
            row.on('callmethod',function(e,val){
                var self = $(this);
                cjet.call(path,val,{
                    error:function(err){
                        self.trigger('callerror',err);
                    },
                    success:function(res){
                        self.trigger('callresult',res);
                        console.log('calling',path,'ok');
                    }
                });
            });
            row.find('.execute-call').click(function() {
                call_method();
            });
            row.bind('callresult',function(e,value){
                var result_template = _.template($('#method-result-template').html());
                var result = $(result_template({e:e,value:value}));
                result.alert();
                row.find('.jet-row-content').append(result);
            });
            row.bind('callerror',function(e,value){
                var error_template = _.template($('#method-error-template').html());
                var err = $(error_template({e:e,value:value}));
                err.alert();
                row.find('.jet-row-content').append(err);
            });
            return row;
        };

        var connect = function(event){
            cjet = event.jet;
            cjet.fetch();
        };

        event_filter.is_node_create = function(e){ 
            return e.event == 'create' && e.data.type == 'node';
        };

        event_filter.is_node_delete = function(e){ 
            return e.event == 'delete' && e.data.type == 'node';
        };
        
        event_filter.is_leaf_create = function(e) {
            return e.event == 'create' && e.data.type != 'node';
        };

        event_filter.comp_event = function(ename) {
            return function(e){
                return e.event == ename;
            };
        };

        is_selected_for_dash = function(path) {
            var parent_path = path.substring(0,path.lastIndexOf('.'));
            var parent_dir_selected = $('#tree li[data-path="'+parent_path+'"]').data('selected');
            var selected_in_search = $('#search-leafes li[data-path="'+path+'"]:visible');
            return  parent_dir_selected || selected_in_search.length > 0;
        }


        dom_modifiers.add_node = function(notification){
            var path = notification.path;
            var dir_entry_template = _.template($('#dir-entry-template').html());
            var dir_template = _.template($('#dir-container-template').html());
            var dir_entry;
            var dir;
            var parent = notification.parent;
            var parent_dir_query = '#dirs ul[data-path="'+parent+'"]';
            var parent_dir = $(parent_dir_query);            
            var select_ticket;
            var unselect_ticket;
            var delete_ticket;
            notification.selected = is_selected_for_dash(path);
            dir_entry = $(dir_entry_template(notification));
            dir_entry.find('a').click(function(){
                set_breadcrumb_path(notification.path);
                set_nav_path(notification.path);
            });
            parent_dir.append(dir_entry);
            dir = $(dir_template(notification));
            dir.hide();
            $('#dirs').append(dir);
            select_ticket = event.bind(function(e){
                return e.event=='select_for_dash' && e.path==path;
            },function(){
                var childs = $('#dirs ul[data-path="'+path+'"] li');
                _.each(childs,function(c){
                    event.trigger({
                        event:'select_for_dash',
                        path: $(c).data('path')
                    });
                });
                dir_entry.find('.toggle-button').removeClass('icon-star-empty');
                dir_entry.find('.toggle-button').addClass('icon-star');                
                dir_entry.data('selected',true);
            });

            unselect_ticket = event.bind(function(e){
                return e.event=='unselect_for_dash' && e.path==path;
            },function(){
                var childs = $('#dirs ul[data-path="'+path+'"] li');
                _.each(childs,function(c){
                    event.trigger({
                        event:'unselect_for_dash',
                        path: $(c).data('path')
                    });
                });
                dir_entry.find('.toggle-button').removeClass('icon-star');
                dir_entry.find('.toggle-button').addClass('icon-star-empty');              
                dir_entry.data('selected',false);
            });

            delete_ticket = event.bind(function(e){
                return e.event=='delete' && e.path==path;
            },function(){
                event.unbind(select_ticket);
                event.unbind(unselect_ticket);
                event.unbind(delete_ticket);
                dir_entry.remove();
            });

            dir_entry.find('.toggle-button').click(function(e){
                if(dir_entry.data('selected')) {
                    event.trigger({
                        event:'unselect_for_dash',
                        path:path
                    });
                }
                else {
                    event.trigger({
                        event:'select_for_dash',
                        path:path
                    });
                }
                e.stopPropagation();
            });
            if( dir_entry.data('selected') ) {
                event.trigger({
                    event:'select_for_dash',
                    path:path
                });
            }
            else {
                event.trigger({
                    event:'unselect_for_dash',
                    path:path
                });
            }
        };

        dom_modifiers.add_to_preview = function(notification) {
            var path = notification.path;
            var row = view_factory.create(notification);
            var delete_ticket;
            row.hide();
            $('#preview-container').append(row);
            delete_ticket = event.bind(function(e){
                return e.event=='delete' && e.path==path;
            },function(e){
                event.unbind(delete_ticket);
                row.remove();
            });           
        }

        dom_modifiers.add_to_dash = function(notification) {
            var path = notification.path;
            var row = view_factory.create(notification);
            var select_ticket;
            var unselect_ticket;
            var delete_ticket;
            var value_ticket;
            var updates_count = 0;
            notification.selected = is_selected_for_dash(path);
            row.hide();
            row.find('.jet-close').click(function(){
                event.trigger({
                    event:'unselect_for_dash',
                    path:path
                });
            });
            $('#dash-container').append(row);
            select_ticket = event.bind(function(e){
                return e.path==path && e.event=='select_for_dash';
            },function(){ 
                row.fadeIn();
            });
            unselect_ticket = event.bind(function(e){
                return e.path==path && e.event=='unselect_for_dash';
            },function(){                
                row.fadeOut();
            });
            value_ticket = event.bind(function(e){
                return e.event=='value' && e.path==path;
            },function(e){
                updates_count += 1;
                row.find('.count.badge').text(updates_count).show();;                
            });
            delete_ticket = event.bind(function(e){
                return e.event=='delete' && e.path==path;
            },function(e){
                event.unbind(select_ticket);
                event.unbind(unselect_ticket);
                event.unbind(delete_ticket);
                event.unbind(value_ticket);
                row.remove();
            });           
        };

        make_leaf = function(notification,template_name) {
            var leaf_template = _.template($('#'+template_name).html());
            var path = notification.path;
            var leaf;
            var select_ticket;
            var unselect_ticket;
            var delete_ticket;
            notification.selected = is_selected_for_dash(path);
            leaf = $(leaf_template(notification));
            select_ticket = event.bind(function(e){
                return e.event=='select_for_dash' && e.path==path;
            },function(e){
                leaf.find('.toggle-button').removeClass('icon-star-empty');
                leaf.find('.toggle-button').addClass('icon-star');
                leaf.data('selected',true);
            });

            unselect_ticket = event.bind(function(e){
                return e.event=='unselect_for_dash' && e.path==path;
            },function(e){
                leaf.find('.toggle-button').removeClass('icon-star');
                leaf.find('.toggle-button').addClass('icon-star-empty');
                leaf.data('selected',false);
            });

            delete_ticket = event.bind(function(e){
                return e.event=='delete' && e.path==path;
            },function(){
                event.unbind(select_ticket);
                event.unbind(unselect_ticket);
                event.unbind(delete_ticket);
                leaf.remove();
            });
            leaf.hover(function(){
                $('#preview-container .jet-row').hide();
                $('#preview-container .jet-row[data-path="'+path+'"]').show();
                $('#dash-container .jet-row').removeClass('highlight');
                $('#dash-container .jet-row[data-path="'+path+'"]').addClass('highlight');
            },function(){
                $('#dash-container .jet-row').removeClass('highlight');
            });
            leaf.find('.toggle-button').click(function(e){
                if(leaf.data('selected')) {
                    event.trigger({
                        event: 'unselect_for_dash',
                        path: path
                    });
                }
                else {
                    event.trigger({
                        event: 'select_for_dash',
                        path: path
                    });
                }
                e.stopPropagation();
            });
            if(notification.selected) {
                event.trigger({
                    event: 'select_for_dash',
                    path: path
                });
            }
            else {
                event.trigger({
                    event: 'unselect_for_dash',
                    path: path
                });
            }
            return leaf;
        };

        dom_modifiers.add_to_tree = function(notification) {
            var parent_dir_query = '#dirs ul[data-path="'+notification.parent+'"]';
            var parent_dir = $(parent_dir_query);           
            var leaf = make_leaf(notification,'leaf-entry-template');
            parent_dir.append(leaf);
        };

        dom_modifiers.add_to_search = function(notification) {
            var leaf = make_leaf(notification,'search-entry-template');
            leaf.hide();
            $('#search-leafs').append(leaf);
            $('.search-query').trigger('keyup');            
        };

        dom_modifiers.set_status = function(status){
            $('#status-text').text(status);
            if( status=='online' ){
                $('#status-label').removeClass('label-important');
                $('#status-label').addClass('label-success');
                $('#main').fadeTo('slow',1);
            }
            else {
                $('#status-label').removeClass('label-success');
                $('#status-label').addClass('label-important');
                $('#main').fadeTo('slow',0.5);
            }                
        }

        event.bind(event_filter.comp_event('connect'),connect);
        event.bind(event_filter.comp_event('connect'),function(){
            dom_modifiers.set_status('online');
        });
        event.bind(event_filter.is_node_create, dom_modifiers.add_node);
        event.bind(event_filter.is_leaf_create, dom_modifiers.add_to_dash);
        event.bind(event_filter.is_leaf_create, dom_modifiers.add_to_preview);
        event.bind(event_filter.is_leaf_create, dom_modifiers.add_to_tree);
        event.bind(event_filter.is_leaf_create, dom_modifiers.add_to_search);
        event.bind(function(e){            
            return e.event=='close';
        },function(){
            dom_modifiers.set_status('offline');
        });
                
        return {
            init : function() {
	        jet.connect();
	    }
        };
    }
);

