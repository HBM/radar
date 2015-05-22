var React = require('react');
var Store = require('./Store');

class List extends React.Component {
		constructor(props) {
				super(props);
				this.state = {
						items: Store.getList() 
				};

				this._onChange = this._onChange.bind(this);
		}

		_onChange() {
			this.setState({items: Store.getList()});
		}

		componentWillMount() {
				Store.addChangeListener(this._onChange);
		}

		componentWillUnmount() {
				Store.removeChangeListener(this._onChange);
		}

		renderItems() {
				this.items.map( (item) => {
					return <li>{item.path}</li>
				});
		}	

		render() {
				if (this.state.items.length === 0) {
						return (
								<div>
								  <h1>no items</h1>
								</div>
						);
				} else {
				return (
						<div>
							<ul>
							 {renderItems()}
							</ul>
						</div>

				);
				}
		}
}

module.exports = List;
