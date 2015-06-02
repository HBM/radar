var React = require('react');
var FetchForm = require('./FetchForm.react.jsx');
var List = require('./List.react.jsx');
var Login = require('./Login.react.jsx');

class App extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<Login />
				<FetchForm />
				<div className='container'>
					<List />
				</div>
			</div>
		);
	}
}

module.exports = App;