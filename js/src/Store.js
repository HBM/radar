var jet = require('node-jet');
var Dispatcher = require('./Dispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var peer;
var connected;
var elements = [];
var fetcher;

var Store = assign({}, EventEmitter.prototype, {

	connect: function(url) {
		if (peer) {
			peer.close();
			fetcher = undefined;
		}
		peer = new jet.Peer({url: url});
		connected = false;
		elements = [];
		peer.connect().then( () => connected = true; this.emit('change'); );
	},

	isConnected: function() {
		return connected;
	},

	fetch: function(rules) {
		if (fetcher) {
			fetcher.unfetch();
		}

		if (peer) {
			fetcher = new jet.Fetcher()
			.all();
			.on('data', function(data) {
				elements = data;
			});

			peer.fetch(fetcher);
		}
	}

});

module.exports = Store;
