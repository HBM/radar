var Dispatcher = require('./Dispatcher');

var Actions = {
	peerIsConnecting: function () {
		Dispatcher.dispatch({
			type: 'peerIsConnecting'
		});
	},

	peerIsConnected: function () {
		Dispatcher.dispatch({
			type: 'peerIsConnected'
		});
	},

	peerIsDisconnected: function () {
		Dispatcher.dispatch({
			type: 'peerIsDisconnected'
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