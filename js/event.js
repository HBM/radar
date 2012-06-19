define(
    [],
    function() {
        var callbacks = {};
        var bind;
        var unbind;
        var trigger;
        var ticket = 0;
	bind = function(matcher,cb){            
            ticket += 1;
            callbacks[ticket] = {matcher:matcher,cb:cb};
            return ticket;
	},
	unbind = function(ticket){
            delete callbacks[ticket];
	},
	trigger = function(event){
            var ticket;
            for (ticket in callbacks) {
                if( callbacks[ticket].matcher ) {
                    try {
                        if( callbacks[ticket].matcher(event) ){
                            callbacks[ticket].cb(event,ticket);
                        }
                    }
                    catch(err) {
                        console.log('event matching throwed:',err);
                    }
                }
                else {
                    callbacks[ticket].cb(event);
                }
            }
        };
        return {
            bind : bind,
            unbind : unbind,
            trigger : trigger
        };
    }
);
