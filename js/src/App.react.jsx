var React = require('react');
var FetchForm = require('./FetchForm.react.jsx');
var List = require('./List.react.jsx');

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='container'>
				<FetchForm />
				<List />
			</div>
		);
	}
}

module.exports = App;
