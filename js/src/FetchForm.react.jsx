var React = require('react');
var utils = require('./utils');

class FetchForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			url: window.localStorage.url || '',
			user: window.localStorage.user || '',
			password: window.localStorage.password || '',
			contains: window.localStorage.contains || ''
		};
	}

	fetch(event) {
		event.preventDefault();
		utils.fetch(this.state, this.state.contains.split(' '));
	}

	setURL(event) {
		window.localStorage.url = event.target.value;
		this.setState({
			url: event.target.value
		});
	}

	setUser(event) {
		window.localStorage.user = event.target.value;
		this.setState({
			user: event.target.value
		});
	}

	setPassword(event) {
		window.localStorage.password = event.target.value;
		this.setState({
			password: event.target.value
		});
	}

	setContains(event) {
		window.localStorage.contains = event.target.value;
		this.setState({
			contains: event.target.value
		});
	}

	render() {
		return (
			<form onSubmit={this.fetch.bind(this)}>
				<label htmlFor="url">Daemon URL</label>
				<input type="url" id="url" 
					value={this.state.url}
					onChange={this.setURL.bind(this)}
				 	placeholder="ws://jetbus.io:8080"	
					required 
				/>

				<label htmlFor="user">User</label>
				<input type="text" id="url" 
					value={this.state.user}
					onChange={this.setUser.bind(this)}
				 	placeholder="anonymous"	
				/>
				
				<label htmlFor="url">Password</label>
				<input type="password" id="url" 
					value={this.state.password}
					onChange={this.setPassword.bind(this)}
				/>

				<label htmlFor="contains">Path contains</label>
				<input type="text" id="contains" 
					value={this.state.contains}
					onChange={this.setContains.bind(this)}
				 	placeholder="foo"	
				/>
				<button type="submit" autofocus>Fetch</button>
			</form>
		);
	}
}

module.exports = FetchForm;