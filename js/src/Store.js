var jet = require('node-jet');
var Dispatcher = require('./Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var connectionStatus = 'disconnected';
var list = [];


var Store = assign({}, EventEmitter.prototype, {

	getConnectionStatus: function () {
		return connectionStatus;
	},

	getList: function () {
		return list;
	},

	addChangeListener: function (callback) {
		this.on('change', callback);
	},

	removeChangeListener: function (callback) {
		this.removeListener('change', callback);
	},

	emitChange: function () {
		this.emit('change');
	}

});

var findItem = function (path) {
	var match = list.filter(x => x.path === path);
	return match[0];
};

Dispatcher.register(function (action) {
	switch (action.type) {
	case 'connectionStatus':
		connectionStatus = action.status;
		if (connectionStatus !== 'connected') {
			list = [];
		}
		break;
	case 'listChanged':
		list = action.list;
		break;
	case 'gotCallResponse':
		var item = findItem(action.path);
		item.callResponse = {
			error: action.error,
			result: action.result
		};
	case 'gotSetResponse':
		var item = findItem(action.path);
		item.setResponse = {
			error: action.error
		};
	default:
	}
	Store.emitChange();
});

module.exports = Store;