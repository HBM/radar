var React = require('react');
var jet = require('node-jet');
var Peer = require('./peer');

class ConnectionForm extends React.Component {
	constructor(props) {
		super(props);
	}

	connect(event) {
		event.preventDefault();
		var url = React.findDOMNode(this.refs.url).value;
		if (Peer.instance) {
			Peer.instance.close();
		}
		Peer.instance = new jet.Peer({url: url});
		Peer.instance.connect().then(function() {
																 console.log('connected');
		});
	}

	render() {
		return (
			<form onSubmit={this.connect.bind(this)}>
				<label htmlFor="url">URL</label>
				<input id="url" type="url" ref="url" />
				<input type="submit" value="connect" />
			</form>
		);
	}
}

module.exports = ConnectionForm;
