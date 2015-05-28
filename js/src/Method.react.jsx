var React = require('react');

class Method extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
				<div className='card'>
					<div className='card-content'>
						<span className='card-title'>{this.props.item.path}</span>
						<form>
							<div className='row'>
							<div className='input-field col s12'>
								<textarea className='materialize-textarea'></textarea>
								<label>Arguments</label>
							</div>
							</div>
						</form>
					</div>
					<div className='card-action'>
						<button className='btn waves-effect' type="submit">Call</button>
					</div>
				</div>
		);
	}
}


module.exports = Method;
