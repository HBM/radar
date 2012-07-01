define(['ember'], function(Ember) {
    Ember = window.Ember;
    window.JetViewer = Ember.Application.create({
        version: 'v0.1',
        status: 'offline'
    });
    
    return window.JetViewer;
});
