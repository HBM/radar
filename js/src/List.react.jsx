var React = require('react');
var Store = require('./Store');
var Method = require('./Method.react.jsx');
var State = require('./State.react.jsx');
var utils = require('./utils');

class List extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			items: Store.getList()
		};

		this._onChange = this._onChange.bind(this);
	}

	_onChange() {
		console.log(Store.getList());
		this.setState({
			items: Store.getList()
		});
	}

	componentWillMount() {
		Store.addChangeListener(this._onChange);
	}

	componentWillUnmount() {
		Store.removeChangeListener(this._onChange);
	}

	set(path, newValue) {
		utils.setState(path, newValue);
	}

	renderItemContent(item) {
		if (item.value !== undefined) {
			return <State item={item} set={this.set.bind(this, item.path)}/>;
		} else {
			return <Method item={item} />
		}
	}

	renderItems() {
		var items = this.state.items.map((item) => {
			return (
				<li className='col s12 m6 l4' key={item.path}>
					{this.renderItemContent(item)}
				</li>
			);
		});
		return items;
	}

	render() {
		if (this.state.items.length === 0) {
			return (
				<div>
					<h1>no items!</h1> 
				</div>
			);
		} else {
			return (
				<div className='row'>
					<ul>{this.renderItems()}
					</ul> 
				</div>

			);
		}
	}
}

module.exports = List;
