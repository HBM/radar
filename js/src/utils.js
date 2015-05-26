var jet = require('node-jet');
var Actions = require('./Actions');

var peer;
var fetcher;

module.exports = {
	fetch: function (config, contains) {
		if (peer) {
			peer.close();
		}
		peer = new jet.Peer(config);
		fetcher = new jet.Fetcher();
		if (contains) {
			fetcher.path('containsAllOf', contains);
		}
		fetcher.range(1, 100).sortByPath().pathCaseInsensitive();
		fetcher.on('data', function (data) {
			Actions.listChanged(data);
		});

		jet.Promise.all([
					peer.connect(),
					peer.fetch(fetcher)
				]).then(function () {
			Actions.peerIsConnected();
		}).catch(function () {
			Actions.peerIsDisconnected();
		});
	},

	setState: function (path, value) {
		peer.set(path, value);
	}
};