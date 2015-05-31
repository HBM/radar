var jet = require('node-jet');
var Dispatcher = require('./Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var connectionStatus = 'disconnected';
var list = [];


var Store = assign({}, EventEmitter.prototype, {

	getConnectionStatus() {
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

Dispatcher.register(function (action) {
	switch (action.type) {
	case 'connectionStatus':
		connectionStatus = action.status;
		break;
	case 'listChanged':
		list = action.list;
		break;

	default:
	}
	Store.emitChange();
});

module.exports = Store;