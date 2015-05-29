var Dispatcher = require('./Dispatcher');

var Actions = {
	connectionStatus: function (status) {
		Dispatcher.dispatch({
			type: 'connectionStatus',
			status: status
		});
	},

	listChanged: function (list) {
		Dispatcher.dispatch({
			type: 'listChanged',
			list: list
		});
	}
};

module.exports = Actions;
