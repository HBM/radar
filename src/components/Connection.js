import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as actions from '../redux-jet/actions'
import { Card, Text, Title, Actions, Content, Textfield, Button } from 'hbm-react-components'
import url from 'url'

class ConnectionForm extends Component {
  constructor (props) {
    super(props)
    this.state = {url: this.props.url, user: this.props.user, password: this.props.password}
  }

  submitForm = (event) => {
    event.preventDefault()
    if (ConnectionForm.isValidWebSocketUrl(this.state.url)) {
      this.props.onSubmit(this.state)
    }
  }

  assignInput = (event) => {
    event.preventDefault()
    this.setState({[event.target.name]: event.target.value})
  }

  static isValidWebSocketUrl (urlString) {
    try {
      const protocol = url.parse(urlString).protocol
      return protocol === 'ws:' || protocol === 'wss:'
    } catch (_) {
      return false
    }
  }

  render () {
    const status = this.props.isConnected ? 'Connected' : 'Disconnected'
    const isValidUrl = ConnectionForm.isValidWebSocketUrl(this.state.url)
    return (
      <Card>
        <form onSubmit={this.submitForm}>
          <Title>
            Jet Daemon Configuration
          </Title>
          <Content>
            <Text>
              {status}
            </Text>
            <Textfield
              onChange={this.assignInput}
              name='url'
              type='text'
              value={this.state.url}
              label='WebSocket URL'
              placeholder='ws://jetbus.io:8080'
              error={!isValidUrl && 'Not a WebSocket URL'}
              required
              autoFocus />
            <Textfield
              onChange={this.assignInput}
              name='user'
              type='text'
              value={this.state.user}
              label='User (optional)'
              placeholder='anonymous' />
            <Textfield
              onChange={this.assignInput}
              name='password'
              type='password'
              value={this.state.password}
              label='Password (optional)'
              disabled={!this.state.user} />
          </Content>
          <Actions>
            <Button type='submit' disabled={!isValidUrl}>
              Login
            </Button>
          </Actions>
        </form>
      </Card>
    )
  }
}

ConnectionForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

class Connection extends Component {
  render () {
    const onSubmit = (newCon) => {
      this.props.close(this.props)
      this.props.connect(newCon)
    }
    return <ConnectionForm {...this.props} onSubmit={onSubmit} />
  }
}

Connection.propTypes = {
  connect: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  const con = state.connection
  return {
    isConnected: state.jet.connection.isConnected,
    url: con.url,
    user: con.user,
    password: con.password
  }
}

export default connect(mapStateToProps, actions)(Connection)
