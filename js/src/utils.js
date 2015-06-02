var jet = require('node-jet');
var util = require('util');
var Actions = require('./Actions');

var peer;
var fetcher;

module.exports = {

	login: function (config) {
		if (peer) {
			peer.close();
			fetcher = null;
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
		jet.Promise.resolve().then(function () {
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
		peer.set(path, value).then(function () {
			Actions.gotSetResponse(path);
		}).catch(function (err) {
			Actions.gotSetResponse(path, err);
		});
	},

	callMethod: function (path, args) {
		peer.call(path, args).then(function (result) {
			if (typeof result === 'object' && !util.isArray(result)) {
				if (Object.keys(result).length === 0) {
					result = '<empty object {}>';
				}
			}
			Actions.gotCallResponse(path, undefined, result);
		}).catch(function (err) {
			Actions.gotCallResponse(path, err);
		});

	}
};