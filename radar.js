$(function() {
    var jetws;
    var fetch;
    
    $('form#jet-config').submit(function(){
        var wsurl = $('form#jet-config input').val();
        if (jetws) {
            jetws.close();
        }        
        jetws = new Websocket(wsurl,'jet');
    });
    
})
