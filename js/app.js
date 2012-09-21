define(['ember'], function(Ember) {
    window.Radar = Ember.Application.create({
        version: 'v0.1',
        status: 'off'
    });
    
    return window.Radar;
});
