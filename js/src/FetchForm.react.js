var React = require('react');
var utils = require('./utils');

class FetchForm extends React.Component {
		constructor(props) {
				super(props);
		}

		fetch(event) {
				event.preventDefault();
				utils.fetch();
		}

		render() {
				return (
			<form onSubmit={this.fetch.bind(this)}>
				<button type="submit">Fetch</button>
			</form>
				);
		}
}

module.exports = FetchForm; 
