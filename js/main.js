requirejs.config({
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'bootstrap': {
            deps: ['jquery'],
        },
        'ember': {
            deps: ['jquery','handlebars'],
            exports: 'Ember'
        },
    }
});

require(
    ['app','views','controllers'],
    function(Radar) {
        Radar.ApplicationController = Ember.Controller.extend({});
        Radar.ApplicationView = Radar.MainView;
        Radar.Router = Ember.Router.extend({
            enableLogging: true,
            root: Ember.Route.extend({
                index: Ember.Route.extend({
                    route: '/',
                    redirectsTo: 'dash.selected'
                }),
                dash: Ember.Route.extend({
                    route: '/dash',
                    index: Ember.Route.extend({
                        route: '/',
                        connectOutlets: function(router) {
                            Radar.selector.set('paths',[]);            
                        }
                    }),
                    connectOutlets: function(router,paths) {
                        router.get('applicationController').connectOutlet({
                            outletName: 'toolbar',
                            viewClass: Radar.DashToolbarView,
                            controller: Radar.DashToolbarController.create()
                        });
                        router.get('applicationController').connectOutlet({
                            outletName: 'content',
                            viewClass: Radar.DashView,
                            controller: Radar.DashController.create()
                        });
                    },
                    selected: Ember.Route.extend({
                        route: '/:selected',                    
                        connectOutlets: function(router,paths) {
                            var paths = paths || [];                        
                            Radar.selector.set('paths',paths);                         
                        },
                        deserialize: function(router,params) {
                            if (params.selected !== 'undefined') {
                                var selected = params.selected.split(',');
                                for (var i=0; i<selected.length; ++i) {
                                    selected[i] = selected[i].replace(/\./g,'/');
                                }
                                return selected;
                            }
                        },
                        serialize: function(router,context) {
                            var selected = Radar.selector.get('paths');
                            var norm = [];
                            var hash = {}
                            for (var i=0; i<selected.length; ++i) {
                                norm.push(selected[i].replace(/\//g,'.'));
                            }
                            hash.selected = norm;
                            return hash;
                        }
                    }),
                    unselect: function(router,event) {
                        event.stopPropagation();
                        var newPath = event.context.get('path');
                        var paths = Radar.selector.get('paths');
                        var newPaths = [];
                        paths.forEach(function(path){
                            if (path !== newPath) {
                                newPaths.push(path);
                            }
                        });
                        router.transitionTo('dash.selected',newPaths);
                    },
                    select: function(router,event) {
                        event.stopPropagation();
                        var newPath = event.context.get('path');
                        var paths = Radar.selector.get('paths');
                        var newPaths = [];
                        paths.forEach(function(path){                            
                            newPaths.push(path);                       
                        });
                        if (newPaths.indexOf(newPath) === -1) {
                            newPaths.push(newPath);
                        }
                        router.transitionTo('dash.selected',newPaths);
                    },
                    toggle: function(router,event) {
                        var togglePath = event.view.get('context.path');
                        if (Radar.selector.get('paths').indexOf(togglePath) === -1) {
                            this.select(router,event);
                        }
                        else {
                            this.unselect(router,event);
                        }
                    },
                    eventTransitions: {
                        toggle: 'dash.selected',
                        unselect: 'dash.selected',
                        select: 'dash.selected'
                    },
                    clear: function(router) {
                        router.transitionTo('dash.index');
                    }
                })
            })
        });
        Radar.initialize();
        Radar.initJet();
    }
);
