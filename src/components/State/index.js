import React from 'react'
import * as actions from 'redux-jet'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Textfield, Button, Icon } from 'md-components'
import { flatObject, unflatObject, flatToNameValue, toHex, isInt } from './helpers'
import TypedInput from './TypedInput'

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
      return <div>unsported type {typeof nvp.value}</div>
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
    const nvps = flatToNameValue(this.state.formData)
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
