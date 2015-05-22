var React = require('react');
var utils = require('./utils');

class ConnectionForm extends React.Component {
	constructor(props) {
		super(props);
	}

	connect(event) {
		event.preventDefault();
		var url = React.findDOMNode(this.refs.url).value;
		utils.connect(url);
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
