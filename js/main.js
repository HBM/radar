requirejs.config({
    shim: {
        'jquery': {
            exports: 'jQuery'
        },
        'bootstrap-dropdown': {
            deps: ['jquery'],
            exports: 'jQuery.fn.dropdown'
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
        // add ember views to DOM
        Radar.mainView = Radar.MainView.create();
        Radar.mainView.appendTo('body'); 
        Radar.initJet();
    }
);
