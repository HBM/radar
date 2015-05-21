var Dispatcher = require('./Dispatcher');

var Actions = {
	connect: function(url) {
		Dispatcher.dispatch({
			actionType: 'connect',
			url: url
		});
	},

	fetch: function(rules) {
		Dispatcher.dispatch({
			actionType: 'fetch',
			rules: rules || []
		});
	}
};

module.exports = Actions;
