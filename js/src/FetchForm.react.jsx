var React = require('react');
var Input = require('./Input.react.jsx');
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
		this.state.isValidUrl = this.isValidUrl(this.state.url);
	}

	fetch(event) {
		event.preventDefault();
		utils.fetch(this.state, this.state.contains.split(' '));
	}

	isValidUrl(url) {
    	var wsRegExp = /(ws|wss):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
		return wsRegExp.test(url);
	}

	setURL(event) {
		window.localStorage.url = event.target.value;
			
		this.setState({
			isValidUrl: this.isValidUrl(event.target.value),
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

	renderInput(config) {
	}

	render() {
		return (
			<form onSubmit={this.fetch.bind(this)}>
			<div className='row'>
				<Input type='url' id='url' 
					label='Daemon Websocket URL' 
					value={this.state.url} 
					onChange={this.setURL.bind(this)}
				 	placeholder="ws://jetbus.io:8080"	
					icon='mdi-file-cloud'
					valid={this.state.isValidUrl}
					required 
				/>

				<Input type='text' id='user'	
					label='User'
					value={this.state.user}
					onChange={this.setUser.bind(this)}
				 	placeholder="anonymous"	
					icon='mdi-action-account-box'
					/>

				<Input type='password' id='password'
					label='Password'
					value={this.state.password}
					onChange={this.setPassword.bind(this)}
					icon='mdi-communication-vpn-key'
					/>
				
				<Input type='text' id='containsAllOf'
					label='Path contains all of:'	
					value={this.state.contains}
					onChange={this.setContains.bind(this)}
				 	placeholder="foo"	
				/>
				</div>
				<div className='row'>
				<div className='right-align'>
				<button className='waves-effect btn' type="submit" autofocus >
					<i className='mdi-action-search right'></i>
					Fetch
				</button>
				</div>
				</div>
			</form>
		);
	}
}

module.exports = FetchForm;
