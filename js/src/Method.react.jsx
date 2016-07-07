var React = require('react')
var utils = require('./utils')
var Response = require('./Response.react.jsx')

class Method extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      areValidArgs: false,
      isEmptyArgs: true,
      argsString: '',
      args: null
    }
  }

  call () {
    utils.callMethod(this.props.item.path, this.state.args)
  }

  validateArguments (event) {
    var changes = {}
    changes.response = null
    try {
      changes.argsString = event.target.value
      changes.args = JSON.parse(changes.argsString)
      changes.areValidArgs = typeof changes.args === 'object' // array or object
      changes.isEmptyArgs = false
    } catch (_) {
      changes.args = null
      changes.areValidArgs = false
      changes.isEmptyArgs = changes.argsString === ''
    }
    this.setState(changes)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.item.callResponse) {
      this.setState({
        response: nextProps.item.callResponse
      })
    }
  }

  renderResponse () {
    if (!this.state.response) {
      return
    }

    return <Response value={this.state.response} />
  }

  render () {
    var textareaClassName = 'materialize-textarea'
    if (!this.state.areValidArgs && !this.state.isEmptyArgs) {
      textareaClassName += ' valid invalid'
    }
    var isButtonDisabled = this.state.isEmptyArgs || !this.state.areValidArgs
    return (
      <div className='card'>
        <div className='card-content'>
          <span className='card-title grey-text text-darken-2'>{this.props.item.path}</span>
          <form>
            <div className='row'>
              <div className='input-field col s12'>
                <textarea className={textareaClassName} onChange={this.validateArguments.bind(this)}></textarea>
                <label>
                  Arguments
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className='card-action'>
          {this.renderResponse()}
          <button className='btn waves-effect' disabled={isButtonDisabled} onClick={this.call.bind(this)}>
            Call
          </button>
        </div>
      </div>
    )
  }
}

module.exports = Method
