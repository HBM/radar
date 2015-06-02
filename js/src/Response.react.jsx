var React = require('react');
var flatten = require('flat');

class Response extends React.Component {
	constructor(props) {
		super(props);
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

	renderField(name, value) {
		var type = typeof value;
		var props = {};
		props.disabled = true;
		props.key = name;
		if (type === 'number') {
			props.type = 'number';
			props.value = value;

		} else if (type === 'boolean') {
			props.type = 'checkbox';
			props.checked = value;
		} else {
			props.type = 'text';
			props.value = value;
		}
		return React.DOM.input(props);
	}

	renderValue() {
		var flatValue = this.flatValue(this.props.value);
		var items = Object.keys(flatValue).map((key) => {
			var value = flatValue[key];
			if (value === undefined || value === null) {
				return;
			}
			if (typeof value === 'boolean') {
				var style = {
					display: 'block',
					marginTop: '1rem'
				};
				return (
					<div className="col s12" key={key}>
						<label style={style} >{key}</label>
						{this.renderField(key, value)}
						<label htmlFor={key}></label>
					</div>
				);
			} else {
				return (
					<div className='input-field col s12' key={key}>
						<label htmlFor={key} className='active'>{key}</label>
						{this.renderField(key, value)}
					</div>
				);
			}
		});
		return items;
	}

	render() {
		return (
			<div className='row'>
					{this.renderValue()}
				</div>
		);
	}
}

module.exports = Response;