var React = require('react');

class Input extends React.Component {
		constructor(props) {
				super(props);
		}

		render() {
				var props = this.props;
				var className = props.className || '';
				if (props.value !== undefined) {
						className += ' active';
				}
				var inputClassName = '';
				if (props.valid !== undefined) {
					if (props.valid === false) {
						inputClassName += 'valid invalid';
					}
				}
			return (
				<div className={'input-field col ' + className}>
					<i className={'prefix ' + props.icon}></i>
					<input id={props.id} type={props.type} 
						onChange={props.onChange} 
						required={props.required}
						className={inputClassName}
						value={props.value}
						autofocus={props.autofocus}
						disabled={props.disabled}
					/>
					<label htmlFor={props.id}>{props.label}</label>
				</div>	
			);
		}
}

module.exports = Input;
