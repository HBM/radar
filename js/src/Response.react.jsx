var React = require('react');
var flatten = require('flat');
var AutoTypeInput = require('./AutoTypeInput.react.jsx');

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

	renderValue() {
		var flatValue = this.flatValue(this.props.value);
		var items = Object.keys(flatValue).map((key) => {
			var value = flatValue[key];
			if (value === undefined || value === null) {
				return;
			}
			return <AutoTypeInput value={value} label={key} readOnly={true} key={key} />
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