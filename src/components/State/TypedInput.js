import React from 'react'
import { Textfield, Checkbox } from 'md-components'

export default class TypedInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getState(props)
  }

  componentWillReceiveProps (props) {
    if (this.state.bak !== props.value) {
      this.setState({
        ...this.getState(props),
        error: false
      })
    }
  }

  getState (props) {
    return {
      bak: props.value,
      value: props.value,
      type: typeof props.value
    }
  }

  onChangeNumber (target) {
    if (target.value.endsWith('.')) {
      this.setState({error: false}, () => {
        this.props.onError(this.props.name, false)
      })
      return
    }
    const value = parseFloat(target.value)
    if (!isNaN(value) && target.value.match(/^[-+]?[0-9]*\.?[0-9]+$/)) { // regex from here: http://www.regular-expressions.info/floatingpoint.html
      this.setState({error: false}, () => {
        this.props.onChange(this.props.name, value)
        this.props.onError(this.props.name, false)
      })
    } else {
      this.setState({error: 'Not a number'}, () => {
        this.props.onError(this.props.name, true)
      })
    }
  }

  onChange = ({target}) => {
    this.setState({value: target.value})
    switch (this.state.type) {
      case 'boolean':
        this.props.onChange(this.props.name, target.checked)
        break
      case 'number':
        this.onChangeNumber(target)
        break
      default:
        this.props.onChange(this.props.name, target.value)
    }
  }

  render () {
    if (this.state.type === 'boolean') {
      return <Checkbox {...this.props} checked={this.state.value} onChange={this.onChange} />
    } else {
      return <Textfield {...this.props} value={this.state.value} onChange={this.onChange} error={this.state.error} />
    }
  }
}
