var React = require('react');
var flatten = require('flat');
var id = 0;

class AutoTypeInput extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			invalid: false
		};
	}


	render() {
		var type = typeof this.props.value;
		var value = this.props.value;
		var label = this.props.label;
		var props = {};
		props.id = id + label;
		var errorMessage = '';
		if (this.state.invalid) {
			props.className = 'validate invalid';
			errorMessage = this.state.errorMessage;
			value = this.state.last;
		}
		++id;
		props.onChange = (event) => {
			if (type === 'number') {
				if (event.target.value === '') {
					this.setState({
						invalid: true,
						last: '',
						errorMessage: 'number required'
					});
					return;
				}
				try {
					this.setState({
						invalid: false
					});
					event.target.typedValue = parseFloat(event.target.value);
				} catch (e) {
					this.setState({
						invalid: true,
						last: event.target.value,
						errorMessage: 'not a number'
					});
					return;
				}
			} else if (type === 'boolean') {
				event.target.typedValue = event.target.checked;
			} else {
				event.target.typedValue = event.target.value;
			}
			this.props.onChange(event);
		};

		props.disabled = this.props.readOnly;
		props.readOnly = this.props.readOnly;
		if (type === 'number') {
			props.type = 'number';
			props.value = value;
			props.step = 'any';
			props.required = true;
		} else if (type === 'boolean') {
			props.type = 'checkbox';
			props.checked = value;
		} else if (type === 'object') {
			props.type = 'text';
			props.value = '<empty object>';
			props.disabled = true;
			props.readOnly = true;
		} else {
			props.type = 'text';
			props.value = value;
		}
		if (typeof value === 'boolean') {
			var style = {
				display: 'block',
				marginTop: '1rem'
			};
			return (
				<div className="col s12" key={label}>
						<label style={style} >{label}</label>
						{React.DOM.input(props)}
						<label htmlFor={props.id}></label>
					</div>
			);
		} else {
			return (
				<div className="input-field col s12" key={label}>
						{React.DOM.input(props)}
						<label data-error={errorMessage} htmlFor={props.id} className="active">{label}</label>
					</div>
			);
		}
	}
};

module.exports = AutoTypeInput;