var React = require('react');
var flatten = require('flat');

class State extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.createState(this.props.item.value);
	}

	createState(value) {
		return {
			changes: {},
			bak: this.flatValue(value),
			value: this.flatValue(value),
			displayValue: this.flatValue(value)
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState(this.createState(nextProps.item.value));
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
		this.setState(this.state);
	}

	renderInput(key, id) {
		var type = typeof this.state.value[key];
		var value = this.state.displayValue[key];
		var props = {};
		props.onChange = this.onChange.bind(this, key);
		props.id = id;
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
		var props = {};
		props.disabled = !this.hasChanges();
		return <button {...props
		}
		className = 'waves-effect btn' > Set < /button>;
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
				return (<div className="col s12" key={key}>
					<label style={style} >{key}</label>
					{this.renderInput(key, id)}
					<label htmlFor={id}></label>
				</div>);
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
		var newValue = flatten.unflatten(this.state.value);
		this.props.set(newValue);
	}

	render() {

		return (
			<div className='card'>
					<div className='card-content'>
						<span className='card-title teal-text text-lighten-2'>{this.props.item.path}</span>
						<form className='row' onSubmit={this.set.bind(this)}>
							{this.renderJson()}
						</form>
					</div>
					<div className='card-action' onClick={this.set.bind(this)}>	
						{this.renderButton()}
					</div>
				</div>
		);
	}
}


module.exports = State;