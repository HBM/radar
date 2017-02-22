import React from 'react'
import * as actions from 'redux-jet'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import flatten from 'flat'
import { Textfield, Button, Checkbox, Icon } from 'md-components'

export const flatObject = (value) => {
  if (typeof value === 'object') {
    return flatten(value)
  } else {
    var fv = {}
    fv[''] = value
    return fv
  }
}

export const unflatObject = (value) => {
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

const toHex = (number) => {
  const hex = Math.abs(number).toString(16).slice(-8)
  const zeros = 8 - Math.min(hex.length, 8)
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

class TypedInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = this.getState(props)
  }

  componentWillReceiveProps (props) {
    if (this.state.bak !== props.value) {
      this.setState({
        ...this.state,
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

  onChange = ({target}) => {
    this.setState({value: target.value})
    switch (this.state.type) {
      case 'boolean':
        this.props.onChange(this.props.name, target.checked)
        break
      case 'number':
        if (target.value.endsWith('.')) {
          return
        }
        const value = parseFloat(target.value)
        if (!isNaN(value) && target.value.match(/[0-9]$/)) {
          this.setState({error: false}, () => {
            this.props.onChange(this.props.name, value)
            this.props.onError(this.props.name, false)
          })
        } else {
          this.setState({error: 'Not a number'}, () => {
            this.props.onError(this.props.name, true)
          })
        }
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

const createInput = (onChange, disabled, onError) => (nvp) => {
  switch (typeof nvp.value) {
    case 'string':
    case 'boolean':
      return <TypedInput
        disabled={disabled}
        name={nvp.name}
        value={nvp.value}
        label={nvp.name}
        onChange={onChange}
        key={nvp.name}
        onError={onError}
      />
    case 'number':
      return (
        <div className='State-Input-Dec-Hex' key={nvp.name}>
          <TypedInput
            disabled={disabled}
            name={nvp.name}
            type='string'
            value={nvp.value}
            label={nvp.name}
            onChange={onChange}
            key={nvp.name + '_dec'}
            onError={onError}
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
      formDataBak: flatObject(state.value),
      error: {}
    }
  }

  hasChanges () {
    return JSON.stringify(this.state.formData) !== JSON.stringify(this.state.formDataBak)
  }

  componentWillReceiveProps (newProps) {
    const state = newProps.state
    if (!this.hasChanges() || this.props.state.path !== newProps.state.path) {
      this.setState({
        formData: flatObject(state.value),
        error: {}
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

  assignToFormData = (name, value) => {
    this.setState({
      formData: { ...this.state.formData, [name]: value }
    })
  }

  onError = (name, hasError) => {
    this.setState({error: {...this.state.error, [name]: hasError}})
  }

  hasError () {
    return Object.keys(this.state.error).reduce((prev, name) => prev || this.state.error[name], false)
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
          {nvps.map(createInput(this.assignToFormData, this.props.state.fetchOnly, this.onError))}
          <hr />
          <Button type='submit' raised disabled={!(this.hasChanges() && !this.hasError())}>Set</Button>
          <Button type='button' disabled={!this.hasChanges() && !this.hasError()} onClick={this.cancel} >Cancel</Button>
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
