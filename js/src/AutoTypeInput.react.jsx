var React = require('react');
var flatten = require('flat');
var Response = require('./Response.react.jsx');
var id = 0;

class AutoTypeInput extends React.Component {

	render() {
		var type = typeof this.props.value;
		var value = this.props.value;
		var label = this.props.label;
		var props = {};
		props.id = id + label;
		++id;
		props.onChange = this.props.onChange;
		//		props.disabled = this.props.disabled;
		props.readOnly = this.props.readOnly;
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
						<label htmlFor={props.id} className="active">{label}</label>
						{React.DOM.input(props)}
					</div>
			);
		}
	}
};

module.exports = AutoTypeInput;