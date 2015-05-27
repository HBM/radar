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

	renderInput(key) {
		var type = typeof this.state.value[key];
		var value = this.state.displayValue[key];
		var props = {};
		props.onChange = this.onChange.bind(this, key);
		if (type === 'number') {
			props.type = 'number';
			props.value = value;
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

	renderButton() {
		var props = {};
		var changes = Object.keys(this.state.changes);
		props.disabled = changes.length === 0;
		return <button {...props
		}
		type = 'submit' > Set < /button>;
	}

	renderJson() {
		var items = Object.keys(this.state.displayValue).map((key) => {
			var value = this.state.displayValue[key];
			return (
				<div className="State-field" key={key}>
					<label>{key}</label>
					{this.renderInput(key)}
				</div>
			);
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
			<form onSubmit={this.set.bind(this)}>
				{this.renderJson()}
				{this.renderButton()}
			</form>
		);
	}
}


module.exports = State;