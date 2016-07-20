/* globals $ */
var React = require('react')
var Input = require('./Input.react.jsx')
var Spinner = require('./Spinner.react.jsx')
var utils = require('./utils')
var Store = require('./Store')

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      connectionStatus: Store.getConnectionStatus(),
      url: window.localStorage.url || '',
      user: window.localStorage.user || '',
      password: window.localStorage.password || ''
    }
    this.state.isValidUrl = this.isValidUrl(this.state.url)
  }

  componentWillMount () {
    Store.addChangeListener(this._onChange.bind(this))
  }

  componentDidMount () {
    utils.login(this.state)
    setTimeout(() => {
      if (this.state.connectionStatus !== 'connected') {
        $('#login').openModal()
      }
    }, 500)
  }

  _onChange () {
    var connectionStatus = Store.getConnectionStatus()
    if (connectionStatus === 'connected' && connectionStatus !== this.state.connectionStatus) {
      $('#login').closeModal()
    }
    this.setState({
      connectionStatus: connectionStatus
    })
  }

  login (event) {
    event.preventDefault()
    utils.login(this.state)
  }

  isValidUrl (url) {
    var wsRegExp = /(ws|wss):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return wsRegExp.test(url)
  }

  setURL (event) {
    window.localStorage.url = event.target.value

    this.setState({
      isValidUrl: this.isValidUrl(event.target.value),
      url: event.target.value
    })
  }

  setUser (event) {
    window.localStorage.user = event.target.value
    this.setState({
      user: event.target.value
    })
  }

  setPassword (event) {
    window.localStorage.password = event.target.value
    this.setState({
      password: event.target.value
    })
  }

  renderSpinner () {
    if (this.state.connectionStatus === 'connecting') {
      return <Spinner />
    }
  }

  render () {
    return (

      <form id='login' className='modal' onSubmit={this.login.bind(this)}>
        <div className='modal-content'>
          <h4>Peer Configuration</h4>
          <div className='row'>
            <Input
              type='url'
              id='url'
              className='s12'
              label='Daemon Websocket URL'
              value={this.state.url}
              onChange={this.setURL.bind(this)}
              placeholder='ws://jetbus.io:8080'
              icon='mdi-file-cloud'
              valid={this.state.isValidUrl}
              required
              autoFocus />
            <Input
              type='text'
              id='user'
              className='s12'
              label='User'
              value={this.state.user}
              onChange={this.setUser.bind(this)}
              placeholder='anonymous'
              icon='mdi-action-account-box'
              valid={this.state.connectionStatus !== 'invalid user'} />
            <Input
              type='password'
              id='password'
              className='s12'
              label='Password'
              value={this.state.password}
              onChange={this.setPassword.bind(this)}
              icon='mdi-communication-vpn-key'
              valid={this.state.connnectionStatus !== 'invalid password'}
              disabled={this.state.user === ''} />
          </div>
        </div>
        <div className='modal-footer'>
          <div className='row'>
            {this.renderSpinner()}
            <button className='btn waves-effect modal-action waves-green' type='submit'>
              Login
            </button>
          </div>
        </div>
      </form>
    )
  }
}

module.exports = Login
