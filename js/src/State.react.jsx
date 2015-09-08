var React = require('react');
var Response = require('./Response.react.jsx');
var AutoTypeInput = require('./AutoTypeInput.react.jsx');
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
			changes: {},
			bak: flatObject(value),
			value: flatObject(value),
			displayValue: flatObject(value),
			displayJsonValue: JSON.stringify(value, null, ' '),
			dirty: false
		};
	}
	componentDidMount() {
		$(React.findDOMNode(this.refs.tabs)).tabs();
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

	hasChanges() {
		return Object.keys(this.state.changes).length !== 0 || this.state.dirty;
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

	onJsonChange(event) {
		var dirty;
		this.shouldUpdate = true;
		try {
			var newJsonValue = JSON.stringify(JSON.parse(event.target.value));
			var oldJsonValue = JSON.stringify(this.props.item.value);
			if (newJsonValue !== oldJsonValue) {
				dirty = true;
			} else {
				dirty = false;
			}
		} catch (e) {
			dirty = false;
		}
		this.setState({
			dirty: dirty,
			displayJsonValue: event.target.value
		});
	}

	renderJsonText() {
		if (!this.state.showJson) {
			return;
		}
		var rows = this.state.displayJsonValue.split('\n').length + 1;
		var style = {
			height: (rows + 2) + 'em'
		};
		var onChange = this.onJsonChange.bind(this);
		return (
			<textarea onChange={onChange} className="col s12 materialize-textarea grey-text text-darken-2" style={style}  rows={rows} value={this.state.displayJsonValue}>
			</textarea>
		);
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
		var newValue;
		if (this.state.dirty) {
			newValue = JSON.parse(this.state.displayJsonValue);
		} else {
			if (Object.keys(this.state.value).length === 1 && this.state.value[''] !== undefined) {
				newValue = this.state.value[''];
			} else {
				newValue = flatten.unflatten(this.state.value);
			}
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
		var path_ = item.path.replace(/#/g, '_');
		var jsonTabId = path_ + 'JSON';
		var flatTabId = path_ + 'Flat';
		return (
			<div className='card'>
				<div className='card-content'>
					<span className='card-title grey-text text-darken-2'>{this.props.item.path}</span>
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
					{this.renderSwitch()}
				</div>
			</div>
		);
	}
}


module.exports = State;