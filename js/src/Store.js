var jet = require('node-jet');
var Dispatcher = require('./Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var connected;
var list = [];


var Store = assign({}, EventEmitter.prototype, {

	isConnected: function() {
		return connected;
	},

	getList: function() {
			return list;
	},

	addChangeListener: function(callback) {
			this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	emitChange: function() {
			this.emit('change');
	}

});

Dispatcher.register(function(action) {
		switch(action.type) {
				case 'peerIsConnecting':
					connected = false;
					break;
				case 'peerIsDisconnected':
					connected = false;
					break;
				case 'peerIsConnected':
					connected = true;
					break
				case 'listChanged':
					list = action.list;
					break;

				default:
		}
Store.emitChange();
});

module.exports = Store;
