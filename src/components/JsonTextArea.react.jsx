var React = require('react')
class JsonTextArea extends React.Component {

  constructor (props) {
    super(props)
    this.onChange = this.onChange.bind(this)
    this.state = this.createState(props.value)
  }

  createState (value) {
    return {
      json: JSON.stringify(value, null, ' '),
      orig: JSON.stringify(value)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState(this.createState(nextProps.value))
  }

  onChange (event) {
    this.setState({
      json: event.target.value
    })
    try {
      var newValue = JSON.parse(event.target.value)
      var newJsonValue = JSON.stringify(newValue)
      if (newJsonValue !== this.state.orig) {
        this.props.onChange(newValue)
      }
    } catch (e) {}
  }

  render () {
    var rows = this.state.json.split('\n').length + 1
    var style = {
      height: (rows * 1.5) + 'em'
    }
    var onChange = this.onChange
    return (
      <div className='col s12'>
        <textarea
          onChange={onChange}
          className='materialize-textarea'
          style={style}
          rows={rows}
          value={this.state.json}>
        </textarea>
      </div>
    )
  }
}

module.exports = JsonTextArea
