var React = require('react');
var ConnectionForm = require('./ConnectionForm.react');
var FetchForm = require('./FetchForm.react');
var List = require('./List.react');

class App extends React.Component {
		constructor(props) {
			super(props);
		}

		render() {
				return (
						<div>
						<ConnectionForm></ConnectionForm>
						<FetchForm></FetchForm>
						<List></List>
						</div>
				);
		}
}

module.exports = App;
