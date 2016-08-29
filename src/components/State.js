import React from 'react'
import * as actions from '../actions'
import { connect } from 'react-redux'
import flatten from 'flat'
import { Textfield, Button, Checkbox } from 'hbm-react-components'

const flatObject = (value) => {
  if (typeof value === 'object') {
    return flatten(value)
  } else {
    var fv = {}
    fv[''] = value
    return fv
  }
}

const toNameValue = (flat) => {
  return Object.keys(flat)
    .sort(function (a, b) {
      return a - b
    })
    .map(function (key) {
      return {name: key, value: flat[key]}
    })
}

const typedValue = (type, onChange) => (event) => {
  if (type === 'number') {
    event.target.typedValue = parseFloat(event.target.value)
  } else if (type === 'boolean') {
    console.log('XX', event.target, event)
    event.target.typedValue = event.target.value === 'on'
  } else {
    event.target.typedValue = event.target.value
  }
  onChange(event)
}

const createInput = (onChange) => (nvp) => {
  const type = typeof nvp.value
  switch (typeof nvp.value) {
    case 'string':
    case 'number':
      return <Textfield
        name={nvp.name}
        type={type === 'string' ? 'text' : 'number'}
        value={nvp.value}
        label={nvp.name}
        onChange={typedValue(type, onChange)}
        key={nvp.name}
      />
    case 'boolean':
      return <Checkbox
        name={nvp.name}
        checked={nvp.value}
        label={nvp.name}
        onChange={typedValue('boolean', onChange)}
        key={nvp.name}
      />
    default:
      return <Textfield
        name={nvp.name}
        type='text'
        disabled
        value={nvp.value}
        label={nvp.name}
        key={nvp.name}
      />
  }
}

export default class State extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: flatObject(props.state.value),
      formDataBak: flatObject(props.state.value)
    }
  }

  componentWillReceiveProps (newProps) {
    this.setState({
      formData: flatObject(newProps.state.value),
      formDataBak: flatObject(newProps.state.value)
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    this.props.setState(this.props.state.path, flatten.unflatten(this.state.formData))
  }

  assignToFormData = (event) => {
    this.setState({
      formData: { ...this.state.formData, [event.target.name]: event.target.typedValue }
    })
  }

  render () {
    const nvps = toNameValue(this.state.formData)
    const hasChanges = JSON.stringify(this.state.formData) !== JSON.stringify(this.state.formDataBak)
    console.log(nvps)
    return (
      <div className='State'>
        <div className='State-hero'>
          <h1>{this.props.state.path}</h1>
        </div>
        <form onSubmit={this.onSubmit} >
          {nvps.map(createInput(this.assignToFormData))}
          <hr />
          <Button type='submit' raised disabled={!hasChanges}>Apply</Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    favorites: state.favorites
  }
}

export default connect(mapStateToProps, actions)(State)
