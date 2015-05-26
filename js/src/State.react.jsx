var React = require('react');
var util = require('util');
var flatten = require('flat');
var utils = require('./utils');

var inputTypes = {
	object: 'text', // applies to arrays
	number: 'number',
	string: 'text',
	boolean: 'checkbox'
};


class State extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			changes: {},
			bak: this.flatValue(this.props.item.value),
			value: this.flatValue(this.props.item.value),
			displayValue: this.flatValue(this.props.item.value)
		};
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

	onChangeCheckbox(key, event) {
		this.state.value[key] = event.target.checked;
		this.state.displayValue[key] = event.target.checked;
		if (this.state.bak[key] !== this.state.value[key]) {
			this.state.changes[key] = true;
		} else {
			delete this.state.changes[key];
		}
		this.forceUpdate();
	}

	onChangeNumber(key, event) {
		this.state.value[key] = parseFloat(event.target.value);
		this.state.displayValue[key] = event.target.value;
		if (this.state.bak[key] !== this.state.value[key]) {
			this.state.changes[key] = true;
		} else {
			delete this.state.changes[key];
		}
		this.forceUpdate();
	}

	onChangeString(key, event) {
		this.state.value[key] = event.target.value;
		this.state.displayValue[key] = event.target.value;
		if (this.state.bak[key] !== this.state.value[key]) {
			this.state.changes[key] = true;
		} else {
			delete this.state.changes[key];
		}
		this.forceUpdate();
	}

	renderInput(key) {
		var type = typeof this.state.value[key];
		var value = this.state.displayValue[key];
		if (type === 'number') {
			return <input type = "number"
			value = {
				value
			}
			step = "any"
			onChange = {
				this.onChangeNumber.bind(this, key)
			}
			required
				/ > ;
		} else if (type === 'boolean') {
			return <input type="checkbox" 
				checked={value} 
				onChange={this.onChangeCheckbox.bind(this, key)}
				/>;
		} else {
			return <input type = "text"
			value = {
				value
			}
			onChange = {
				this.onChangeString.bind(this, key)
			}
			required
				/ > ;
		}
	}

	renderButton() {
		if (Object.keys(this.state.changes).length !== 0) {
			return <button type="submit">Set</button>
		} else {
			return <button type = "submit"
			disabled > Set < /button>
		}
	}

	renderJson() {
		var items = Object.keys(this.state.displayValue).map((key) => {
			var value = this.state.displayValue[key];
			var type = inputTypes[typeof value];
			return (
				<div class="State-field" key={key}>
					<label>{key}</label>
					{this.renderInput(key)}
				</div>
			);
		});
		return items;
	}

	setState(event) {
		event.preventDefault();
		var newValue = flatten.unflatten(this.state.value);
		utils.setState(this.props.item.path, newValue);
		console.log(newValue);
	}

	render() {
		return (
			<form onSubmit={this.setState.bind(this)}>
				{this.renderJson()}
				{this.renderButton()}
			</form>
		);
	}
}


module.exports = State;