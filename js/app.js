define(['js/ember.js'], function(Ember) {
    Ember = window.Ember;
    Ember.Handlebars.registerHelper("JSON",function(path) {
        var value = Ember.getPath(this, path);
        return JSON.stringify(value,null,2);
    });
    window.Radar = Ember.Application.create({
        version: 'v0.1',
        status: 'off'
    });
    
    return window.Radar;
});
