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
	},

	gotCallResponse: function (path, err, result) {
		Dispatcher.dispatch({
			type: 'gotCallResponse',
			path: path,
			error: err,
			result: result
		});
	},

	gotSetResponse: function (path, err) {
		Dispatcher.dispatch({
			type: 'gotSetResponse',
			path: path,
			error: err
		});
	}

};

module.exports = Actions;