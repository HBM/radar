/* globals $ */
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Input from './Input.react.jsx'

const LoginForm = ({url, user, password, onSubmit}) => {
  let inputs = {
    url: url,
    user: user,
    password: password
  }
  const submitForm = (event) => {
    event.preventDefault()
    if (inputs.url) {
      onSubmit(inputs)
    }
  }
  const assignInput = (name) => {
    return (event) => {
      event.preventDefault()
      inputs[name] = event.target.value
    }
  }
  return (
    <form id='login' className='modal' onSubmit={submitForm}>
      <div className='modal-content'>
        <h4>Peer Configuration</h4>
        <div className='row'>
          <Input
            onChange={assignInput('url')}
            type='url'
            className='s12'
            label='Daemon Websocket URL'
            defaultValue={url}
            placeholder='ws://jetbus.io:8080'
            icon='mdi-file-cloud'
            required
            autoFocus />
          <Input
            onChange={assignInput('user')}
            type='text'
            className='s12'
            label='User'
            value={user}
            placeholder='anonymous'
            icon='mdi-action-account-box' />
          <Input
            onChange={assignInput('password')}
            type='password'
            className='s12'
            label='Password'
            defaultValue={password}
            icon='mdi-communication-vpn-key'
            disabled={!inputs.user} />
        </div>
      </div>
      <div className='modal-footer'>
        <div className='row'>
          <button className='btn waves-effect modal-action waves-green' type='submit'>
            Login
          </button>
        </div>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

class Login extends Component {
  componentDidMount () {
    const { connect, url, user, password } = this.props
    if (url) {
      connect({url, user, password})
    }
    setTimeout(() => {
      if (!this.props.isConnected) {
        $('#login').openModal()
      }
    }, 500)
  }

  render () {
    if (this.props.showConnection) {
      $('#login').openModal()
    }
    return <LoginForm {...this.props} onSubmit={this.props.connect} />
  }
}

Login.propTypes = {
  connect: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const con = state.connection
  return {
    isConnected: con.isConnected,
    url: con.url,
    user: con.user,
    password: con.password,
    showConnection: state.gui.showConnection
  }
}

export default connect(mapStateToProps, actions)(Login)
