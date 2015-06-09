var React = require('react');
var flatten = require('flat');
var Response = require('./Response.react.jsx');

class State extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.createState(this.props.item.value);
	}

	createState(value) {
		this.shouldUpdate = true;
		return {
			changes: {},
			bak: this.flatValue(value),
			value: this.flatValue(value),
			displayValue: this.flatValue(value)
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState(this.createState(nextProps.item.value));
		}
		if (nextProps.item.setResponse) {
			this.setState({
				response: nextProps.item.setResponse
			});
		}
	}

	shouldComponentUpdate() {
		return this.shouldUpdate || this.hasChanges();
	}

	flatValue(value) {
		if (typeof value === 'object') {
			return flatten(value);
		} else {
			var fv = {};
			fv[''] = value;
			return fv;
		}
	}

	onChange(key, event) {
		var value;
		var displayValue;
		this.state.response = null;
		if (event.target.type === 'checkbox') {
			value = displayValue = event.target.checked;
		} else if (event.target.type === 'number') {
			displayValue = event.target.value;
			value = parseFloat(displayValue);
		} else {
			value = displayValue = event.target.value;
		}

		this.state.value[key] = value;
		this.state.displayValue[key] = displayValue;
		if (this.state.bak[key] !== this.state.value[key]) {
			this.state.changes[key] = true;
		} else {
			delete this.state.changes[key];
		}
		this.shouldUpdate = true;
		this.setState(this.state);
	}


	renderResponse() {
		if (!this.state.response) {
			return;
		} else if (this.state.response.error) {

			return <Response value={this.state.response} />
		}
	}

	renderFetchOnly() {
		if (this.props.item.fetchOnly) {
			//			return <button className='btn' disabled>fetch-only</button>;
		}
	}

	renderInput(key, id) {
		var type = typeof this.state.value[key];
		var value = this.state.displayValue[key];
		var props = {};
		props.onChange = this.onChange.bind(this, key);
		props.id = id;
		props.disabled = this.props.item.fetchOnly;
		if (type === 'number') {
			props.type = 'number';
			props.value = value;
			if (props.value.length === 0) {
				props.className = 'valid invalid';
			}
			props.step = 'any';
			props.required = true;

		} else if (type === 'boolean') {
			props.type = 'checkbox';
			props.checked = value;
		} else {
			props.type = 'text';
			props.value = value;
		}
		return React.DOM.input(props);
	}

	hasChanges() {
		return Object.keys(this.state.changes).length !== 0;
	}

	renderButton() {
		//		if (this.props.item.fetchOnly) {
		//			return <button disabled className='btn'>Fetch-Only</button>;
		//		} else {
		var props = {};
		props.disabled = !this.hasChanges();
		return <button {...props
		}
		className = 'waves-effect btn' > Set < /button>;
			//		}
	}

	renderJson() {
		var items = Object.keys(this.state.displayValue).map((key) => {
			var value = this.state.displayValue[key];
			var id = this.props.item.path + key;
			if (typeof value === 'boolean') {
				var style = {
					display: 'block',
					marginTop: '1rem'
				};
				return (
					<div className="col s12" key={key}>
						<label style={style} >{key}</label>
						{this.renderInput(key, id)}
						<label htmlFor={id}></label>
					</div>
				);
			} else {
				return (
					<div className="input-field col s12" key={key}>
						<label htmlFor={id} className="active">{key}</label>
						{this.renderInput(key)}
					</div>
				);
			}
		});
		return items;
	}

	set(event) {
		event.preventDefault();
		var newValue;
		if (Object.keys(this.state.value).length === 1 && this.state.value[''] !== undefined) {
			newValue = this.state.value[''];
		} else {
			newValue = flatten.unflatten(this.state.value);
		}
		this.props.set(newValue);
	}

	render() {
		this.shouldUpdate = false;
		var away = {
			position: 'absolute',
			left: '-9999px'
		};
		var item = this.props.item;
		var lastChange = item.lastChange.toLocaleTimeString();
		var changes = item.count - 1;
		var statusLine = '' + changes + ' Changes / ' + lastChange;
		var statusLineStyle = {
			fontWeight: '200'
		};
		return (
			<div className='card'>
				<div className='card-content'>
					<span className='card-title grey-text text-darken-2'>{this.props.item.path}</span>
					<form className='row' onSubmit={this.set.bind(this)} disabled={item.fetchOnly}>
						{this.renderJson()}
						<input type="submit" style={away}/>	
					</form>
				</div>
				<div className='card-action' onClick={this.set.bind(this)}>	
					{this.renderResponse()}
					{this.renderButton()}
					{this.renderFetchOnly()}
					<span className='right amber-text text-lighten-1' style={statusLineStyle}>{statusLine}</span>
				</div>
			</div>
		);
	}
}


module.exports = State;