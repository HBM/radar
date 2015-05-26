var React = require('react');
var util = require('util');

var inputTypes = {
	object: 'text', // applies to arrays
	number: 'number',
	string: 'text',
	boolean: 'checkbox'
};

var flattenObject = function (parent, parentPath, flatTree) {
	if (!parentPath) {
		parentPath = '';
		flatTree = {};
	}
	flatTree[parentPath] = {};
	if (util.isArray(parent)) {
		parent.forEach(function (child, index) {
			var key = '[' + index + ']';
			if (angular.isObject(child)) {
				flattenObject(child, parentPath + '.' + key);
			} else {
				flatTree[parentPath][key] = {
					parent: parent,
					key: index,
					name: key,
					inputType: inputTypes[typeof child]
				};
			}
		});
	} else {
		Object.keys(parent).forEach(function (key) {
			if (typeof parent[key] === 'object' && !util.isArray(parent[key])) {
				flattenObject(parent[key], parentPath + '.' + key);
			} else {
				flatTree[parentPath][key] = {
					parent: parent,
					key: key,
					name: key,
					inputType: inputTypes[typeof parent[key]]
				};
			}
		});
	}
	Object.keys(flatTree).forEach(function (key) {
		if (Object.keys(flatTree[key]).length === 0) {
			delete flatTree[key];
		}
	});
	return flatTree[''];
};


class State extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				path: this.props.key,
				json: JSON.stringify(this.props.item.value, null, '  ')
			};
			console.log(this.props.console.log(this.props.item.value); console.log(flattenObject(this.props.item.value));
			}

			render() {
				return (
					<form>
				{this.state.json}
			</form>
				);
			}
		}


		module.exports = State;