var React = require('react');
var Response = require('./Response.react.jsx');
var AutoTypeInput = require('./AutoTypeInput.react.jsx');
var JsonTextArea = require('./JsonTextArea.react.jsx');
var flatObject = require('./flatObject');
var flatten = require('flat');

class State extends React.Component {
	constructor(props) {
		super(props);
		this.state = this.createState(this.props.item.value);
	}

	createState(value) {
		this.shouldUpdate = true;
		return {
			value: flatObject(value),
			displayValue: flatObject(value),
			displayJsonValue: JSON.stringify(value, null, ' '),
			dirty: false,
			newValue: value
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.item !== nextProps.item) {
			this.setState(this.createState(nextProps.item.value));
		}
		if (nextProps.item.setResponse) {
			if (nextProps.item.setResponse.error) {
				this.setState(this.createState(nextProps.item.value));
			}
			this.setState({
				response: nextProps.item.setResponse
			});
		}
	}

	shouldComponentUpdate() {
		return this.shouldUpdate;
	}

	onChange(key, event) {
		var value = event.target.typedValue;
		var displayValue;
		this.state.response = null;
		this.state.value[key] = value;
		this.state.displayValue[key] = value;
		this.shouldUpdate = true;
		if (Object.keys(this.state.value).length === 1 && this.state.value[''] !== undefined) {
			this.state.newValue = this.state.value[''];
		} else {
			this.state.newValue = flatten.unflatten(this.state.value);
		}
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

	hasChanges() {
		return JSON.stringify(this.props.item.value) !== JSON.stringify(this.state.newValue);
	}

	renderButton() {
		//		if (this.props.item.fetchOnly) {
		//			return <button disabled className='btn'>Fetch-Only</button>;
		//		} else {
		var props = {};
		props.disabled = !this.hasChanges();
		props.onClick = this.set.bind(this);
		return <button {...props
		}
		className = 'waves-effect btn' > Set < /button>;
			//		}
	}

	renderSwitch() {
		var toggleJson = (event) => {
			this.shouldUpdate = true;
			this.setState({
				showJson: event.target.checked
			});
		};
		var style = {
			marginBottom: '20px'
		};
		return (
			<div className="right switch" style={style}>
    					<label>
     		 				Flat
      						<input type="checkbox" onClick={toggleJson} />
      						<span className="lever"></span>
      						JSON
    					</label>
  					</div>
		);
	}

	onJsonChange(newValue) {
		this.setState(this.createState(newValue));
	}

	renderJsonText() {
		if (!this.state.showJson) {
			return;
		}
		var onChange = this.onJsonChange.bind(this);
		return <JsonTextArea onChange={onChange}  value={this.state.newValue} />;
	}

	renderJson() {
		if (this.state.showJson) {
			return;
		}
		var items = Object.keys(this.state.displayValue).map((key) => {
			var value = this.state.displayValue[key];
			var onChange = this.onChange.bind(this, key);
			var readOnly = this.props.item.fetchOnly;
			return <AutoTypeInput value={value} label={key} onChange={onChange} readOnly={readOnly} key={key} />
		});
		return items;
	}

	set(event) {
		event.preventDefault();
		this.props.set(this.state.newValue);
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
		var path_ = item.path.replace(/#/g, '_');
		var jsonTabId = path_ + 'JSON';
		var flatTabId = path_ + 'Flat';
		var headlineStyle = {
			fontSize: '1.2em'
		};
		return (
			<div className='card'>
				<div className='card-content'>
					<span className='card-title grey-text text-darken-4' style={headlineStyle}>{this.props.item.path}</span>
					<form className='row' onSubmit={this.set.bind(this)} disabled={item.fetchOnly}>
						{this.renderJsonText()}
						{this.renderJson()}
						<input type="submit" style={away}/>	
					</form>
				</div>
				<div className='card-action'>	
					{this.renderResponse()}
					{this.renderButton()}
					{this.renderFetchOnly()}
					<span className='right amber-text text-lighten-1' style={statusLineStyle}>{statusLine}</span>
					<div>
					{this.renderSwitch()}
					</div>
				</div>
			</div>
		);
	}
}


module.exports = State;
