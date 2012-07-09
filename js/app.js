define(['/js/ember.js.gz'], function(Ember) {
    Ember = window.Ember;
    Ember.Handlebars.registerHelper("JSON",function(path) {
        var value = Ember.getPath(this, path);
        return JSON.stringify(value,null,2);
    });
    window.JetViewer = Ember.Application.create({
        version: 'v0.1',
        status: 'off'
    });
    
    return window.JetViewer;
});
