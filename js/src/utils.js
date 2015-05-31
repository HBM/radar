var jet = require('node-jet');
var Actions = require('./Actions');

var peer;
var fetcher;

module.exports = {

	login: function (config) {
		if (peer) {
			peer.close();
		}
		Actions.connectionStatus('connecting');
		peer = new jet.Peer(config);
		peer.connect().then(function () {
			Actions.connectionStatus('connected');
		}).catch(function (err) {
			console.log(err);
			if (err.data === 'invalid user') {
				Actions.connectionStatus('invalid user');
			} else {
				Actions.connectionStatus('invalid password');
			}
		});
		peer.closed().then(function (err) {
			console.log(err);
			Actions.connectionStatus('disconnected');
		});
	},

	fetch: function (contains) {
		jet.Promise.resolve(function () {
			if (fetcher) {
				return fetcher.unfetch();
			}
		}).then(function () {
			fetcher = new jet.Fetcher();
			if (contains) {
				fetcher.path('containsAllOf', contains);
			}
			fetcher.range(1, 100).sortByPath().pathCaseInsensitive();
			fetcher.on('data', function (data) {
				Actions.listChanged(data);
			});

			peer.fetch(fetcher);
		});

	},

	setState: function (path, value) {
		peer.set(path, value);
	}
};