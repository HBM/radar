import React from 'react'
import * as actions from 'redux-jet'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import flatten from 'flat'
import { Textfield, Button, Checkbox, Icon } from 'md-components'

const flatObject = (value) => {
  if (typeof value === 'object') {
    return flatten(value)
  } else {
    var fv = {}
    fv[''] = value
    return fv
  }
}

const unflatObject = (value) => {
  if (typeof value === 'object') {
    const keys = Object.keys(value)
    if (keys.length === 1 && keys[0] === '') {
      return value['']
    }
  }
  return flatten.unflatten(value)
}

const toNameValue = (flat) => {
  return Object.keys(flat)
    .sort(function (a, b) {
      if (a > b) {
        return 1
      } else if (a < b) {
        return -1
      }
      return 0
    })
    .map(function (key) {
      return {name: key, value: flat[key]}
    })
}

const typedValue = (type, onChange) => (event) => {
  if (type === 'number') {
    event.target.typedValue = parseFloat(event.target.value)
  } else if (type === 'boolean') {
    event.target.typedValue = event.target.checked
  } else {
    event.target.typedValue = event.target.value
  }
  onChange(event)
}

const toHex = (number) => {
  const hex = number.toString(16)
  const zeros = 8 - hex.length
  const hex8 = '0'.repeat(zeros) + hex
  const bytes = []
  for (let i = 0; i < 8; i = i + 2) {
    bytes.push(hex8.substr(i, 2))
  }
  return '0x ' + bytes.join(' ')
}

const isInt = (number) => {
  return parseInt(number) === number
}

const createInput = (onChange, disabled) => (nvp) => {
  const type = typeof nvp.value
  switch (typeof nvp.value) {
    case 'string':
      return <Textfield
        disabled={disabled}
        name={nvp.name}
        type='text'
        value={nvp.value}
        label={nvp.name}
        onChange={typedValue(type, onChange)}
        key={nvp.name}
      />
    case 'number':
      return (
        <div className='State-Input-Dec-Hex' key={nvp.name}>
          <Textfield
            disabled={disabled}
            name={nvp.name}
            type='number'
            value={nvp.value}
            label={nvp.name}
            onChange={typedValue(type, onChange)}
            key={nvp.name + '_dec'}
          />
          {isInt(nvp.value) && <Textfield
            disabled
            name={nvp.name}
            type='text'
            value={toHex(nvp.value)}
            label={nvp.name ? 'As HEX' : null}
            key={nvp.name + '_hex'}
          />}
        </div>
      )
    case 'boolean':
      return <Checkbox
        disabled={disabled}
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

export class State extends React.Component {
  constructor (props) {
    super(props)
    const state = props.state
    this.state = {
      formData: flatObject(state.value),
      formDataBak: flatObject(state.value)
    }
  }

  hasChanges () {
    return JSON.stringify(this.state.formData) !== JSON.stringify(this.state.formDataBak)
  }

  componentWillReceiveProps (newProps) {
    const state = newProps.state
    if (!this.hasChanges() || this.props.state.path !== newProps.state.path) {
      this.setState({
        formData: flatObject(state.value)
      })
    }
    this.setState({
      formDataBak: flatObject(state.value)
    })
  }

  cancel = () => {
    this.setState({
      formData: flatObject(unflatObject(this.state.formDataBak))
    })
  }

  onSubmit = (event) => {
    event.preventDefault()
    // set formDataBak = formData so that hasChanges() => false
    // and componentWillReceiveProps updates formData and formDataBak
    this.setState({
      formDataBak: this.state.formData
    })
    this.props.set(this.props.connection, this.props.state.path, unflatObject(this.state.formData))
  }

  assignToFormData = (event) => {
    this.setState({
      formData: { ...this.state.formData, [event.target.name]: event.target.typedValue }
    })
  }

  render () {
    const nvps = toNameValue(this.state.formData)
    return (
      <div className='State'>
        <div className='State-hero'>
          <Icon.Button >
            <Link to={this.props.backUrl} />
            <Icon.ChevronLeft width={30} height={30} className='Split-right-back' />
          </Icon.Button>
          <h1>{this.props.state.path}</h1>
        </div>
        <form onSubmit={this.onSubmit} >
          {nvps.map(createInput(this.assignToFormData, this.props.state.fetchOnly))}
          <hr />
          <Button type='submit' raised disabled={!this.hasChanges()}>Set</Button>
          <Button type='button' disabled={!this.hasChanges()} onClick={this.cancel} >Cancel</Button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    favorites: state.settings.favorites,
    connection: state.settings.connection
  }
}

export default connect(mapStateToProps, actions)(State)
