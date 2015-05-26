var React = require('react');

class Method extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<form>
					<button type="submit">Call</button>
				</form>
		);
	}
}


module.exports = Method;