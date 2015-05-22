var jet = require('node-jet');
var Actions = require('./Actions');

var peer;
var fetcher;

module.exports = {

		connect: function(url) {
				if (peer) {
						peer.close();
				}
				Actions.peerIsConnecting();
				peer = new jet.Peer({url: url});
				peer.connect().then(function() {
					Actions.peerIsConnected();
				}).catch(function() {
						Action.peerIsDisconnected();
				});
		},

		fetch: function() {
				if (fetcher) {
						fetcher.unfetch();
				}
				fetcher = new jet.Fetcher().all().range(1,10).sortByPath();
				fetcher.on('data', function(data) {
					Actions.listChanged(data);
			    });

				peer.fetch(fetcher);
		}
};
